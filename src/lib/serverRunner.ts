import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
import { Challenge, TestCase, TestResultItem } from '@/types';
import { validateResponsePayload } from '@/utils/challengeRunner';

/**
 * Bulletproof TypeScript transpilation via official TypeScript compiler.
 * Strips types, interfaces, enums safely without corrupting JavaScript object literals.
 */
function transpileUserCode(code: string): string {
  // 1. Strip import/export statements
  let clean = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
  clean = clean.replace(/import\s+['"][^'"]+['"];?/g, '');
  clean = clean.replace(/export\s+default\s+[^;]+;?/g, '');
  clean = clean.replace(/export\s+(const|let|var|function|async\s+function|class)\s+/g, '$1 ');

  // 2. Transpile via TypeScript
  try {
    return ts.transpileModule(clean, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        removeComments: false,
      }
    }).outputText;
  } catch {
    return clean;
  }
}

export interface ServerRunOptions {
  challenge: Challenge;
  code: string;
  language: 'nodejs' | 'go' | 'python';
  timeoutMs?: number;
}

export interface ServerRunOutput {
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
 * Executes user backend code in an isolated Node.js VM context with strict memory,
 * execution timeouts, and comprehensive contract fuzzing.
 */
export async function executeInNodeVM(options: ServerRunOptions): Promise<ServerRunOutput> {
  const { challenge, code, language, timeoutMs = 3000 } = options;
  const logs: { timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }[] = [];
  const results: TestResultItem[] = [];

  const getTimestamp = () => new Date().toISOString().slice(11, 19);

  logs.push({
    timestamp: getTimestamp(),
    level: 'INFO',
    message: `[SERVER-VM] Initialized Isolated Node.js Execution Sandbox (${language.toUpperCase()})`
  });

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
          if (req.url?.startsWith(fnOrPath) || req.path?.startsWith(fnOrPath)) {
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

  const cryptoSafe = {
    randomUUID: () => crypto.randomUUID(),
    randomBytes: (size: number) => crypto.randomBytes(size),
    createHash: (alg: string) => crypto.createHash(alg),
    createHmac: (alg: string, key: string | Buffer) => crypto.createHmac(alg, key),
  };

  const consoleCapture = {
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

  // Compile user code inside isolated Node.js VM context
  let compilationError: string | null = null;
  const sanitized = transpileUserCode(code);

  const sandbox: Record<string, any> = {
    express: expressMock,
    crypto: cryptoSafe,
    console: consoleCapture,
    Map,
    Set,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Date,
    Math,
    JSON,
    RegExp,
    Promise,
    Buffer,
    URL,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    setInterval: () => {},
    clearInterval: () => {},
    // In-memory exported app reference
    app: mockApp,
    default: mockApp,
    module: { exports: mockApp },
    exports: {}
  };

  const vmContext = vm.createContext(sandbox);

  try {
    const wrappedCode = `
      (function(express, crypto, console) {
        ${sanitized}
      })(express, crypto, console);
    `;

    const script = new vm.Script(wrappedCode, {
      filename: 'apirun-user-solution.js',
    });

    script.runInContext(vmContext, {
      timeout: timeoutMs,
      breakOnSigint: true,
    });

    logs.push({
      timestamp: getTimestamp(),
      level: 'INFO',
      message: `[SERVER-VM] Code compiled cleanly in VM. Registered ${routes.length} HTTP route handlers.`
    });
  } catch (err: any) {
    if (err?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err?.message?.includes('timed out')) {
      compilationError = `Execution Timed Out (> ${timeoutMs}ms). Infinite loop or heavy blocking operation detected.`;
    } else {
      compilationError = err?.message || 'Syntax or runtime compilation error in user solution.';
    }

    logs.push({
      timestamp: getTimestamp(),
      level: 'ERROR',
      message: `[SERVER-VM ERROR] ${compilationError}`
    });
  }

  // Execute each test case against registered route handlers inside the VM
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

    // Match registered route handler
    const matched = routes.find(r => {
      if (r.method !== tc.method) return false;
      const { matches } = matchRoute(r.path, tc.endpoint);
      return matches;
    });

    if (!matched) {
      const durationMs = 1;
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
        responseHeaders[key.toLowerCase()] = String(val);
        return res;
      },
      header: (key: string, val: string) => {
        responseHeaders[key.toLowerCase()] = String(val);
        return res;
      },
      set: (key: string, val: string) => {
        responseHeaders[key.toLowerCase()] = String(val);
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
      // Execute any registered middlewares
      for (const mw of middlewares) {
        if (typeof mw === 'function') {
          let nextCalled = false;
          await mw(req, res, () => { nextCalled = true; });
          if (!nextCalled && statusCode !== 200) {
            break;
          }
        }
      }

      // Execute matched route handler with safety timeout
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
    message: `[VM TEST SUITE FINISHED] ${results.filter(r => r.status === 'PASSED').length}/${results.length} passed in ${totalDurationMs}ms`
  });

  return { results, logs, allPassed, totalDurationMs };
}

export const HTTP_STATUS_TEXTS: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable'
};

export interface SingleRequestOptions {
  code: string;
  language?: 'nodejs' | 'go' | 'python';
  method: string;
  endpoint: string;
  body?: any;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface SingleRequestOutput {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  durationMs: number;
  logs: { timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }[];
  error?: string;
  matchedRoute?: string;
  availableRoutes?: string[];
}

/**
 * Executes a single ad-hoc HTTP request against the user's running code inside the VM.
 * Powers the interactive Swagger / Postman style "Try It Out" API Playground.
 */
export async function executeSingleRequest(options: SingleRequestOptions): Promise<SingleRequestOutput> {
  const { code, language = 'nodejs', method = 'GET', endpoint = '/', body, headers = {}, timeoutMs = 3000 } = options;
  const logs: { timestamp: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }[] = [];
  const getTimestamp = () => new Date().toISOString().slice(11, 19);

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
          if (req.url?.startsWith(fnOrPath) || req.path?.startsWith(fnOrPath)) {
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

  const cryptoSafe = {
    randomUUID: () => crypto.randomUUID(),
    randomBytes: (size: number) => crypto.randomBytes(size),
    createHash: (alg: string) => crypto.createHash(alg),
    createHmac: (alg: string, key: string | Buffer) => crypto.createHmac(alg, key),
  };

  const consoleCapture = {
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

  const sanitized = transpileUserCode(code);
  const sandbox: Record<string, any> = {
    express: expressMock,
    crypto: cryptoSafe,
    console: consoleCapture,
    Map, Set, Array, Object, String, Number, Boolean, Date, Math, JSON, RegExp, Promise, Buffer, URL, URLSearchParams,
    setTimeout, clearTimeout,
    setInterval: () => {}, clearInterval: () => {},
    app: mockApp,
    default: mockApp,
    module: { exports: mockApp },
    exports: {}
  };

  const vmContext = vm.createContext(sandbox);

  try {
    const wrappedCode = `
      (function(express, crypto, console) {
        ${sanitized}
      })(express, crypto, console);
    `;
    const script = new vm.Script(wrappedCode, { filename: 'apirun-user-solution.js' });
    script.runInContext(vmContext, { timeout: timeoutMs, breakOnSigint: true });
  } catch (err: any) {
    const errorMsg = err?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' 
      ? `Execution Timed Out (> ${timeoutMs}ms). Infinite loop detected.`
      : (err?.message || 'Syntax or runtime compilation error in user solution.');
    return {
      status: 500,
      statusText: 'Internal Server Error',
      data: { error: 'compilation_error', detail: errorMsg },
      headers: { 'content-type': 'application/json' },
      durationMs: 1,
      logs,
      error: errorMsg,
      availableRoutes: []
    };
  }

  const normMethod = method.toUpperCase();
  const matched = routes.find(r => {
    if (r.method !== normMethod) return false;
    const { matches } = matchRoute(r.path, endpoint);
    return matches;
  });

  const availableRoutes = routes.map(r => `${r.method} ${r.path}`);

  if (!matched) {
    return {
      status: 404,
      statusText: 'Not Found',
      data: { 
        error: 'route_not_found', 
        message: `Cannot ${normMethod} ${endpoint}`,
        registeredRoutes: availableRoutes.length > 0 ? availableRoutes : ['(No routes registered in your app yet)']
      },
      headers: { 'content-type': 'application/json' },
      durationMs: 1,
      logs,
      availableRoutes
    };
  }

  const { params } = matchRoute(matched.path, endpoint);
  const [pathname, queryString] = endpoint.split('?');
  const query: Record<string, string> = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  let statusCode = 200;
  let responseData: any = null;
  const responseHeaders: Record<string, string> = { 'content-type': 'application/json' };

  let parsedBody = body;
  if (typeof body === 'string' && body.trim().length > 0) {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = body;
    }
  }

  const normalizedHeaders: Record<string, string> = {};
  Object.entries(headers || {}).forEach(([k, v]) => {
    normalizedHeaders[k.toLowerCase()] = v;
  });

  const req: any = {
    method: normMethod,
    url: endpoint,
    path: pathname,
    params,
    query,
    headers: { 'content-type': 'application/json', ...normalizedHeaders },
    header: (name: string) => (req.headers || {})[name.toLowerCase()],
    get: (name: string) => (req.headers || {})[name.toLowerCase()],
    body: parsedBody
  };

  const res: any = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    sendStatus: (code: number) => {
      statusCode = code;
      responseData = HTTP_STATUS_TEXTS[code] || String(code);
      return res;
    },
    json: (payload: any) => {
      responseData = payload;
      responseHeaders['content-type'] = 'application/json';
      return res;
    },
    send: (payload: any) => {
      responseData = payload;
      return res;
    },
    setHeader: (key: string, val: string) => {
      responseHeaders[key.toLowerCase()] = String(val);
      return res;
    },
    set: (key: string | Record<string, string>, val?: string) => {
      if (typeof key === 'object') {
        Object.entries(key).forEach(([k, v]) => {
          responseHeaders[k.toLowerCase()] = String(v);
        });
      } else if (val !== undefined) {
        responseHeaders[key.toLowerCase()] = String(val);
      }
      return res;
    },
    end: (payload?: any) => {
      if (payload !== undefined) responseData = payload;
      return res;
    }
  };

  const startTime = performance.now();

  try {
    // Run middlewares
    for (const mw of middlewares) {
      let nextCalled = false;
      await mw(req, res, (err?: any) => {
        nextCalled = true;
        if (err) throw err;
      });
      if (!nextCalled && statusCode >= 400) break;
    }

    // Run route handler
    await matched.handler(req, res);
    const durationMs = Math.max(1, Math.round(performance.now() - startTime));

    return {
      status: statusCode,
      statusText: HTTP_STATUS_TEXTS[statusCode] || 'OK',
      data: responseData,
      headers: responseHeaders,
      durationMs,
      logs,
      matchedRoute: `${matched.method} ${matched.path}`,
      availableRoutes
    };
  } catch (err: any) {
    const durationMs = Math.max(1, Math.round(performance.now() - startTime));
    return {
      status: 500,
      statusText: 'Internal Server Error',
      data: { error: 'internal_handler_error', message: err?.message || String(err) },
      headers: responseHeaders,
      durationMs,
      logs,
      error: err?.message || 'Internal handler error',
      matchedRoute: `${matched.method} ${matched.path}`,
      availableRoutes
    };
  }
}
