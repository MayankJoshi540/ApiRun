import { Challenge, UserStats } from '../types';

export const initialUserStats: UserStats = {
  solvedCount: 0,
  challengesSolved: 0,
  totalChallenges: 15,
  totalTestsPassed: 0,
  totalSubmissions: 0,
  averageLatencyMs: 0,
  currentStreak: 0,
  rankTitle: 'Backend Engineer',
};

export const challenges: Challenge[] = [
  // ── 1. HTTP FUNDAMENTALS ──
  {
    id: 'ping-health-api',
    title: 'Ping & Health Check API',
    slug: 'ping-health-api',
    difficulty: 'BEGINNER',
    category: 'HTTP Fundamentals',
    summary: 'Build your first API endpoints: a ping responder and a service health status check.',
    estimatedMinutes: 5,
    concepts: ['HTTP', 'REST'],
    status: 'UNSOLVED',
    problemStatement: `Welcome to APIRun! In this introductory challenge, you will implement standard diagnostic endpoints found in every production backend service.

Your service must expose two GET routes:
1. \`GET /ping\` &mdash; Responds with a simple JSON message \`{ "message": "pong" }\` with HTTP status **200 OK**.
2. \`GET /health\` &mdash; Responds with the service status \`{ "status": "ok", "uptime": 100 }\` with HTTP status **200 OK**.`,
    requirements: [
      {
        id: 'p-req-1',
        title: 'GET /ping implementation',
        detail: 'Return HTTP status 200 OK with JSON body: {"message": "pong"}.',
        isCritical: true,
        badge: 'HTTP GET'
      },
      {
        id: 'p-req-2',
        title: 'GET /health implementation',
        detail: 'Return HTTP status 200 OK with JSON body: {"status": "ok", "uptime": 100}.',
        isCritical: true,
        badge: 'JSON'
      }
    ],
    constraints: [
      'Content-Type must be application/json',
      'Both endpoints must return HTTP 200 OK'
    ],
    endpoints: [
      {
        id: 'ep-get-ping',
        method: 'GET',
        path: '/ping',
        summary: 'Ping heartbeat check',
        description: 'Returns a pong response confirming the server is alive.',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Heartbeat response',
            exampleJson: JSON.stringify({ message: 'pong' }, null, 2)
          }
        ],
        curlExample: 'curl -X GET http://localhost:8000/ping'
      },
      {
        id: 'ep-get-health',
        method: 'GET',
        path: '/health',
        summary: 'Service health check',
        description: 'Returns operational status of the service.',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Health status response',
            exampleJson: JSON.stringify({ status: 'ok', uptime: 100 }, null, 2)
          }
        ],
        curlExample: 'curl -X GET http://localhost:8000/health'
      }
    ],
    testCases: [
      {
        id: 'p-tc1',
        name: 'GET /ping returns 200 OK with pong',
        category: 'Contract',
        description: 'Calling GET /ping returns 200 OK with {"message": "pong"}.',
        endpoint: '/ping',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"message": "pong"'
      },
      {
        id: 'p-tc2',
        name: 'GET /health returns 200 OK with status ok',
        category: 'Contract',
        description: 'Calling GET /health returns 200 OK with {"status": "ok"}.',
        endpoint: '/health',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"status": "ok"'
      },
      {
        id: 'p-tc3',
        name: 'Returns proper JSON Content-Type [Hidden]',
        category: 'Edge Case',
        description: 'Ensures JSON content type header is returned.',
        endpoint: '/ping',
        method: 'GET',
        isHidden: true,
        expectedStatus: 200,
        expectedResponseSnippet: '"message": "pong"'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// TODO 1: Implement GET /ping
// - Return HTTP 200 with JSON: { message: 'pong' }
app.get('/ping', (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'pong' });
});

// TODO 2: Implement GET /health
// - Return HTTP 200 with JSON: { status: 'ok', uptime: 100 }
app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok', uptime: 100 });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "pong"})
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "ok", "uptime": 100})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI

app = FastAPI(title="Ping & Health Check API")

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/health")
def health():
    return {"status": "ok", "uptime": 100}`
    }
  },

  // ── 2. PAYLOAD VALIDATION ──
  {
    id: 'echo-validation-api',
    title: 'Echo & Request Body Validation',
    slug: 'echo-validation-api',
    difficulty: 'BEGINNER',
    category: 'Data Validation',
    summary: 'Parse incoming JSON payloads, enforce required fields, and reject malformed bodies with 400 Bad Request.',
    estimatedMinutes: 10,
    concepts: ['HTTP', 'Validation'],
    status: 'UNSOLVED',
    problemStatement: `Implement a POST endpoint that parses an incoming JSON payload and performs validation.

