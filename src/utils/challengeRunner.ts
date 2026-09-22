import { Challenge, TestCase, TestResultItem } from '../types';

export interface RunTestOptions {
  challenge: Challenge;
  code: string;
  language: 'nodejs' | 'go' | 'python';
  serverUrl?: string;
  isLocalServerMode?: boolean;
}

export interface RunTestOutput {
  results: TestResultItem[];
  logs: { timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }[];
  allPassed: boolean;
  totalDurationMs: number;
}

/**
 * Normalizes and matches route paths (e.g. /users/:id matching /users/123 or /kv/get/:key)
 */
function matchRoute(routePattern: string, actualPath: string): { matches: boolean; params: Record<string, string> } {
  const cleanPattern = routePattern.split('?')[0].replace(/\/$/, '') || '/';
  const cleanActual = actualPath.split('?')[0].replace(/\/$/, '') || '/';

  const patternParts = cleanPattern.split('/');
  const actualParts = cleanActual.split('/');

  if (patternParts.length !== actualParts.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const pPart = patternParts[i];
    const aPart = actualParts[i];

    if (pPart.startsWith(':')) {
      const paramName = pPart.slice(1);
      params[paramName] = aPart;
    } else if (pPart.toLowerCase() !== aPart.toLowerCase()) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

/**
 * Converts TypeScript / ES module source into runnable vanilla browser JavaScript
 */
export function stripTypeScript(code: string): string {
  let cleaned = code;

  // 1. Strip import statements (single-line or multiline, with or without semicolons)
  cleaned = cleaned.replace(/import\s+(?:(?:(?:\*\s+as\s+\w+|[\w\s{},*]+)\s+from\s+)?['"][^'"]+['"]|['"][^'"]+['"])\s*;?/g, '');

  // 2. Strip export statements
  cleaned = cleaned.replace(/export\s+default\s+[^;]+;?/g, '');
  cleaned = cleaned.replace(/export\s+(const|let|var|function|async\s+function|class)\s+/g, '$1 ');

  // 3. Strip interface declarations (single and multiline)
  cleaned = cleaned.replace(/interface\s+\w+(?:<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\n\}/g, '');
  cleaned = cleaned.replace(/interface\s+\w+(?:<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[^\}]*\}/g, '');

  // 4. Strip type aliases
  cleaned = cleaned.replace(/type\s+\w+(?:<[^>]*>)?\s*=\s*[^;]+;/g, '');

  // 5. Strip generic type arguments like <string, ShortLink> or <T>
  cleaned = cleaned.replace(/<[A-Za-z0-9_,\s|&<>\[\]]+>(?=\s*[\(\.])/g, '');

  // 6. Strip 'as Type' type assertions
  cleaned = cleaned.replace(/\s+as\s+[A-Za-z0-9_<>[\]|&?]+/g, '');

  // 7. Strip function return type annotations, e.g. ): Promise<void> =>, ): boolean =>, ): void {
  cleaned = cleaned.replace(/\):\s*[A-Za-z0-9_<>[\]|&?]+\s*(?=[={])/g, ') ');

  // 8. Strip parameter types, e.g. (req: Request, res: Response) or (name: string, email: string)
  cleaned = cleaned.replace(/(\b\w+)\s*:\s*[A-Za-z0-9_<>[\]|&?]+(?=\s*[,)])/g, '$1');

  // 9. Strip variable type annotations, e.g. const users: User[] = [] or let map: Map = ...
  cleaned = cleaned.replace(/(const|let|var)\s+(\w+)\s*:\s*[A-Za-z0-9_<>[\]|&?]+(?=\s*=)/g, '$1 $2');

  return cleaned;
}

/**
 * Performs strict, robust validation against the expected response contract.
 * Prevents substring false-positives (e.g. "pongg" matching "pong").
 */
export function validateResponsePayload(actualData: any, expectedSnippet?: string): boolean {
  if (!expectedSnippet) return true;

  // 1. If actualData is already parsed object
  if (actualData && typeof actualData === 'object') {
    // Try parsing expectedSnippet as full JSON
    try {
      const parsedExpected = JSON.parse(expectedSnippet);
      if (typeof parsedExpected === 'object' && parsedExpected !== null) {
        return Object.entries(parsedExpected).every(([k, v]) => {
          if (typeof v === 'object' && v !== null) {
            return JSON.stringify(actualData[k]) === JSON.stringify(v);
          }
          return actualData[k] === v;
        });
      }
    } catch {
      // Not full JSON object, proceed to key-value matching
    }

    // Try key: "value" or "key": "value" pattern match
    const kvMatch = expectedSnippet.match(/"?([a-zA-Z0-9_-]+)"?\s*:\s*(?:"([^"]*)"|(\d+)|(true|false|null))/);
    if (kvMatch) {
      const key = kvMatch[1];
      const strVal = kvMatch[2];
      const numVal = kvMatch[3];
      const boolVal = kvMatch[4];

      if (key in actualData) {
        const actualVal = actualData[key];
        if (strVal !== undefined) {
          return String(actualVal) === strVal;
        }
        if (numVal !== undefined) {
          return Number(actualVal) === Number(numVal);
        }
        if (boolVal !== undefined) {
          return String(actualVal) === boolVal;
        }
      }
      return false;
    }
  }

  // 2. String comparison
  const actualStr = typeof actualData === 'object' ? JSON.stringify(actualData) : String(actualData ?? '');

  // Try parsing actualStr as JSON
  try {
    const parsed = JSON.parse(actualStr);
    if (typeof parsed === 'object' && parsed !== null) {
      return validateResponsePayload(parsed, expectedSnippet);
    }
  } catch {}

  // Strict word/token boundary match
  const cleanSnippet = expectedSnippet.replace(/["']/g, '').trim();
  const escaped = cleanSnippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundaryRegex = new RegExp(`(?:"|\\b)${escaped}(?:"|\\b)`, 'i');
  return boundaryRegex.test(actualStr);
}

/**
 * Real In-Browser JavaScript/Node execution & contract evaluator
 */
export async function runChallengeTests(options: RunTestOptions): Promise<RunTestOutput> {
  const { challenge, code, language, serverUrl, isLocalServerMode } = options;
  const logs: { timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }[] = [];
  const results: TestResultItem[] = [];

  const getTimestamp = () => new Date().toISOString().slice(11, 19);

  logs.push({
    timestamp: getTimestamp(),
    level: 'INFO',
    message: `[RUNTIME] Initialized APIRun Evaluation Engine (${language.toUpperCase()})`
  });

  // MODE 1: Real Local Server Fetch Mode (Target: http://localhost:8000)
  if (isLocalServerMode && serverUrl) {
    logs.push({
      timestamp: getTimestamp(),
      level: 'INFO',
      message: `Connecting to local backend at ${serverUrl}...`
    });

    for (let i = 0; i < challenge.testCases.length; i++) {
      const tc = challenge.testCases[i];
      const targetUrl = `${serverUrl.replace(/\/$/, '')}${tc.endpoint}`;
      const startTime = performance.now();

      try {
        const response = await fetch(targetUrl, {
          method: tc.method,
          headers: {
            'Content-Type': 'application/json',
            ...(tc.requestHeaders || {})
          },
          body: tc.requestPayload ? (typeof tc.requestPayload === 'string' ? tc.requestPayload : JSON.stringify(tc.requestPayload)) : undefined
        });

        const durationMs = Math.round(performance.now() - startTime);
        let actualBody: any = '';
        try {
          const rawText = await response.text();
          try {
            actualBody = JSON.parse(rawText);
          } catch {
            actualBody = rawText;
          }
        } catch {
          actualBody = '';
        }

        const actualStatus = response.status;
        const statusPassed = actualStatus === tc.expectedStatus;
        const snippetPassed = validateResponsePayload(actualBody, tc.expectedResponseSnippet);
        const passed = statusPassed && snippetPassed;

        results.push({
          testId: tc.id,
          name: tc.name,
          category: tc.category,
          status: passed ? 'PASSED' : 'FAILED',
          durationMs,
          isHidden: tc.isHidden,
          endpoint: tc.endpoint,
          method: tc.method,
          expectedStatus: tc.expectedStatus,
          actualStatus,
          requestPayload: tc.requestPayload,
          expectedResponse: tc.expectedResponseSnippet,
          actualResponse: actualBody,
          logs: [
            `${tc.method} ${tc.endpoint} -> HTTP ${actualStatus} (${durationMs}ms)`,
            `Expected HTTP ${tc.expectedStatus}, received HTTP ${actualStatus}`,
            passed ? 'Assertion passed.' : 'Response status or body contract mismatch.'
          ]
        });

        logs.push({
          timestamp: getTimestamp(),
          level: passed ? 'INFO' : 'ERROR',
          message: `${passed ? '✓' : '✗'} Test #${i + 1}: ${tc.name} [HTTP ${actualStatus}] (${durationMs}ms)`
        });
      } catch (err: any) {
        const durationMs = Math.round(performance.now() - startTime);
        results.push({
          testId: tc.id,
          name: tc.name,
          category: tc.category,
          status: 'FAILED',
          durationMs,
          isHidden: tc.isHidden,
          endpoint: tc.endpoint,
          method: tc.method,
          expectedStatus: tc.expectedStatus,
          actualStatus: 0,
          requestPayload: tc.requestPayload,
          expectedResponse: tc.expectedResponseSnippet,
          actualResponse: `Connection Error: ${err.message || 'Server unreachable at ' + targetUrl}`,
          logs: [
            `Connection to ${targetUrl} failed.`,
            `Verify your local server is running on ${serverUrl} and CORS is enabled.`
          ]
        });

        logs.push({
          timestamp: getTimestamp(),
          level: 'ERROR',
          message: `✗ Test #${i + 1}: ${tc.name} -> Connection refused to ${serverUrl}`
        });
      }
    }

    const allPassed = results.length > 0 && results.every(r => r.status === 'PASSED');
    const totalDurationMs = results.reduce((a, b) => a + (b.durationMs || 0), 0);

    return { results, logs, allPassed, totalDurationMs };
  }

  // MODE 2: In-Browser Real JavaScript / Node.js Engine
  type RouteHandler = (req: any, res: any) => Promise<any> | any;
  type MiddlewareHandler = (req: any, res: any, next: (err?: any) => void) => Promise<any> | any;

  const routes: { method: string; path: string; handler: RouteHandler }[] = [];
  const middlewares: MiddlewareHandler[] = [];

  const mockApp: any = {
    use: (fnOrPath: any, maybeFn?: any) => {
      if (typeof fnOrPath === 'function') {
        middlewares.push(fnOrPath);
      } else if (typeof maybeFn === 'function') {
        middlewares.push((req, res, next) => {
          if (req.url.startsWith(fnOrPath) || req.path.startsWith(fnOrPath)) {
            return maybeFn(req, res, next);
          }
          next();
        });
      }
    },
    get: (path: string, handler: RouteHandler) => routes.push({ method: 'GET', path, handler }),
    post: (path: string, handler: RouteHandler) => routes.push({ method: 'POST', path, handler }),
    put: (path: string, handler: RouteHandler) => routes.push({ method: 'PUT', path, handler }),
    delete: (path: string, handler: RouteHandler) => routes.push({ method: 'DELETE', path, handler }),
    patch: (path: string, handler: RouteHandler) => routes.push({ method: 'PATCH', path, handler }),
    listen: () => {}
  };

  const expressMock = () => mockApp;
  expressMock.json = () => (_req: any, _res: any, next: any) => { if (next) next(); };
  expressMock.urlencoded = () => (_req: any, _res: any, next: any) => { if (next) next(); };
  expressMock.Router = () => mockApp;

  const cryptoMock = {
    randomUUID: () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'f47ac10b-58cc-4372-a567-' + Math.random().toString(16).substring(2, 14);
    },
    randomBytes: (n: number) => ({
      toString: (enc: string) => {
        const hex = '0123456789abcdef';
        let str = '';
        for (let i = 0; i < n * 2; i++) str += hex[Math.floor(Math.random() * hex.length)];
        return enc === 'hex' ? str : btoa(str).slice(0, n);
      }
    }),
    createHash: (_alg: string) => ({
      update: (_data: any) => ({ digest: (_enc?: string) => 'hash_' + Math.random().toString(36).substring(2, 10) })
    }),
    createHmac: (_alg: string, _secret: string) => ({
      update: (_data: any) => ({ digest: (_enc?: string) => 'hmac_' + Math.random().toString(36).substring(2, 10) })
    })
  };

  const consoleMock = {
    log: (...args: any[]) => {
      logs.push({ timestamp: getTimestamp(), level: 'INFO', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
    },
    info: (...args: any[]) => {
      logs.push({ timestamp: getTimestamp(), level: 'INFO', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
    },
    warn: (...args: any[]) => {
      logs.push({ timestamp: getTimestamp(), level: 'WARN', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
    },
    error: (...args: any[]) => {
      logs.push({ timestamp: getTimestamp(), level: 'ERROR', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
    }
  };

  // Compile user code inside browser sandbox
  let compilationError: string | null = null;
  try {
    const sanitized = stripTypeScript(code);
    const runnerFn = new Function(
      'express',
      'crypto',
      'console',
      sanitized
    );

    runnerFn(expressMock, cryptoMock, consoleMock);
    logs.push({
      timestamp: getTimestamp(),
      level: 'INFO',
      message: `Compiled source successfully. Registered ${routes.length} route handlers.`
    });
  } catch (err: any) {
    compilationError = err?.message || 'Syntax or compilation error in user code';
    logs.push({
      timestamp: getTimestamp(),
      level: 'ERROR',
      message: `Compilation failed: ${compilationError}`
    });
  }

  // Execute test cases against registered handlers
  for (let i = 0; i < challenge.testCases.length; i++) {
    const tc = challenge.testCases[i];
    const startTime = performance.now();

    if (compilationError) {
      results.push({
        testId: tc.id,
        name: tc.name,
        category: tc.category,
        status: 'FAILED',
        durationMs: 1,
        isHidden: tc.isHidden,
        endpoint: tc.endpoint,
        method: tc.method,
        expectedStatus: tc.expectedStatus,
        actualStatus: 500,
        requestPayload: tc.requestPayload,
        expectedResponse: tc.expectedResponseSnippet,
        actualResponse: JSON.stringify({ error: 'compilation_error', detail: compilationError }, null, 2),
        logs: [`Compilation Error: ${compilationError}`]
      });
      continue;
    }

    // Match route handler
    const matched = routes.find(r => {
      if (r.method !== tc.method) return false;
      const { matches } = matchRoute(r.path, tc.endpoint);
      return matches;
    });

    if (!matched) {
      const durationMs = 2;
      results.push({
        testId: tc.id,
        name: tc.name,
        category: tc.category,
        status: 'FAILED',
        durationMs,
        isHidden: tc.isHidden,
        endpoint: tc.endpoint,
        method: tc.method,
        expectedStatus: tc.expectedStatus,
        actualStatus: 404,
        requestPayload: tc.requestPayload,
        expectedResponse: tc.expectedResponseSnippet,
        actualResponse: JSON.stringify({ error: 'route_not_found', path: tc.endpoint, method: tc.method }, null, 2),
        logs: [
          `No route handler registered for ${tc.method} ${tc.endpoint}`,
          `Expected route pattern matching ${tc.endpoint}`
        ]
      });

      logs.push({
        timestamp: getTimestamp(),
        level: 'ERROR',
        message: `✗ Test #${i + 1}: ${tc.name} [HTTP 404 Route Not Found]`
      });
      continue;
    }

    // Prepare simulated Request and Response objects
    const { params } = matchRoute(matched.path, tc.endpoint);
    let statusCode = 200;
    let responseData: any = null;
    const responseHeaders: Record<string, string> = {};

    let parsedBody: any = {};
    if (tc.requestPayload) {
      try {
        parsedBody = typeof tc.requestPayload === 'string' ? JSON.parse(tc.requestPayload) : tc.requestPayload;
      } catch {
        parsedBody = tc.requestPayload;
      }
    }

    const [pathname, queryString] = tc.endpoint.split('?');
    const query: Record<string, string> = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((val, key) => {
        query[key] = val;
      });
    }

    const req: any = {
      method: tc.method,
      url: tc.endpoint,
      path: pathname,
      params,
      query,
      headers: { 'content-type': 'application/json', ...(tc.requestHeaders || {}) },
      header: (name: string) => (tc.requestHeaders || {})[name.toLowerCase()] || (req.headers || {})[name.toLowerCase()],
      get: (name: string) => (tc.requestHeaders || {})[name.toLowerCase()] || (req.headers || {})[name.toLowerCase()],
      body: parsedBody
    };

    const res: any = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      sendStatus: (code: number) => {
        statusCode = code;
        responseData = { status: code };
        return res;
      },
      setHeader: (key: string, val: string) => {
        responseHeaders[key.toLowerCase()] = val;
        return res;
      },
      header: (key: string, val: string) => {
        responseHeaders[key.toLowerCase()] = val;
        return res;
      },
      set: (key: string, val: string) => {
        responseHeaders[key.toLowerCase()] = val;
        return res;
      },
      getHeader: (key: string) => responseHeaders[key.toLowerCase()],
      get: (key: string) => responseHeaders[key.toLowerCase()],
      json: (data: any) => {
        responseData = data;
        return res;
      },
      send: (data: any) => {
        responseData = data;
        return res;
      },
      redirect: (arg1: any, arg2?: any) => {
        if (typeof arg1 === 'number') {
          statusCode = arg1;
          responseHeaders['location'] = String(arg2 || '');
        } else {
          statusCode = 302;
          responseHeaders['location'] = String(arg1 || '');
        }
        responseData = { redirect: responseHeaders['location'] };
        return res;
      }
    };

    try {
      // Execute any registered middleware
      for (const mw of middlewares) {
        if (typeof mw === 'function') {
          let nextCalled = false;
          await mw(req, res, () => { nextCalled = true; });
          if (!nextCalled && statusCode !== 200) {
            break;
          }
        }
      }

      // Execute matched route handler
      await matched.handler(req, res);
      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      const actualResponseStr = typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : String(responseData ?? '');
      const statusPassed = statusCode === tc.expectedStatus;
      const snippetPassed = validateResponsePayload(responseData, tc.expectedResponseSnippet);
      const passed = statusPassed && snippetPassed;

      results.push({
        testId: tc.id,
        name: tc.name,
        category: tc.category,
        status: passed ? 'PASSED' : 'FAILED',
        durationMs,
        isHidden: tc.isHidden,
        endpoint: tc.endpoint,
        method: tc.method,
        expectedStatus: tc.expectedStatus,
        actualStatus: statusCode,
        requestPayload: tc.requestPayload,
        expectedResponse: tc.expectedResponseSnippet,
        actualResponse: actualResponseStr,
        logs: [
          `Handler executed in ${durationMs}ms`,
          `Received HTTP ${statusCode} (Expected: ${tc.expectedStatus})`,
          passed ? 'Assertion passed.' : `Validation failed: expected HTTP ${tc.expectedStatus}, got HTTP ${statusCode}`
        ]
      });

      logs.push({
        timestamp: getTimestamp(),
        level: passed ? 'INFO' : 'ERROR',
        message: `${passed ? '✓' : '✗'} Test #${i + 1}: ${tc.name} [HTTP ${statusCode}] (${durationMs}ms)`
      });
    } catch (handlerErr: any) {
      const durationMs = Math.max(1, Math.round(performance.now() - startTime));
      results.push({
        testId: tc.id,
        name: tc.name,
        category: tc.category,
        status: 'FAILED',
        durationMs,
        isHidden: tc.isHidden,
        endpoint: tc.endpoint,
        method: tc.method,
        expectedStatus: tc.expectedStatus,
        actualStatus: 500,
        requestPayload: tc.requestPayload,
        expectedResponse: tc.expectedResponseSnippet,
        actualResponse: JSON.stringify({ error: 'internal_handler_error', message: handlerErr?.message }, null, 2),
        logs: [`Runtime Error in handler: ${handlerErr?.message}`]
      });

      logs.push({
        timestamp: getTimestamp(),
        level: 'ERROR',
        message: `✗ Test #${i + 1}: ${tc.name} -> Runtime exception: ${handlerErr?.message}`
      });
    }
  }

  const allPassed = results.length > 0 && results.every(r => r.status === 'PASSED');
  const totalDurationMs = results.reduce((a, b) => a + (b.durationMs || 0), 0);

  logs.push({
    timestamp: getTimestamp(),
    level: allPassed ? 'INFO' : 'WARN',
    message: `[TEST SUITE COMPLETED] ${results.filter(r => r.status === 'PASSED').length}/${results.length} passed in ${totalDurationMs}ms`
  });

  return { results, logs, allPassed, totalDurationMs };
}