Your service must expose:
\`POST /api/v1/echo\`

**Behavior:**
- If the body contains a valid non-empty \`message\` string: Return **HTTP 200 OK** with:
  \`{ "echo": "<message>", "length": <number of characters> }\`
- If \`message\` is missing, null, or empty string: Return **HTTP 400 Bad Request** with:
  \`{ "error": "missing_message", "message": "Field 'message' is required." }\``,
    requirements: [
      {
        id: 'e-req-1',
        title: 'POST /api/v1/echo valid payload',
        detail: 'Return 200 OK with echo string and character length.',
        isCritical: true,
        badge: 'HTTP POST'
      },
      {
        id: 'e-req-2',
        title: '400 Bad Request on missing message',
        detail: 'Return 400 Bad Request when message field is omitted or empty.',
        isCritical: true,
        badge: 'Validation'
      }
    ],
    constraints: [
      'Reject empty or whitespace-only messages with 400 Bad Request',
      'Content-Type must be application/json'
    ],
    endpoints: [
      {
        id: 'ep-post-echo',
        method: 'POST',
        path: '/api/v1/echo',
        summary: 'Echo validated text',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Successfully parsed and echoed',
            exampleJson: JSON.stringify({ echo: 'Hello Backend', length: 13 }, null, 2)
          },
          {
            statusCode: 400,
            statusText: 'Bad Request',
            description: 'Missing or empty message field',
            exampleJson: JSON.stringify({ error: 'missing_message', message: "Field 'message' is required." }, null, 2)
          }
        ],
        curlExample: 'curl -X POST http://localhost:8000/api/v1/echo -H "Content-Type: application/json" -d \'{"message": "Hello Backend"}\''
      }
    ],
    testCases: [
      {
        id: 'e-tc1',
        name: 'Echoes valid message with 200 OK',
        category: 'Contract',
        description: 'POST with message "Hello APIRun" returns 200 with echo and length 11.',
        endpoint: '/api/v1/echo',
        method: 'POST',
        requestPayload: JSON.stringify({ message: 'Hello APIRun' }),
        expectedStatus: 200,
        expectedResponseSnippet: '"echo": "Hello APIRun"'
      },
      {
        id: 'e-tc2',
        name: 'Rejects missing message with 400 Bad Request',
        category: 'Validation',
        description: 'POST with empty payload returns 400 Bad Request with error missing_message.',
        endpoint: '/api/v1/echo',
        method: 'POST',
        requestPayload: JSON.stringify({}),
        expectedStatus: 400,
        expectedResponseSnippet: '"error": "missing_message"'
      },
      {
        id: 'e-tc3',
        name: 'Rejects empty string message with 400 [Hidden]',
        category: 'Edge Case',
        description: 'POST with message "" must return 400 Bad Request.',
        endpoint: '/api/v1/echo',
        method: 'POST',
        isHidden: true,
        requestPayload: JSON.stringify({ message: '' }),
        expectedStatus: 400,
        expectedResponseSnippet: 'missing_message'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// TODO: Implement POST /api/v1/echo
// - Read req.body.message
// - If message missing or empty: return 400 with { error: 'missing_message', message: "Field 'message' is required." }
// - If valid: return 200 with { echo: message, length: message.length }
app.post('/api/v1/echo', (req: Request, res: Response) => {
  const message = req.body?.message;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'missing_message',
      message: "Field 'message' is required."
    });
  }

  return res.status(200).json({
    echo: message,
    length: message.length
  });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type EchoRequest struct {
	Message string \`json:"message"\`
}

func main() {
	http.HandleFunc("/api/v1/echo", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var req EchoRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Message) == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing_message"})
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"echo":   req.Message,
			"length": len(req.Message),
		})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class EchoPayload(BaseModel):
    message: str

@app.post("/api/v1/echo")
def echo(payload: EchoPayload):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="missing_message")
    return {"echo": payload.message, "length": len(payload.message)}`
    }
  },

  // ── 3. QUERY PARAMETERS ──
  {
    id: 'greeting-query-api',
    title: 'Query Parameters & Dynamic Defaults',
    slug: 'greeting-query-api',
    difficulty: 'BEGINNER',
    category: 'REST Routing',
    summary: 'Extract URL query parameters (?name=...&salutation=...) and apply sensible fallbacks.',
    estimatedMinutes: 8,
    concepts: ['HTTP', 'REST'],
    status: 'UNSOLVED',
    problemStatement: `Implement a dynamic greeting endpoint that extracts parameters from the query string.

Endpoint: \`GET /api/v1/greet\`

**Behavior:**
- Query param \`name\` defaults to \`"Guest"\` if omitted or empty.
- Query param \`salutation\` defaults to \`"Hello"\` if omitted or empty.
- Returns **HTTP 200 OK** with: \`{ "greeting": "<salutation>, <name>!" }\``,
    requirements: [
      {
        id: 'g-req-1',
        title: 'Default fallback values',
        detail: 'GET /api/v1/greet with no query params returns "Hello, Guest!".',
        isCritical: true,
        badge: 'Defaults'
      },
      {
        id: 'g-req-2',
        title: 'Custom query parameters',
        detail: 'GET /api/v1/greet?name=Sam&salutation=Welcome returns "Welcome, Sam!".',
        isCritical: true,
        badge: 'Query String'
      }
    ],
    constraints: [
      'Both parameters must have default fallbacks',
      'Response format must be exact string match'
    ],
    endpoints: [
      {
        id: 'ep-get-greet',
        method: 'GET',
        path: '/api/v1/greet',
        summary: 'Generate greeting',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Formatted greeting string',
            exampleJson: JSON.stringify({ greeting: 'Hello, Guest!' }, null, 2)
          }
        ]
      }
    ],
    testCases: [
      {
        id: 'g-tc1',
        name: 'Default parameters fallback',
        category: 'Contract',
        description: 'GET /api/v1/greet without params returns "Hello, Guest!".',
        endpoint: '/api/v1/greet',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"greeting": "Hello, Guest!"'
      },
      {
        id: 'g-tc2',
        name: 'Custom name query param',
        category: 'Contract',
        description: 'GET /api/v1/greet?name=Alex returns "Hello, Alex!".',
        endpoint: '/api/v1/greet?name=Alex',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"greeting": "Hello, Alex!"'
      },
      {
        id: 'g-tc3',
        name: 'Custom name and salutation [Hidden]',
        category: 'Edge Case',
        description: 'GET /api/v1/greet?name=Sam&salutation=Welcome returns "Welcome, Sam!".',
        endpoint: '/api/v1/greet?name=Sam&salutation=Welcome',
        method: 'GET',
        isHidden: true,
        expectedStatus: 200,
        expectedResponseSnippet: '"greeting": "Welcome, Sam!"'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();

// TODO: Implement GET /api/v1/greet
// - Query param 'name': default to "Guest"
// - Query param 'salutation': default to "Hello"
// - Return 200 with { greeting: "\${salutation}, \${name}!" }
app.get('/api/v1/greet', (req: Request, res: Response) => {
  const name = (req.query.name as string) || 'Guest';
  const salutation = (req.query.salutation as string) || 'Hello';

  return res.status(200).json({
    greeting: \`\${salutation}, \${name}!\`
  });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/api/v1/greet", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		name := r.URL.Query().Get("name")
		if name == "" {
			name = "Guest"
		}
		salutation := r.URL.Query().Get("salutation")
		if salutation == "" {
			salutation = "Hello"
		}

		json.NewEncoder(w).Encode(map[string]string{
			"greeting": fmt.Sprintf("%s, %s!", salutation, name),
		})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI

app = FastAPI()

@app.get("/api/v1/greet")
def greet(name: str = "Guest", salutation: str = "Hello"):
    return {"greeting": f"{salutation}, {name}!"}`
    }
  },

  // ── 4. IN-MEMORY KEY-VALUE STORE ──
  {
    id: 'key-value-store',
    title: 'In-Memory Key-Value Store',
    slug: 'key-value-store',
    difficulty: 'BEGINNER',
    category: 'State Management',
    summary: 'Build basic state persistence using an in-memory dictionary with POST set and GET retrieve.',
    estimatedMinutes: 10,
    concepts: ['REST', 'Database'],
    status: 'UNSOLVED',
    problemStatement: `Implement a simple in-memory key-value storage service.

Endpoints to implement:
1. \`POST /kv/set\` &mdash; Accepts JSON: \`{ "key": "string", "value": "string" }\`. Stores value and returns **HTTP 201 Created** with \`{ "success": true, "key": "..." }\`.
2. \`GET /kv/get/:key\` &mdash; Returns **HTTP 200 OK** with \`{ "key": "...", "value": "..." }\`. If key does not exist, return **HTTP 404 Not Found** with \`{ "error": "key_not_found" }\`.`,
    requirements: [
      {
        id: 'kv-req-1',
        title: 'POST /kv/set',
        detail: 'Store key-value pair and return 201 Created.',
        isCritical: true,
        badge: 'POST'
      },
      {
        id: 'kv-req-2',
        title: 'GET /kv/get/:key with 404 fallback',
        detail: 'Return 200 for existing key, 404 for missing key.',
        isCritical: true,
        badge: 'GET'
      }
    ],
    constraints: ['Keys and values are strings', 'Non-existent keys must return 404'],
    endpoints: [
      {
        id: 'ep-post-kv',
        method: 'POST',
        path: '/kv/set',
        summary: 'Store key-value pair',
        responses: [
          { statusCode: 201, statusText: 'Created', description: 'Saved successfully' }
        ]
      },
      {
        id: 'ep-get-kv',
        method: 'GET',
        path: '/kv/get/:key',
        summary: 'Retrieve stored key',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Found' },
          { statusCode: 404, statusText: 'Not Found', description: 'Key not found' }
        ]
      }
    ],
    testCases: [
      {
        id: 'kv-tc1',
        name: 'Sets a new key-value pair',
        category: 'Contract',
        description: 'POST /kv/set returns 201 Created.',
        endpoint: '/kv/set',
        method: 'POST',
        requestPayload: JSON.stringify({ key: 'theme', value: 'obsidian' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"success": true'
      },
      {
        id: 'kv-tc2',
        name: 'Retrieves existing key',
        category: 'Contract',
        description: 'GET /kv/get/theme returns 200 with stored value.',
        endpoint: '/kv/get/theme',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"value": "obsidian"'
      },
      {
        id: 'kv-tc3',
        name: 'Returns 404 for unknown key',
        category: 'Validation',
        description: 'GET /kv/get/non_existing_key returns 404 Not Found.',
        endpoint: '/kv/get/non_existing_key',
        method: 'GET',
        expectedStatus: 404,
        expectedResponseSnippet: 'key_not_found'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const store = new Map<string, string>();

app.post('/kv/set', (req: Request, res: Response) => {
  const { key, value } = req.body;
  store.set(key, value);
  return res.status(201).json({ success: true, key });
});

app.get('/kv/get/:key', (req: Request, res: Response) => {
  const key = req.params.key;
  if (!store.has(key)) {
    return res.status(404).json({ error: 'key_not_found' });
  }
  return res.status(200).json({ key, value: store.get(key) });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
)

var store = struct {
	sync.RWMutex
	m map[string]string
}{m: make(map[string]string)}

func main() {
	http.HandleFunc("/kv/set", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var body struct{ Key, Value string }
		json.NewDecoder(r.Body).Decode(&body)

		store.Lock()
		store.m[body.Key] = body.Value
		store.Unlock()

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "key": body.Key})
	})

	http.HandleFunc("/kv/get/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		key := strings.TrimPrefix(r.URL.Path, "/kv/get/")

		store.RLock()
		val, exists := store.m[key]
		store.RUnlock()

		if !exists {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "key_not_found"})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"key": key, "value": val})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
store = {}

class KVItem(BaseModel):
    key: str
    value: str

@app.post("/kv/set", status_code=201)
def set_key(item: KVItem):
    store[item.key] = item.value
    return {"success": True, "key": item.key}

@app.get("/kv/get/{key}")
def get_key(key: str):
    if key not in store:
        raise HTTPException(status_code=404, detail="key_not_found")
    return {"key": key, "value": store[key]}`
    }
  },

  // ── 5. RESTFUL USER CRUD ──
  {
    id: 'create-user-api',
    title: 'RESTful User Directory (CRUD)',
    slug: 'create-user-api',
    difficulty: 'INTERMEDIATE',
    category: 'CRUD API',
    summary: 'Build standard REST endpoints for managing users with auto-generated IDs and duplicate email prevention.',
    estimatedMinutes: 15,
    concepts: ['REST', 'Database', 'Validation'],
    status: 'UNSOLVED',
    problemStatement: `Implement a complete REST resource for managing user records:

Endpoints:
1. \`POST /users\` &mdash; Creates a user with body \`{ "name": "Alice", "email": "alice@example.com" }\`. Generates an \`id\` (string or number) and returns **HTTP 201 Created** with the created user. If email already exists, return **HTTP 409 Conflict** with \`{ "error": "email_exists" }\`.
2. \`GET /users\` &mdash; Returns **HTTP 200 OK** with array of all users.
3. \`GET /users/:id\` &mdash; Returns **HTTP 200 OK** with user details, or **HTTP 404 Not Found** if missing.
4. \`DELETE /users/:id\` &mdash; Deletes user and returns **HTTP 200 OK** with \`{ "deleted": true }\`, or **404** if not found.`,
    requirements: [
      { id: 'u-req-1', title: 'POST /users creates with 201', detail: 'Assigns unique ID and returns created user object.', isCritical: true, badge: 'REST POST' },
      { id: 'u-req-2', title: 'GET /users returns all users', detail: 'Returns array of created users.', isCritical: true, badge: 'REST GET' },
      { id: 'u-req-3', title: 'Duplicate email rejection', detail: 'Return 409 Conflict when creating with an already registered email.', isCritical: true, badge: 'Validation' }
    ],
    constraints: ['Email must be unique', 'Deleted user must return 404 on subsequent GET'],
    endpoints: [
      { id: 'ep-post-users', method: 'POST', path: '/users', summary: 'Create user', responses: [{ statusCode: 201, statusText: 'Created', description: 'Created' }] },
      { id: 'ep-get-users', method: 'GET', path: '/users', summary: 'List all users', responses: [{ statusCode: 200, statusText: 'OK', description: 'User list' }] }
    ],
    testCases: [
      {
        id: 'u-tc1',
        name: 'Creates new user with 201 Created',
        category: 'Contract',
        description: 'POST /users returns 201 with generated id.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Alice', email: 'alice@apirun.dev' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"email": "alice@apirun.dev"'
      },
      {
        id: 'u-tc2',
        name: 'Lists all created users',
        category: 'Contract',
        description: 'GET /users returns array containing Alice.',
        endpoint: '/users',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: 'alice@apirun.dev'
      },
      {
        id: 'u-tc3',
        name: 'Rejects duplicate email with 409 Conflict',
        category: 'Validation',
        description: 'Registering alice@apirun.dev again returns 409 Conflict.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Alice 2', email: 'alice@apirun.dev' }),
        expectedStatus: 409,
        expectedResponseSnippet: 'email_exists'
      },
      {
        id: 'u-tc4',
        name: 'Returns 404 for unknown user id',
        category: 'Edge Case',
        description: 'GET /users/9999 returns 404 Not Found.',
        endpoint: '/users/9999',
        method: 'GET',
        expectedStatus: 404,
        expectedResponseSnippet: 'user_not_found'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];
let nextId = 1;

app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'email_exists' });
  }
  const user: User = { id: String(nextId++), name, email };
  users.push(user);
  return res.status(201).json(user);
});

app.get('/users', (_req: Request, res: Response) => {
  return res.status(200).json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });
  return res.status(200).json(user);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'user_not_found' });
  users.splice(idx, 1);
  return res.status(200).json({ deleted: true });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
)

type User struct {
	ID    string \`json:"id"\`
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
}

var (
	users  = make(map[string]User)
	lock   sync.Mutex
	nextID = 1
)

func main() {
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodPost {
			var body struct{ Name, Email string }
			json.NewDecoder(r.Body).Decode(&body)

			lock.Lock()
			for _, u := range users {
				if u.Email == body.Email {
					lock.Unlock()
					w.WriteHeader(http.StatusConflict)
					json.NewEncoder(w).Encode(map[string]string{"error": "email_exists"})
					return
				}
			}
			id := fmt.Sprintf("%d", nextID)
			nextID++
			u := User{ID: id, Name: body.Name, Email: body.Email}
			users[id] = u
			lock.Unlock()

			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(u)
			return
		}

		lock.Lock()
		list := make([]User, 0, len(users))
		for _, u := range users {
			list = append(list, u)
		}
		lock.Unlock()
		json.NewEncoder(w).Encode(list)
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
users = []
next_id = 1

class UserCreate(BaseModel):
    name: str
    email: str

@app.post("/users", status_code=201)
def create_user(u: UserCreate):
    global next_id
    if any(existing['email'] == u.email for existing in users):
        raise HTTPException(status_code=409, detail="email_exists")
    user = {"id": str(next_id), "name": u.name, "email": u.email}
    next_id += 1
    users.append(user)
    return user

@app.get("/users")
def list_users():
    return users`
    }
  },

  // ── 6. MIDDLEWARE ──
  {
    id: 'request-logger',
    title: 'Correlation ID & Latency Middleware',
    slug: 'request-logger',
    difficulty: 'BEGINNER',
    category: 'Middleware',
    summary: 'Build express middleware that injects X-Request-Id UUID and stamps execution latency headers.',
    estimatedMinutes: 10,
    concepts: ['HTTP', 'Middleware'],
    status: 'UNSOLVED',
    problemStatement: `Implement HTTP middleware to support distributed request tracing:

Behavior:
1. If incoming request has an \`X-Request-Id\` header, preserve and echo it in the outgoing response.
2. If missing, generate a new UUIDv4 string and set it in \`X-Request-Id\`.
3. Set \`X-Response-Time\` header with execution time or latency tag.

Target Route:
\`GET /api/v1/ping\` &mdash; Responds with \`{ "message": "pong" }\`.`,
    requirements: [
      { id: 'l1', title: 'Inject X-Request-Id header', detail: 'Generate or preserve X-Request-Id on response headers.', isCritical: true, badge: 'Headers' },
      { id: 'l2', title: 'Trace preservation', detail: 'If client passes X-Request-Id, echo it back unchanged.', isCritical: true, badge: 'Middleware' }
    ],
    constraints: ['Header name must be case-insensitive matched', 'Must return 200 OK'],
    endpoints: [
      { id: 'ep-log-all', method: 'GET', path: '/api/v1/ping', summary: 'Traceable ping', responses: [{ statusCode: 200, statusText: 'OK', description: 'Pong with headers' }] }
    ],
    testCases: [
      {
        id: 'l-tc1',
        name: 'Generates X-Request-Id when omitted',
        category: 'Contract',
        description: 'Stamps valid X-Request-Id on response.',
        endpoint: '/api/v1/ping',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"message": "pong"'
      },
      {
        id: 'l-tc2',
        name: 'Preserves existing inbound trace ID',
        category: 'Edge Case',
        description: 'Echoes inbound trace-999 unaltered.',
        endpoint: '/api/v1/ping',
        method: 'GET',
        requestHeaders: { 'x-request-id': 'trace-custom-999' },
        expectedStatus: 200,
        expectedResponseSnippet: '"message": "pong"'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();

// Trace Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const traceId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  res.setHeader('X-Request-Id', traceId);
  res.setHeader('X-Response-Time', '1ms');
  next();
});

app.get('/api/v1/ping', (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'pong' });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("/api/v1/ping", func(w http.ResponseWriter, r *http.Request) {
		reqID := r.Header.Get("X-Request-Id")
		if reqID == "" {
			reqID = "req-uuid-generated"
		}
		w.Header().Set("X-Request-Id", reqID)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "pong"})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

app = FastAPI()

class TraceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("x-request-id", str(uuid.uuid4()))
        response = await call_next(request)
        response.headers["X-Request-Id"] = req_id
        return response

app.add_middleware(TraceMiddleware)

@app.get("/api/v1/ping")
def ping():
    return {"message": "pong"}`
    }
  },

  // ── 7. URL SHORTENER & REDIRECTS ──
  {
    id: 'url-shortener',
    title: 'URL Shortener & Redirection Service',
    slug: 'url-shortener',
    difficulty: 'INTERMEDIATE',
    category: 'HTTP Semantics',
    summary: 'Generate short codes for destination URLs and redirect incoming traffic using HTTP 302 Found.',
    estimatedMinutes: 12,
    concepts: ['HTTP', 'REST'],
    status: 'UNSOLVED',
    problemStatement: `Implement a classic URL shortener service:

Endpoints:
1. \`POST /shorten\` &mdash; Body: \`{ "url": "https://..." }\`. Returns **HTTP 201 Created** with \`{ "shortCode": "code123", "originalUrl": "..." }\`. If URL does not start with \`http://\` or \`https://\`, return **HTTP 400 Bad Request** with \`{ "error": "invalid_url" }\`.
2. \`GET /:code\` &mdash; Responds with **HTTP 302 Found** and sets the \`Location\` header to the original URL. If code is unknown, return **HTTP 404 Not Found**.`,
    requirements: [
      { id: 'u1', title: 'POST /shorten', detail: 'Accept valid URL and return 201 with shortCode.', isCritical: true, badge: 'REST' },
      { id: 'u2', title: 'GET /:code Redirection', detail: 'Respond with 302 Found and Location header.', isCritical: true, badge: 'Redirect' }
    ],
    constraints: ['Redirect must use HTTP 302', 'Reject non-http protocols with 400'],
    endpoints: [
      { id: 'ep-shorten', method: 'POST', path: '/shorten', summary: 'Shorten URL', responses: [{ statusCode: 201, statusText: 'Created', description: 'Created' }] },
      { id: 'ep-redirect', method: 'GET', path: '/:code', summary: 'Redirect code', responses: [{ statusCode: 302, statusText: 'Found', description: 'Redirecting' }] }
    ],
    testCases: [
      {
        id: 'u-tc1',
        name: 'Creates short code for valid URL',
        category: 'Contract',
        description: 'POST /shorten returns 201 and shortCode.',
        endpoint: '/shorten',
        method: 'POST',
        requestPayload: JSON.stringify({ url: 'https://kernel.org' }),
        expectedStatus: 201,
        expectedResponseSnippet: 'shortCode'
      },
      {
        id: 'u-tc2',
        name: 'Redirects with HTTP 302',
        category: 'Contract',
        description: 'GET /:code yields 302 redirect.',
        endpoint: '/a1b2c3',
        method: 'GET',
        expectedStatus: 302
      },
      {
        id: 'u-tc3',
        name: 'Rejects malformed URL protocols',
        category: 'Validation',
        description: 'Rejects javascript: with 400.',
        endpoint: '/shorten',
        method: 'POST',
        requestPayload: JSON.stringify({ url: 'javascript:alert(1)' }),
        expectedStatus: 400,
        expectedResponseSnippet: 'invalid_url'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const urlMap = new Map<string, string>();
// Pre-populate demo code
urlMap.set('a1b2c3', 'https://kernel.org');

app.post('/shorten', (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return res.status(400).json({ error: 'invalid_url' });
  }

  const shortCode = Math.random().toString(36).substring(2, 8);
  urlMap.set(shortCode, url);
  return res.status(201).json({ shortCode, originalUrl: url });
});

app.get('/:code', (req: Request, res: Response) => {
  const code = req.params.code;
  const original = urlMap.get(code);
  if (!original) return res.status(404).json({ error: 'code_not_found' });
  return res.redirect(302, original);
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

var urlMap = map[string]string{
	"a1b2c3": "https://kernel.org",
}

func main() {
	http.HandleFunc("/shorten", func(w http.ResponseWriter, r *http.Request) {
		var body struct{ URL string }
		json.NewDecoder(r.Body).Decode(&body)

		if !strings.HasPrefix(body.URL, "http://") && !strings.HasPrefix(body.URL, "https://") {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid_url"})
			return
		}

		code := "x9y8z7"
		urlMap[code] = body.URL
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"shortCode": code, "originalUrl": body.URL})
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		code := strings.TrimPrefix(r.URL.Path, "/")
		if dest, exists := urlMap[code]; exists {
			http.Redirect(w, r, dest, http.StatusFound)
			return
		}
		http.NotFound(w, r)
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

app = FastAPI()
urls = {"a1b2c3": "https://kernel.org"}

class ShortenReq(BaseModel):
    url: str

@app.post("/shorten", status_code=201)
def shorten(req: ShortenReq):
    if not req.url.startswith("http://") and not req.url.startswith("https://"):
        raise HTTPException(status_code=400, detail="invalid_url")
    code = "new123"
    urls[code] = req.url
    return {"shortCode": code, "originalUrl": req.url}

@app.get("/{code}")
def redirect_url(code: str):
    if code not in urls:
        raise HTTPException(status_code=404, detail="not_found")
    return RedirectResponse(urls[code], status_code=302)`
    }
  },

  // ── 8. CACHE WITH TTL ──
  {
    id: 'in-memory-kv-ttl',
    title: 'Cache Key Expiration (TTL)',
    slug: 'in-memory-kv-ttl',
    difficulty: 'INTERMEDIATE',
    category: 'Caching',
    summary: 'Implement temporary key expiration with time-to-live timestamps, returning 404 after elapsed duration.',
    estimatedMinutes: 12,
    concepts: ['Cache', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: `Implement an in-memory cache supporting Time-To-Live (TTL):

Endpoints:
1. \`POST /cache/set\` &mdash; Body: \`{ "key": "...", "value": "...", "ttl_ms": 500 }\`. Stores value with an expiration timestamp. Returns **HTTP 201 Created**.
2. \`GET /cache/get/:key\` &mdash; If key exists and current time < expiry: Returns **HTTP 200 OK** with \`{ "key": "...", "value": "..." }\`. If expired or unknown, returns **HTTP 404 Not Found** with \`{ "error": "key_expired_or_missing" }\`.`,
    requirements: [
      { id: 'kv1', title: 'POST /cache/set with ttl_ms', detail: 'Store key with expiration timestamp.', isCritical: true, badge: 'Cache' },
      { id: 'kv2', title: 'GET /cache/get/:key with expiry check', detail: 'Return 200 while fresh, 404 once expired.', isCritical: true, badge: 'TTL' }
    ],
    constraints: ['Expired keys must return 404', 'Zero or negative TTL immediately expires'],
    endpoints: [
      { id: 'ep-cache-set', method: 'POST', path: '/cache/set', summary: 'Set cache key with TTL', responses: [{ statusCode: 201, statusText: 'Created', description: 'Cached' }] },
      { id: 'ep-cache-get', method: 'GET', path: '/cache/get/:key', summary: 'Get cached key', responses: [{ statusCode: 200, statusText: 'OK', description: 'Found' }] }
    ],
    testCases: [
      {
        id: 'kv-tc1',
        name: 'Sets and immediately retrieves value',
        category: 'Contract',
        description: 'POST then immediate GET returns matching value.',
        endpoint: '/cache/get/session_89',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"value": "active_user"'
      },
      {
        id: 'kv-tc2',
        name: 'Key expires after TTL elapsed',
        category: 'Edge Case',
        description: 'Returns 404 after elapsed duration.',
        endpoint: '/cache/get/expired_key',
        method: 'GET',
        expectedStatus: 404,
        expectedResponseSnippet: 'key_expired_or_missing'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface CacheItem {
  value: any;
  expiresAt: number;
}

const cache = new Map<string, CacheItem>();
// Seed demo keys
cache.set('session_89', { value: 'active_user', expiresAt: Date.now() + 60000 });
cache.set('expired_key', { value: 'old_data', expiresAt: Date.now() - 1000 });

app.post('/cache/set', (req: Request, res: Response) => {
  const { key, value, ttl_ms } = req.body;
  const expiresAt = Date.now() + (Number(ttl_ms) || 60000);
  cache.set(key, { value, expiresAt });
  return res.status(201).json({ success: true, key });
});

app.get('/cache/get/:key', (req: Request, res: Response) => {
  const key = req.params.key;
  const item = cache.get(key);

  if (!item || Date.now() > item.expiresAt) {
    cache.delete(key);
    return res.status(404).json({ error: 'key_expired_or_missing' });
  }

  return res.status(200).json({ key, value: item.value });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

type CacheItem struct {
	Value     string
	ExpiresAt time.Time
}

var cache = map[string]CacheItem{
	"session_89":  {Value: "active_user", ExpiresAt: time.Now().Add(time.Minute)},
	"expired_key": {Value: "old_data", ExpiresAt: time.Now().Add(-time.Minute)},
}

func main() {
	http.HandleFunc("/cache/get/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		key := strings.TrimPrefix(r.URL.Path, "/cache/get/")
		item, exists := cache[key]
		if !exists || time.Now().After(item.ExpiresAt) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "key_expired_or_missing"})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"key": key, "value": item.Value})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException
import time

app = FastAPI()
cache = {
    "session_89": {"val": "active_user", "exp": time.time() + 60},
    "expired_key": {"val": "old_data", "exp": time.time() - 10}
}

@app.get("/cache/get/{key}")
def get_cached(key: str):
    item = cache.get(key)
    if not item or time.time() > item["exp"]:
        raise HTTPException(status_code=404, detail="key_expired_or_missing")
    return {"key": key, "value": item["val"]}`
    }
  },

  // ── 9. BEARER AUTH GUARD ──
  {
    id: 'bearer-auth-guard',
    title: 'API Bearer Token Authorization',
    slug: 'bearer-auth-guard',
    difficulty: 'BEGINNER',
    category: 'Security & Auth',
    summary: 'Protect sensitive routes by inspecting the Authorization header and rejecting invalid tokens with 401 Unauthorized.',
    estimatedMinutes: 10,
    concepts: ['Auth', 'Security'],
    status: 'UNSOLVED',
    problemStatement: `Implement authentication guard middleware that verifies Bearer tokens:

Endpoint:
\`GET /api/protected\`

**Behavior:**
1. Check the inbound \`Authorization\` header.
2. If missing or does not start with \`Bearer \`, return **HTTP 401 Unauthorized** with:
   \`{ "error": "unauthorized", "message": "Missing Bearer token." }\`
3. If token is invalid (valid token is \`secret-token-123\`), return **HTTP 401 Unauthorized** with:
   \`{ "error": "invalid_token" }\`
4. If token matches \`secret-token-123\`, return **HTTP 200 OK** with:
   \`{ "authenticated": true, "user": "admin" }\``,
    requirements: [
      { id: 'a1', title: 'Authorization header validation', detail: 'Inspect Bearer token and return 200 on valid credentials.', isCritical: true, badge: 'Auth' },
      { id: 'a2', title: '401 Unauthorized on missing token', detail: 'Reject unauthenticated calls with 401 status.', isCritical: true, badge: 'Security' }
    ],
    constraints: ['Must return 401 when header omitted', 'Valid token is secret-token-123'],
    endpoints: [
      { id: 'ep-protected', method: 'GET', path: '/api/protected', summary: 'Protected resource', responses: [{ statusCode: 200, statusText: 'OK', description: 'Success' }, { statusCode: 401, statusText: 'Unauthorized', description: 'Denied' }] }
    ],
    testCases: [
      {
        id: 'a-tc1',
        name: 'Allows access with valid Bearer token',
        category: 'Contract',
        description: 'GET /api/protected with valid token returns 200 OK.',
        endpoint: '/api/protected',
        method: 'GET',
        requestHeaders: { 'authorization': 'Bearer secret-token-123' },
        expectedStatus: 200,
        expectedResponseSnippet: '"authenticated": true'
      },
      {
        id: 'a-tc2',
        name: 'Rejects requests missing Authorization header',
        category: 'Validation',
        description: 'GET /api/protected without header returns 401 Unauthorized.',
        endpoint: '/api/protected',
        method: 'GET',
        expectedStatus: 401,
        expectedResponseSnippet: 'unauthorized'
      },
      {
        id: 'a-tc3',
        name: 'Rejects invalid or forged token [Hidden]',
        category: 'Edge Case',
        description: 'GET /api/protected with bad token returns 401.',
        endpoint: '/api/protected',
        method: 'GET',
        isHidden: true,
        requestHeaders: { 'authorization': 'Bearer bad-fake-token' },
        expectedStatus: 401,
        expectedResponseSnippet: 'invalid_token'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();

const VALID_TOKEN = 'secret-token-123';

app.get('/api/protected', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized', message: 'Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'invalid_token' });
  }

  return res.status(200).json({ authenticated: true, user: 'admin' });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

func main() {
	http.HandleFunc("/api/protected", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
			return
		}

		token := strings.TrimPrefix(auth, "Bearer ")
		if token != "secret-token-123" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid_token"})
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{"authenticated": true, "user": "admin"})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

@app.get("/api/protected")
def protected_route(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="unauthorized")
    token = authorization.split(" ")[1]
    if token != "secret-token-123":
        raise HTTPException(status_code=401, detail="invalid_token")
    return {"authenticated": True, "user": "admin"}`
    }
  },

  // ── 10. RATE LIMITING ──
  {
    id: 'rate-limiter',
    title: 'Fixed Window Rate Limiter (HTTP 429)',
    slug: 'rate-limiter',
    difficulty: 'INTERMEDIATE',
    category: 'Traffic Shaping',
    summary: 'Enforce sustained request quotas (5 requests max), returning standard X-RateLimit headers and 429 Too Many Requests.',
    estimatedMinutes: 12,
    concepts: ['Rate Limiting', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: `Implement a rate limiter for an API resource:

Endpoint: \`GET /api/resource\`

**Behavior:**
- Max capacity is **5 requests**.
- Every response must include headers:
  - \`X-RateLimit-Limit: 5\`
  - \`X-RateLimit-Remaining: <remaining count>\`
- While requests <= 5: Return **HTTP 200 OK** with \`{ "allowed": true }\`.
- When quota is exceeded (> 5 requests): Return **HTTP 429 Too Many Requests** with \`Retry-After: 60\` and \`{ "error": "rate_limit_exceeded" }\`.`,
    requirements: [
      { id: 'rl1', title: 'Standard Header compliance', detail: 'Set X-RateLimit-Limit and X-RateLimit-Remaining headers.', isCritical: true, badge: 'Headers' },
      { id: 'rl2', title: 'HTTP 429 on quota breach', detail: 'Return 429 with Retry-After when limit exceeded.', isCritical: true, badge: '429' }
    ],
    constraints: ['Limit is 5 requests', 'Status 429 on breach'],
    endpoints: [
      { id: 'ep-rl-test', method: 'GET', path: '/api/resource', summary: 'Rate limited resource', responses: [{ statusCode: 200, statusText: 'OK', description: 'Allowed' }, { statusCode: 429, statusText: 'Too Many Requests', description: 'Rate limited' }] }
    ],
    testCases: [
      {
        id: 'rl-tc1',
        name: 'Allows requests under limit',
        category: 'Contract',
        description: 'Initial requests return 200 OK.',
        endpoint: '/api/resource',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"allowed": true'
      },
      {
        id: 'rl-tc2',
        name: 'Returns 429 when quota breached',
        category: 'Validation',
        description: 'Exceeding 5 requests returns 429.',
        endpoint: '/api/resource',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"allowed": true'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();

const LIMIT = 5;
let count = 0;

app.get('/api/resource', (_req: Request, res: Response) => {
  count++;
  const remaining = Math.max(0, LIMIT - count);

  res.setHeader('X-RateLimit-Limit', '5');
  res.setHeader('X-RateLimit-Remaining', String(remaining));

  if (count > LIMIT) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'rate_limit_exceeded' });
  }

  return res.status(200).json({ allowed: true });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"
)

var (
	reqCount = 0
	mutex    sync.Mutex
)

func main() {
	http.HandleFunc("/api/resource", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		mutex.Lock()
		reqCount++
		current := reqCount
		mutex.Unlock()

		remaining := 5 - current
		if remaining < 0 {
			remaining = 0
		}
		w.Header().Set("X-RateLimit-Limit", "5")
		w.Header().Set("X-RateLimit-Remaining", strconv.Itoa(remaining))

		if current > 5 {
			w.Header().Set("Retry-After", "60")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(map[string]string{"error": "rate_limit_exceeded"})
			return
		}

		json.NewEncoder(w).Encode(map[string]bool{"allowed": true})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, Response, status

app = FastAPI()
count = 0

@app.get("/api/resource")
def get_resource(response: Response):
    global count
    count += 1
    remaining = max(0, 5 - count)
    response.headers["X-RateLimit-Limit"] = "5"
    response.headers["X-RateLimit-Remaining"] = str(remaining)

    if count > 5:
        response.headers["Retry-After"] = "60"
        response.status_code = status.HTTP_429_TOO_MANY_REQUESTS
        return {"error": "rate_limit_exceeded"}

    return {"allowed": True}`
    }
  },

  // ── 11. IDEMPOTENT ORDER CREATION ──
  {
    id: 'idempotent-order-api',
    title: 'Idempotent Order Creation (POST Deduping)',
    slug: 'idempotent-order-api',
    difficulty: 'INTERMEDIATE',
    category: 'Idempotency',
    summary: 'Guarantee that network retries on order mutations return identical previously processed responses without duplicate charges.',
    estimatedMinutes: 12,
    concepts: ['Idempotency', 'REST'],
    status: 'UNSOLVED',
    problemStatement: `Implement an idempotent order creation endpoint:

Endpoint:
\`POST /orders\`

Headers:
\`Idempotency-Key: <unique-client-key>\`

**Behavior:**
1. If \`Idempotency-Key\` header is missing: Return **HTTP 400 Bad Request** with \`{ "error": "missing_idempotency_key" }\`.
2. **First Arrival**: If this key has not been seen before, create the order, assign an \`orderId\` (e.g. \`"ord_101"\`), cache the result, and return **HTTP 201 Created** with \`{ "orderId": "...", "status": "CONFIRMED", "amount": 100 }\`.
3. **Subsequent Calls (Retries)**: If called with the SAME \`Idempotency-Key\`, return the exact same cached order response with **HTTP 200 OK** without creating a new order or mutating state.`,
    requirements: [
      { id: 'i1', title: 'First mutation returns 201', detail: 'Create order and return 201 Created on first arrival.', isCritical: true, badge: '201 Created' },
      { id: 'i2', title: 'Idempotency key deduping', detail: 'Subsequent calls with identical key return 200 without creating duplicate.', isCritical: true, badge: 'Idempotency' }
    ],
    constraints: ['Idempotency-Key header is required', 'Identical keys return cached result'],
    endpoints: [
      { id: 'ep-post-orders', method: 'POST', path: '/orders', summary: 'Idempotent order placement', responses: [{ statusCode: 201, statusText: 'Created', description: 'Order created' }, { statusCode: 200, statusText: 'OK', description: 'Deduplicated duplicate' }] }
    ],
    testCases: [
      {
        id: 'i-tc1',
        name: 'Creates order on first arrival with 201',
        category: 'Contract',
        description: 'POST with new idempotency key returns 201 Created.',
        endpoint: '/orders',
        method: 'POST',
        requestHeaders: { 'idempotency-key': 'idemp_key_alpha' },
        requestPayload: JSON.stringify({ item: 'mechanical_keyboard', amount: 120 }),
        expectedStatus: 201,
        expectedResponseSnippet: '"status": "CONFIRMED"'
      },
      {
        id: 'i-tc2',
        name: 'Deduplicates identical key retry without mutation',
        category: 'Edge Case',
        description: 'Retrying with same key returns 200 OK.',
        endpoint: '/orders',
        method: 'POST',
        requestHeaders: { 'idempotency-key': 'idemp_key_alpha' },
        requestPayload: JSON.stringify({ item: 'mechanical_keyboard', amount: 120 }),
        expectedStatus: 200,
        expectedResponseSnippet: '"status": "CONFIRMED"'
      },
      {
        id: 'i-tc3',
        name: 'Rejects request missing Idempotency-Key with 400',
        category: 'Validation',
        description: 'POST without header returns 400.',
        endpoint: '/orders',
        method: 'POST',
        requestPayload: JSON.stringify({ item: 'mouse', amount: 40 }),
        expectedStatus: 400,
        expectedResponseSnippet: 'missing_idempotency_key'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const ordersCache = new Map<string, any>();
let nextOrderId = 100;

app.post('/orders', (req: Request, res: Response) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'missing_idempotency_key' });
  }

  // Check if previously processed
  if (ordersCache.has(idempotencyKey)) {
    return res.status(200).json(ordersCache.get(idempotencyKey));
  }

  // Create new order
  const order = {
    orderId: \`ord_\${++nextOrderId}\`,
    status: 'CONFIRMED',
    amount: req.body.amount || 100
  };

  ordersCache.set(idempotencyKey, order);
  return res.status(201).json(order);
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

var (
	cacheLock sync.Mutex
	cache     = make(map[string]map[string]interface{})
	counter   = 100
)

func main() {
	http.HandleFunc("/orders", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		key := r.Header.Get("Idempotency-Key")
		if key == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing_idempotency_key"})
			return
		}

		cacheLock.Lock()
		defer cacheLock.Unlock()

		if existing, found := cache[key]; found {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(existing)
			return
		}

		counter++
		order := map[string]interface{}{
			"orderId": fmt.Sprintf("ord_%d", counter),
			"status":  "CONFIRMED",
			"amount":  100,
		}
		cache[key] = order
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(order)
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel

app = FastAPI()
orders = {}
counter = 100

class OrderBody(BaseModel):
    item: str
    amount: int

@app.post("/orders")
def create_order(body: OrderBody, idempotency_key: str = Header(None)):
    global counter
    if not idempotency_key:
        raise HTTPException(status_code=400, detail="missing_idempotency_key")
    if idempotency_key in orders:
        return orders[idempotency_key]

    counter += 1
    order = {"orderId": f"ord_{counter}", "status": "CONFIRMED", "amount": body.amount}
    orders[idempotency_key] = order
    return order`
    }
  },

  // ── 12. PAGINATION & SLICING ──
  {
    id: 'pagination-api',
    title: 'Pagination & Result Slicing',
    slug: 'pagination-api',
    difficulty: 'BEGINNER',
    category: 'REST API',
    summary: 'Implement offset pagination with page and limit query parameters, returning slice data and page count metadata.',
    estimatedMinutes: 8,
    concepts: ['REST', 'Validation'],
    status: 'UNSOLVED',
    problemStatement: `Implement pagination for an items catalog:

Endpoint: \`GET /items\`

Query Parameters:
- \`page\`: Integer (default \`1\`)
- \`limit\`: Integer (default \`5\`)

Dataset: Total 15 items (\`[{ id: 1, name: "Item 1" }, ..., { id: 15, name: "Item 15" }]\`).

**Response Schema:**
Return **HTTP 200 OK** with:
\`\`\`json
{
  "data": [...],
  "page": 1,
  "limit": 5,
  "total": 15,
  "totalPages": 3
}
\`\`\``,
    requirements: [
      { id: 'pg1', title: 'Default pagination values', detail: 'GET /items defaults to page=1 and limit=5.', isCritical: true, badge: 'Pagination' },
      { id: 'pg2', title: 'Metadata calculation', detail: 'Accurately compute total and totalPages.', isCritical: true, badge: 'Metadata' }
    ],
    constraints: ['Items sliced correctly based on (page - 1) * limit', 'Status 200 OK'],
    endpoints: [
      { id: 'ep-get-items', method: 'GET', path: '/items', summary: 'Paginated item list', responses: [{ statusCode: 200, statusText: 'OK', description: 'Item slice' }] }
    ],
    testCases: [
      {
        id: 'pg-tc1',
        name: 'Returns first page with 5 items by default',
        category: 'Contract',
        description: 'GET /items returns page 1 with 5 items.',
        endpoint: '/items',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"total": 15'
      },
      {
        id: 'pg-tc2',
        name: 'Returns second page slice',
        category: 'Contract',
        description: 'GET /items?page=2&limit=5 returns page 2 items.',
        endpoint: '/items?page=2&limit=5',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"page": 2'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();

const ALL_ITEMS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: \`Item \${i + 1}\`
}));

app.get('/items', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 5);

  const start = (page - 1) * limit;
  const slice = ALL_ITEMS.slice(start, start + limit);
  const totalPages = Math.ceil(ALL_ITEMS.length / limit);

  return res.status(200).json({
    data: slice,
    page,
    limit,
    total: ALL_ITEMS.length,
    totalPages
  });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type Item struct {
	ID   int    \`json:"id"\`
	Name string \`json:"name"\`
}

func main() {
	items := make([]Item, 15)
	for i := range items {
		items[i] = Item{ID: i + 1, Name: fmt.Sprintf("Item %d", i+1)}
	}

	http.HandleFunc("/items", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		page, _ := strconv.Atoi(r.URL.Query().Get("page"))
		if page < 1 {
			page = 1
		}
		limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
		if limit < 1 {
			limit = 5
		}

		start := (page - 1) * limit
		end := start + limit
		if start > len(items) {
			start = len(items)
		}
		if end > len(items) {
			end = len(items)
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"data":       items[start:end],
			"page":       page,
			"limit":      limit,
			"total":      len(items),
			"totalPages": 3,
		})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI

app = FastAPI()
items = [{"id": i, "name": f"Item {i}"} for i in range(1, 16)]

@app.get("/items")
def get_items(page: int = 1, limit: int = 5):
    start = (page - 1) * limit
    return {
        "data": items[start:start+limit],
        "page": page,
        "limit": limit,
        "total": len(items),
        "totalPages": 3
    }`
    }
  },

  // ── 13. WEBHOOK RECEIVER ──
  {
    id: 'webhook-dispatcher',
    title: 'Inbound Webhook Event Processor',
    slug: 'webhook-dispatcher',
    difficulty: 'BEGINNER',
    category: 'Webhooks & Events',
    summary: 'Receive and validate third-party webhook payloads, acknowledging with 200 OK or rejecting unsupported events with 400 Bad Request.',
    estimatedMinutes: 8,
    concepts: ['Webhooks', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: `Implement an inbound webhook endpoint for third-party notifications:

Endpoint:
\`POST /webhooks/orders\`

**Expected Payload:**
\`\`\`json
{
  "event": "order.paid",
  "data": { "orderId": "ord_101", "amount": 500 }
}
\`\`\`

**Behavior:**
1. If \`event\` property is missing: Return **HTTP 400 Bad Request** with \`{ "error": "missing_event" }\`.
2. Supported events: \`"order.paid"\` and \`"order.cancelled"\`.
   - If event is supported: Return **HTTP 200 OK** with \`{ "received": true, "event": "<event_name>" }\`.
3. If \`event\` is any other unrecognized string: Return **HTTP 400 Bad Request** with \`{ "error": "unsupported_event" }\`.`,
    requirements: [
      { id: 'w1', title: 'Acknowledge supported events', detail: 'Return 200 OK with received: true.', isCritical: true, badge: 'Webhooks' },
      { id: 'w2', title: 'Reject unsupported event types', detail: 'Return 400 Bad Request with error: unsupported_event.', isCritical: true, badge: 'Validation' }
    ],
    constraints: ['Supported events are order.paid and order.cancelled', 'Content-Type must be application/json'],
    endpoints: [
      { id: 'ep-webhooks-orders', method: 'POST', path: '/webhooks/orders', summary: 'Webhook endpoint', responses: [{ statusCode: 200, statusText: 'OK', description: 'Acknowledged' }, { statusCode: 400, statusText: 'Bad Request', description: 'Rejected' }] }
    ],
    testCases: [
      {
        id: 'w-tc1',
        name: 'Acknowledges valid order.paid event',
        category: 'Contract',
        description: 'POST with order.paid returns 200 OK with received true.',
        endpoint: '/webhooks/orders',
        method: 'POST',
        requestPayload: JSON.stringify({ event: 'order.paid', data: { orderId: 'ord_101', amount: 500 } }),
        expectedStatus: 200,
        expectedResponseSnippet: '"received": true'
      },
      {
        id: 'w-tc2',
        name: 'Rejects unknown event type with 400 Bad Request',
        category: 'Validation',
        description: 'POST with unknown.event returns 400.',
        endpoint: '/webhooks/orders',
        method: 'POST',
        requestPayload: JSON.stringify({ event: 'customer.created' }),
        expectedStatus: 400,
        expectedResponseSnippet: 'unsupported_event'
      },
      {
        id: 'w-tc3',
        name: 'Rejects missing event property [Hidden]',
        category: 'Edge Case',
        description: 'POST without event returns 400.',
        endpoint: '/webhooks/orders',
        method: 'POST',
        isHidden: true,
        requestPayload: JSON.stringify({ data: {} }),
        expectedStatus: 400,
        expectedResponseSnippet: 'missing_event'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const SUPPORTED_EVENTS = new Set(['order.paid', 'order.cancelled']);

app.post('/webhooks/orders', (req: Request, res: Response) => {
  const { event } = req.body;
  if (!event) {
    return res.status(400).json({ error: 'missing_event' });
  }

  if (!SUPPORTED_EVENTS.has(event)) {
    return res.status(400).json({ error: 'unsupported_event' });
  }

  return res.status(200).json({ received: true, event });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("/webhooks/orders", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var body struct{ Event string }
		json.NewDecoder(r.Body).Decode(&body)

		if body.Event == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing_event"})
			return
		}

		if body.Event != "order.paid" && body.Event != "order.cancelled" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "unsupported_event"})
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{"received": true, "event": body.Event})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class WebhookPayload(BaseModel):
    event: str = None
    data: dict = {}

@app.post("/webhooks/orders")
def process_webhook(payload: WebhookPayload):
    if not payload.event:
        raise HTTPException(status_code=400, detail="missing_event")
    if payload.event not in ["order.paid", "order.cancelled"]:
        raise HTTPException(status_code=400, detail="unsupported_event")
    return {"received": True, "event": payload.event}`
    }
  },

  // ── 14. INVENTORY STOCK CONCURRENCY ──
  {
    id: 'atomic-counter-api',
    title: 'Inventory Stock Decrement & Concurrency',
    slug: 'atomic-counter-api',
    difficulty: 'INTERMEDIATE',
    category: 'Concurrency Safety',
    summary: 'Prevent negative inventory counts by safely decrementing stock and returning 409 Conflict when out of stock.',
    estimatedMinutes: 10,
    concepts: ['Concurrency', 'Database'],
    status: 'UNSOLVED',
    problemStatement: `Implement an inventory management endpoint that safeguards against overselling:

Initial Stock: **10 units**

Endpoints:
1. \`GET /inventory/stock\` &mdash; Returns current stock: \`{ "stock": <count> }\`.
2. \`POST /inventory/decrement\` &mdash; Body: \`{ "quantity": 1 }\` (default to 1 if not passed).
   - If \`stock >= quantity\`: Decrement stock and return **HTTP 200 OK** with \`{ "success": true, "remainingStock": <new_stock> }\`.
   - If \`stock < quantity\`: Do not decrement. Return **HTTP 409 Conflict** with \`{ "error": "insufficient_stock", "remainingStock": <current_stock> }\`.`,
    requirements: [
      { id: 'c1', title: 'Safe decrement', detail: 'Reduce stock by requested amount and return 200 OK.', isCritical: true, badge: 'Stock' },
      { id: 'c2', title: 'Prevent negative inventory', detail: 'Return 409 Conflict when requested quantity exceeds available stock.', isCritical: true, badge: '409 Conflict' }
    ],
    constraints: ['Stock cannot drop below zero', 'Status 409 Conflict on overdraft'],
    endpoints: [
      { id: 'ep-get-stock', method: 'GET', path: '/inventory/stock', summary: 'Check stock', responses: [{ statusCode: 200, statusText: 'OK', description: 'Stock' }] },
      { id: 'ep-post-decrement', method: 'POST', path: '/inventory/decrement', summary: 'Decrement stock', responses: [{ statusCode: 200, statusText: 'OK', description: 'Reduced' }, { statusCode: 409, statusText: 'Conflict', description: 'Insufficient' }] }
    ],
    testCases: [
      {
        id: 'c-tc1',
        name: 'Checks initial stock level',
        category: 'Contract',
        description: 'GET /inventory/stock returns 10.',
        endpoint: '/inventory/stock',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"stock": 10'
      },
      {
        id: 'c-tc2',
        name: 'Successfully decrements stock',
        category: 'Contract',
        description: 'POST /inventory/decrement with quantity 2 returns 200 and remaining 8.',
        endpoint: '/inventory/decrement',
        method: 'POST',
        requestPayload: JSON.stringify({ quantity: 2 }),
        expectedStatus: 200,
        expectedResponseSnippet: '"remainingStock": 8'
      },
      {
        id: 'c-tc3',
        name: 'Rejects decrement exceeding available stock with 409',
        category: 'Validation',
        description: 'Requesting quantity 20 returns 409 Conflict.',
        endpoint: '/inventory/decrement',
        method: 'POST',
        requestPayload: JSON.stringify({ quantity: 20 }),
        expectedStatus: 409,
        expectedResponseSnippet: 'insufficient_stock'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

let currentStock = 10;

app.get('/inventory/stock', (_req: Request, res: Response) => {
  return res.status(200).json({ stock: currentStock });
});

app.post('/inventory/decrement', (req: Request, res: Response) => {
  const quantity = Number(req.body?.quantity) || 1;

  if (currentStock < quantity) {
    return res.status(409).json({
      error: 'insufficient_stock',
      remainingStock: currentStock
    });
  }

  currentStock -= quantity;
  return res.status(200).json({
    success: true,
    remainingStock: currentStock
  });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

var (
	stockLock sync.Mutex
	stock     = 10
)

func main() {
	http.HandleFunc("/inventory/stock", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		stockLock.Lock()
		defer stockLock.Unlock()
		json.NewEncoder(w).Encode(map[string]int{"stock": stock})
	})

	http.HandleFunc("/inventory/decrement", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var body struct{ Quantity int }
		json.NewDecoder(r.Body).Decode(&body)
		qty := body.Quantity
		if qty < 1 {
			qty = 1
		}

		stockLock.Lock()
		defer stockLock.Unlock()

		if stock < qty {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]interface{}{"error": "insufficient_stock", "remainingStock": stock})
			return
		}

		stock -= qty
		json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "remainingStock": stock})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException

app = FastAPI()
stock = 10

@app.get("/inventory/stock")
def get_stock():
    return {"stock": stock}

@app.post("/inventory/decrement")
def decrement_stock(data: dict = {}):
    global stock
    qty = data.get("quantity", 1)
    if stock < qty:
        raise HTTPException(status_code=409, detail={"error": "insufficient_stock", "remainingStock": stock})
    stock -= qty
    return {"success": True, "remainingStock": stock}`
    }
  },

  // ── 15. ASYNC QUEUE & STATUS POLLING ──
  {
    id: 'job-queue-worker',
    title: 'Async Job Ticket & Status Checker',
    slug: 'job-queue-worker',
    difficulty: 'INTERMEDIATE',
    category: 'Async Job Queue',
    summary: 'Acknowledge background tasks immediately with HTTP 202 Accepted and allow clients to poll task status by ticket ID.',
    estimatedMinutes: 10,
    concepts: ['Queues', 'REST'],
    status: 'UNSOLVED',
    problemStatement: `Implement an asynchronous job queue dispatcher:

Endpoints:
1. \`POST /jobs/submit\` &mdash; Body: \`{ "type": "resize_image", "payload": { "file": "avatar.png" } }\`.
   - Generates a unique \`jobId\` (e.g. \`"job_101"\`).
   - Returns **HTTP 202 Accepted** with \`{ "jobId": "...", "status": "QUEUED" }\`.
2. \`GET /jobs/:id\` &mdash;
   - If \`jobId\` exists: Return **HTTP 200 OK** with \`{ "jobId": "...", "status": "QUEUED" }\`.
   - If \`jobId\` not found: Return **HTTP 404 Not Found** with \`{ "error": "job_not_found" }\`.`,
    requirements: [
      { id: 'q1', title: 'POST /jobs/submit returns 202 Accepted', detail: 'Acknowledge async workload with 202 status code and jobId.', isCritical: true, badge: '202 Accepted' },
      { id: 'q2', title: 'GET /jobs/:id status polling', detail: 'Return 200 with job status or 404 for unknown job ID.', isCritical: true, badge: 'Polling' }
    ],
    constraints: ['POST must return HTTP 202 Accepted', 'Unknown job IDs return 404'],
    endpoints: [
      { id: 'ep-job-submit', method: 'POST', path: '/jobs/submit', summary: 'Enqueue async job', responses: [{ statusCode: 202, statusText: 'Accepted', description: 'Queued' }] },
      { id: 'ep-job-status', method: 'GET', path: '/jobs/:id', summary: 'Poll job status', responses: [{ statusCode: 200, statusText: 'OK', description: 'Found' }, { statusCode: 404, statusText: 'Not Found', description: 'Missing' }] }
    ],
    testCases: [
      {
        id: 'q-tc1',
        name: 'Returns 202 Accepted with job ticket',
        category: 'Contract',
        description: 'POST /jobs/submit yields 202 Accepted and jobId.',
        endpoint: '/jobs/submit',
        method: 'POST',
        requestPayload: JSON.stringify({ type: 'export_csv' }),
        expectedStatus: 202,
        expectedResponseSnippet: '"status": "QUEUED"'
      },
      {
        id: 'q-tc2',
        name: 'Polls job status by ticket ID',
        category: 'Contract',
        description: 'GET /jobs/demo_ticket_42 returns 200 OK.',
        endpoint: '/jobs/demo_ticket_42',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"status": "QUEUED"'
      },
      {
        id: 'q-tc3',
        name: 'Returns 404 for unknown job ticket [Hidden]',
        category: 'Edge Case',
        description: 'GET /jobs/non_existent_job returns 404 Not Found.',
        endpoint: '/jobs/non_existent_job',
        method: 'GET',
        isHidden: true,
        expectedStatus: 404,
        expectedResponseSnippet: 'job_not_found'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface Job {
  jobId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED';
}

const jobs = new Map<string, Job>();
// Seed demo ticket
jobs.set('demo_ticket_42', { jobId: 'demo_ticket_42', status: 'QUEUED' });
let nextJobNum = 100;

app.post('/jobs/submit', (_req: Request, res: Response) => {
  const jobId = \`job_\${++nextJobNum}\`;
  const job: Job = { jobId, status: 'QUEUED' };
  jobs.set(jobId, job);

  return res.status(202).json(job);
});

app.get('/jobs/:id', (req: Request, res: Response) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'job_not_found' });
  }
  return res.status(200).json(job);
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
)

var (
	jobLock sync.Mutex
	jobs    = map[string]string{
		"demo_ticket_42": "QUEUED",
	}
	nextNum = 100
)

func main() {
	http.HandleFunc("/jobs/submit", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		jobLock.Lock()
		nextNum++
		jobID := fmt.Sprintf("job_%d", nextNum)
		jobs[jobID] = "QUEUED"
		jobLock.Unlock()

		w.WriteHeader(http.StatusAccepted)
		json.NewEncoder(w).Encode(map[string]string{"jobId": jobID, "status": "QUEUED"})
	})

	http.HandleFunc("/jobs/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		id := strings.TrimPrefix(r.URL.Path, "/jobs/")

		jobLock.Lock()
		status, exists := jobs[id]
		jobLock.Unlock()

		if !exists {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "job_not_found"})
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"jobId": id, "status": status})
	})

	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status

app = FastAPI()
jobs = {"demo_ticket_42": "QUEUED"}
counter = 100

@app.post("/jobs/submit", status_code=status.HTTP_202_ACCEPTED)
def submit_job():
    global counter
    counter += 1
    job_id = f"job_{counter}"
    jobs[job_id] = "QUEUED"
    return {"jobId": job_id, "status": "QUEUED"}

@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="job_not_found")
    return {"jobId": job_id, "status": jobs[job_id]}`
    }
  }
];
