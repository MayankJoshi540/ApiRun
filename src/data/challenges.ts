import { Challenge, UserStats } from '../types';

export const initialUserStats: UserStats = {
  solvedCount: 0,
  challengesSolved: 0,
  totalChallenges: 11,
  totalTestsPassed: 0,
  totalSubmissions: 0,
  averageLatencyMs: 0,
  currentStreak: 0,
  rankTitle: 'Backend Engineer',
};

export const challenges: Challenge[] = [
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
  // TODO: Your implementation here
  return res.status(200).json({ message: 'pong' });
});

// TODO 2: Implement GET /health
// - Return HTTP 200 with JSON: { status: 'ok', uptime: 100 }
app.get('/health', (_req: Request, res: Response) => {
  // TODO: Your implementation here
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
    return {"status": "ok", "uptime": 100}
`
    }
  },
  {
    id: 'echo-validation-api',
    title: 'Echo & Request Body Validation',
    slug: 'echo-validation-api',
    difficulty: 'BEGINNER',
    category: 'REST API',
    summary: 'Learn how to parse JSON request bodies and return 200 OK vs 400 Bad Request.',
    estimatedMinutes: 10,
    concepts: ['HTTP', 'REST', 'Validation'],
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
        summary: 'Echo inbound message',
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ message: 'Hello Backend' }, null, 2),
          fields: [
            { name: 'message', type: 'string', required: true, description: 'Text message to echo back' }
          ]
        },
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Message echoed successfully',
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
// - If message is missing or empty string: return 400 with { error: 'missing_message', message: "Field 'message' is required." }
// - If valid: return 200 with { echo: message, length: message.length }
app.post('/api/v1/echo', (req: Request, res: Response) => {
  const { message } = req.body || {};

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
		var body EchoRequest
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || strings.TrimSpace(body.Message) == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing_message"})
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"echo": body.Message, "length": len(body.Message)})
	})
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="Echo & Validation API")

class EchoPayload(BaseModel):
    message: str

@app.post("/api/v1/echo")
def echo(payload: EchoPayload):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail={"error": "missing_message"})
    return {"echo": payload.message, "length": len(payload.message)}
`
    }
  },
  {
    id: 'greeting-query-api',
    title: 'Greeting API with Query Parameters',
    slug: 'greeting-query-api',
    difficulty: 'BEGINNER',
    category: 'HTTP Fundamentals',
    summary: 'Learn how to read URL query parameters and provide clean fallback defaults.',
    estimatedMinutes: 10,
    concepts: ['HTTP', 'REST'],
    status: 'UNSOLVED',
    problemStatement: `Implement a dynamic greeting endpoint that extracts query parameters from the URL.

Your service must expose:
\`GET /api/v1/greet\`

**Behavior:**
- If query parameter \`name\` is passed (e.g. \`GET /api/v1/greet?name=Mayank\`):
  Return **HTTP 200 OK** with:
  \`{ "greeting": "Hello, Mayank!", "timestamp": "<ISO 8601 string>" }\`
- If query parameter \`name\` is omitted (e.g. \`GET /api/v1/greet\`):
  Default to "Guest" and return **HTTP 200 OK** with:
  \`{ "greeting": "Hello, Guest!", "timestamp": "<ISO 8601 string>" }\``,
    requirements: [
      {
        id: 'g-req-1',
        title: 'Extract name from query string',
        detail: 'Extract req.query.name and greet the user.',
        isCritical: true,
        badge: 'Query Params'
      },
      {
        id: 'g-req-2',
        title: 'Fallback default when name omitted',
        detail: 'Default name to "Guest" when omitted.',
        isCritical: true,
        badge: 'Defaults'
      }
    ],
    constraints: [
      'Return HTTP 200 OK for all valid GET requests',
      'Format greeting exactly as "Hello, <name>!"'
    ],
    endpoints: [
      {
        id: 'ep-get-greet',
        method: 'GET',
        path: '/api/v1/greet',
        summary: 'Dynamic greeting endpoint',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Greeting response',
            exampleJson: JSON.stringify({ greeting: 'Hello, Mayank!', timestamp: '2026-09-22T10:00:00.000Z' }, null, 2)
          }
        ],
        curlExample: 'curl -X GET "http://localhost:8000/api/v1/greet?name=Mayank"'
      }
    ],
    testCases: [
      {
        id: 'g-tc1',
        name: 'Greets specified name from query parameter',
        category: 'Contract',
        description: 'GET /api/v1/greet?name=Mayank returns "Hello, Mayank!".',
        endpoint: '/api/v1/greet?name=Mayank',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"greeting": "Hello, Mayank!"'
      },
      {
        id: 'g-tc2',
        name: 'Defaults to Guest when name query param omitted',
        category: 'Contract',
        description: 'GET /api/v1/greet returns "Hello, Guest!".',
        endpoint: '/api/v1/greet',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"greeting": "Hello, Guest!"'
      },
      {
        id: 'g-tc3',
        name: 'Greets custom name [Hidden]',
        category: 'Edge Case',
        description: 'GET /api/v1/greet?name=Sarah returns "Hello, Sarah!".',
        endpoint: '/api/v1/greet?name=Sarah',
        method: 'GET',
        isHidden: true,
        expectedStatus: 200,
        expectedResponseSnippet: '"greeting": "Hello, Sarah!"'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// TODO: Implement GET /api/v1/greet
// - Read req.query.name
// - If name is provided: greet "Hello, <name>!"
// - If name is omitted: default to "Hello, Guest!"
// - Return HTTP 200 with { greeting: "...", timestamp: new Date().toISOString() }
app.get('/api/v1/greet', (req: Request, res: Response) => {
  const name = (req.query.name as string) || 'Guest';

  return res.status(200).json({
    greeting: \`Hello, \${name}!\`,
    timestamp: new Date().toISOString()
  });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func main() {
	http.HandleFunc("/api/v1/greet", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		name := r.URL.Query().Get("name")
		if name == "" {
			name = "Guest"
		}
		json.NewEncoder(w).Encode(map[string]interface{}{
			"greeting":  fmt.Sprintf("Hello, %s!", name),
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI
from datetime import datetime
from typing import Optional

app = FastAPI(title="Greeting API")

@app.get("/api/v1/greet")
def greet(name: Optional[str] = "Guest"):
    return {
        "greeting": f"Hello, {name}!",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
`
    }
  },
  {
    id: 'key-value-store',
    title: 'In-Memory Key-Value Store',
    slug: 'key-value-store',
    difficulty: 'BEGINNER',
    category: 'Data Structures',
    summary: 'Build a lightweight in-memory cache API with key-value set, get, and 404 handling.',
    estimatedMinutes: 15,
    concepts: ['HTTP', 'REST', 'Cache'],
    status: 'UNSOLVED',
    problemStatement: `Implement an in-memory key-value cache API that allows storing and fetching string values by key.

Your service must expose:
1. \`POST /api/v1/kv/set\` &mdash; Body \`{ "key": "...", "value": "..." }\`. Saves the key-value pair and returns **HTTP 201 Created** with \`{ "success": true, "key": "..." }\`.
2. \`GET /api/v1/kv/get/:key\` &mdash; Retrieves the value for the given key. Returns **HTTP 200 OK** with \`{ "key": "...", "value": "..." }\`. If key doesn't exist, return **HTTP 404 Not Found** with \`{ "error": "key_not_found" }\`.`,
    requirements: [
      {
        id: 'kv-req-1',
        title: 'POST /api/v1/kv/set',
        detail: 'Persist key-value pair in memory and return 201 Created.',
        isCritical: true,
        badge: 'POST'
      },
      {
        id: 'kv-req-2',
        title: 'GET /api/v1/kv/get/:key',
        detail: 'Return 200 OK with value if found, or 404 Not Found if missing.',
        isCritical: true,
        badge: 'GET'
      }
    ],
    constraints: [
      'Reject missing key or value on set with HTTP 400 Bad Request',
      'Return HTTP 404 Not Found for missing keys'
    ],
    endpoints: [
      {
        id: 'ep-post-kv',
        method: 'POST',
        path: '/api/v1/kv/set',
        summary: 'Set key value',
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ key: 'city', value: 'Delhi' }, null, 2),
          fields: [
            { name: 'key', type: 'string', required: true, description: 'Store identifier key' },
            { name: 'value', type: 'string', required: true, description: 'Value to persist' }
          ]
        },
        responses: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'Key saved successfully',
            exampleJson: JSON.stringify({ success: true, key: 'city' }, null, 2)
          }
        ]
      },
      {
        id: 'ep-get-kv',
        method: 'GET',
        path: '/api/v1/kv/get/:key',
        summary: 'Get value by key',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Key found',
            exampleJson: JSON.stringify({ key: 'city', value: 'Delhi' }, null, 2)
          },
          {
            statusCode: 404,
            statusText: 'Not Found',
            description: 'Key does not exist in store',
            exampleJson: JSON.stringify({ error: 'key_not_found' }, null, 2)
          }
        ]
      }
    ],
    testCases: [
      {
        id: 'kv-tc1',
        name: 'Sets key-value pair with 201 Created',
        category: 'Contract',
        description: 'POST /api/v1/kv/set with valid key and value returns 201 Created.',
        endpoint: '/api/v1/kv/set',
        method: 'POST',
        requestPayload: JSON.stringify({ key: 'session_user', value: 'mayank' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"success": true'
      },
      {
        id: 'kv-tc2',
        name: 'Gets existing key with 200 OK',
        category: 'Contract',
        description: 'GET /api/v1/kv/get/session_user returns 200 with stored value.',
        endpoint: '/api/v1/kv/get/session_user',
        method: 'GET',
        expectedStatus: 200,
        expectedResponseSnippet: '"value": "mayank"'
      },
      {
        id: 'kv-tc3',
        name: 'Returns 404 Not Found for non-existent key',
        category: 'Edge Case',
        description: 'GET /api/v1/kv/get/non_existent_key returns 404 Not Found.',
        endpoint: '/api/v1/kv/get/non_existent_key',
        method: 'GET',
        expectedStatus: 404,
        expectedResponseSnippet: '"error": "key_not_found"'
      },
      {
        id: 'kv-tc4',
        name: 'Rejects missing key on set with 400 [Hidden]',
        category: 'Validation',
        description: 'POST /api/v1/kv/set without key returns 400 Bad Request.',
        endpoint: '/api/v1/kv/set',
        method: 'POST',
        isHidden: true,
        requestPayload: JSON.stringify({ value: 'orphan' }),
        expectedStatus: 400,
        expectedResponseSnippet: 'missing_key_or_value'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// In-memory key-value dictionary store
const kvStore: Record<string, any> = {};

// TODO 1: Implement POST /api/v1/kv/set
// - Validate key and value are present. If missing, return 400 ({ error: 'missing_key_or_value' }).
// - Save kvStore[key] = value.
// - Return 201 Created with { success: true, key }
app.post('/api/v1/kv/set', (req: Request, res: Response) => {
  const { key, value } = req.body || {};

  if (!key || value === undefined) {
    return res.status(400).json({ error: 'missing_key_or_value' });
  }

  kvStore[key] = value;
  return res.status(201).json({ success: true, key });
});

// TODO 2: Implement GET /api/v1/kv/get/:key
// - Read req.params.key
// - If key exists in kvStore: return 200 with { key, value: kvStore[key] }
// - If key does not exist: return 404 with { error: 'key_not_found' }
app.get('/api/v1/kv/get/:key', (req: Request, res: Response) => {
  const { key } = req.params;

  if (!(key in kvStore)) {
    return res.status(404).json({ error: 'key_not_found' });
  }

  return res.status(200).json({ key, value: kvStore[key] });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
)

var (
	store = make(map[string]string)
	mu    sync.RWMutex
)

func main() {
	http.HandleFunc("/api/v1/kv/set", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var body map[string]string
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body["key"] == "" || body["value"] == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing_key_or_value"})
			return
		}
		mu.Lock()
		store[body["key"]] = body["value"]
		mu.Unlock()
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "key": body["key"]})
	})
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="Key-Value Store API")

kv_store = {}

class SetPayload(BaseModel):
    key: str
    value: str

@app.post("/api/v1/kv/set", status_code=status.HTTP_201_CREATED)
def set_kv(payload: SetPayload):
    if not payload.key:
        raise HTTPException(status_code=400, detail={"error": "missing_key_or_value"})
    kv_store[payload.key] = payload.value
    return {"success": True, "key": payload.key}

@app.get("/api/v1/kv/get/{key}")
def get_kv(key: str):
    if key not in kv_store:
        raise HTTPException(status_code=404, detail={"error": "key_not_found"})
    return {"key": key, "value": kv_store[key]}
`
    }
  },
  {
    id: 'create-user-api',
    title: 'Create a User API',
    slug: 'create-user-api',
    difficulty: 'BEGINNER',
    category: 'REST API',
    summary: 'Build an API for creating, validating, and retrieving users with proper HTTP status codes.',
    estimatedMinutes: 25,
    concepts: ['HTTP', 'REST', 'Validation'],
    status: 'UNSOLVED',
    problemStatement: `Design and implement a standard RESTful User Management API.

The API must allow clients to register new users, fetch user lists, and inspect individual user profiles by unique ID. You must strictly adhere to HTTP protocol semantics, including correct status code usage (201, 200, 400, 404, 409, 422) and accurate Content-Type response headers.`,
    requirements: [
      {
        id: 'req-1',
        title: 'POST /users payload validation',
        detail: 'Body must require "name" (string, 2-50 chars) and "email" (valid RFC 5322 email string). Return 400 Bad Request on missing fields, and 422 Unprocessable Entity on invalid email formatting.',
        isCritical: true,
        badge: 'Validation'
      },
      {
        id: 'req-2',
        title: 'Unique email enforcement',
        detail: 'If a user attempts to register with an email that already exists in the store, respond with HTTP 409 Conflict and an appropriate error payload: {"error": "email_already_exists"}.',
        isCritical: true,
        badge: 'Database'
      },
      {
        id: 'req-3',
        title: 'Auto-generated identifiers and timestamps',
        detail: 'On successful user creation, return HTTP 201 Created with JSON body containing generated "id" (UUID or numeric IF), "name", "email", and ISO 8601 "createdAt". Never return plaintext passwords or internal columns.',
        isCritical: false,
        badge: 'REST'
      },
      {
        id: 'req-4',
        title: 'GET /users/:id lookup & 404 handling',
        detail: 'GET requests with a valid ID return 200 OK with the user object. If the identifier does not exist, return HTTP 404 Not Found with {"error": "user_not_found"}.',
        isCritical: true,
        badge: 'HTTP'
      }
    ],
    constraints: [
      'Content-Type must always be application/json; charset=utf-8',
      'All email addresses must be normalized to lowercase before saving',
      'Whitespace must be stripped from the start and end of user name',
      'Average response latency must remain under 50ms'
    ],
    endpoints: [
      {
        id: 'ep-post-users',
        method: 'POST',
        path: '/users',
        summary: 'Create a new user profile',
        description: 'Creates a new user record after verifying field requirements and uniqueness.',
        headers: [
          { key: 'Content-Type', value: 'application/json', required: true, description: 'Must specify JSON body encoding' }
        ],
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ name: 'Mayank Patel', email: 'mayank@example.com' }, null, 2),
          fields: [
            { name: 'name', type: 'string', required: true, description: 'User display name (2 to 50 characters, trimmed)' },
            { name: 'email', type: 'string', required: true, description: 'Valid RFC 5322 compliant unique email address' }
          ]
        },
        responses: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'User successfully created in database',
            exampleJson: JSON.stringify({ id: 1, name: 'Mayank Patel', email: 'mayank@example.com', createdAt: '2026-09-02T12:00:00.000Z'}, null, 2),
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Location': '/users/1' }
          },
          {
            statusCode: 400,
            statusText: 'Bad Request',
            description: 'Missing required field (name or email is missing/null)',
            exampleJson: JSON.stringify({error: 'missing_required_field', message: 'Field "name" is required.'}, null, 2)
          },
          {
            statusCode: 409,
            statusText: 'Conflict',
            description: 'Email address already registered',
            exampleJson: JSON.stringify({error: 'email_already_exists', message: 'A user with email "mayank@example.com" already exists.'}, null, 2)
          },
          {
            statusCode: 422,
            statusText: 'Unprocessable Entity',
            description: 'Email syntax violates RFC standard',
            exampleJson: JSON.stringify({error: 'invalid_email_format', message: 'Provided email address is malformed.'}, null, 2)
          }
        ],
        curlExample: 'curl -X POST http://localhost:8000/users -H "Content-Type: application/json" -d \'{"name":"Mayank Patel","email":"mayank@example.com"}\''
      },
      {
        id: 'ep-get-users',
        method: 'GET',
        path: '/users',
        summary: 'List all active users',
        description: 'Returns an array of registered user summaries sorted by creation timestamp descending.',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Collection of users',
            exampleJson: JSON.stringify({
              data: [
                {id: 1, name: 'Mayank Patel', email: 'mayank@example.com', createdAt: '2026-09-02T12:00:00.000Z'},
                {id: 2, name: 'Sarah Lin', email: 'sarah@example.com', createdAt: '2026-09-02T12:05:00.000Z'}
              ],
              total: 2,
              page: 1,
              limit: 20
            }, null, 2)
          }
        ]
      },
      {
        id: 'ep-get-user-id',
        method: 'GET',
        path: '/users/:id',
        summary: 'Fetch user by ID',
        description: 'Retrieves a single user record by their identifier.',
        responses: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'User details found',
            exampleJson: JSON.stringify({id: 1, name: 'Mayank Patel', email: 'mayank@example.com', createdAt: '2026-09-02T12:00:00.000Z'}, null, 2)
          },
          {
            statusCode: 404,
            statusText: 'Not Found',
            description: 'No user exists with the specified ID',
            exampleJson: JSON.stringify({error: 'user_not_found', message: 'User with id 999 does not exist.'}, null, 2)
          }
        ]
      },
      {
        id: 'ep-del-user-id',
        method: 'DELETE',
        path: '/users/:id',
        summary: 'Delete user by ID',
        responses: [
          { statusCode: 204, statusText: 'No Content', description: 'User successfully deleted' },
          { statusCode: 404, statusText: 'Not Found', description: 'User not found', exampleJson: JSON.stringify({error: 'user_not_found'}, null, 2) }
        ]
      }
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Creates a valid user',
        category: 'Contract',
        description: 'POST /users with valid name and email returns 201 Created and persisted object with id.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Mayank Patel', email: 'mayank@example.com' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"name": "Mayank Patel"'
      },
      {
        id: 'tc-2',
        name: 'Rejects invalid email format',
        category: 'Validation',
        description: 'POST /users with invalid email string yields HTTP 422.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Test User', email: 'invalid-email-string' }),
        expectedStatus: 422,
        expectedResponseSnippet: '"error": "invalid_email_format"'
      },
      {
        id: 'tc-3',
        name: 'Rejects missing name parameter',
        category: 'Validation',
        description: 'POST /users without name field must return HTTP 400 Bad Request.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ email: 'noname@example.com' }),
        expectedStatus: 400,
        expectedResponseSnippet: '"error": "missing_required_field"'
      },
      {
        id: 'tc-4',
        name: 'Rejects duplicate email with 409 Conflict',
        category: 'Edge Case',
        description: 'Registering an already registered email yields 409 Conflict.',
        endpoint: '/users',
        method: 'POST',
        requestPayload: JSON.stringify({ name: 'Duplicate Mayank', email: 'mayank@example.com' }),
        expectedStatus: 409,
        expectedResponseSnippet: '"error": "email_already_exists"'
      },
      {
        id: 'tc-5',
        name: 'Returns 404 for non-existent user ID',
        category: 'Contract',
        description: 'GET /users/99999 returns HTTP 404 Not Found, not a 500 error.',
        endpoint: '/users/99999',
        method: 'GET',
        expectedStatus: 404,
        expectedResponseSnippet: '"error": "user_not_found"'
      },
      {
        id: 'tc-6',
        name: 'Trims leading/trailing whitespace in name [Hidden]',
        category: 'Edge Case',
        description: 'POST /users with padded name saves trimmed string.',
        endpoint: '/users',
        method: 'POST',
        isHidden: true,
        requestPayload: JSON.stringify({ name: '  Padded Name  ', email: 'padded@example.com' }),
        expectedStatus: 201,
        expectedResponseSnippet: '"name": "Padded Name"'
      }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// In-memory data store
const users: User[] = [];
let nextId = 1;

// Helper: Basic RFC email regex validator
const isValidEmail = (email: string): boolean => {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
};

// TODO 1: Implement POST /users
// - Validate required fields (name, email). Return 400 if missing.
// - Trim name, normalize email to lowercase.
// - Validate email format. Return 422 if invalid.
// - Reject duplicate email with 409 Conflict ({"error": "email_already_exists"}).
// - Persist user with auto-increment ID and ISO createdAt.
// - Return 201 Created with the new user object.
app.post('/users', (req: Request, res: Response) => {
  // TODO: Your implementation here
  return res.status(501).json({ error: 'not_implemented' });
});

// TODO 2: Implement GET /users
// - Return 200 OK with list of users: { data: users, total: users.length }
app.get('/users', (_req: Request, res: Response) => {
  // TODO: Your implementation here
  return res.status(501).json({ error: 'not_implemented' });
});

// TODO 3: Implement GET /users/:id
// - Look up user by numeric ID. Return 200 with user if found, or 404 ({"error": "user_not_found"}).
app.get('/users/:id', (req: Request, res: Response) => {
  // TODO: Your implementation here
  return res.status(501).json({ error: 'not_implemented' });
});

// TODO 4: Implement DELETE /users/:id
// - Delete user by ID. Return 204 No Content, or 404 if not found.
app.delete('/users/:id', (req: Request, res: Response) => {
  // TODO: Your implementation here
  return res.status(501).json({ error: 'not_implemented' });
});

export default app;`,
      go: `package main

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

type User struct {
	ID        int       \`json:"id"\`
	Name      string    \`json:"name"\`
	Email     string    \`json:"email"\`
	CreatedAt time.Time \`json:"createdAt"\`
}

type Store struct {
	sync.RWMutex
	users []User
}

var store = &Store{}
var emailRegex = regexp.MustCompile(\`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$\`)

func handleUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	// TODO: Implement REST handlers for POST /users and GET /users
	w.WriteHeader(http.StatusNotImplemented)
}

func main() {
	http.HandleFunc("/users", handleUsers)
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
import re

app = FastAPI(title="User Management API")

class UserCreate(BaseModel):
    name: str
    email: str

EMAIL_REGEX = r"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
users_db = []

# TODO: Implement POST /users, GET /users, GET /users/{id}
@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    # TODO: Implement validation and persistence
    raise HTTPException(status_code=501, detail={"error": "not_implemented"})
`
    }
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener API',
    slug: 'url-shortener',
    difficulty: 'BEGINNER',
    category: 'REST API',
    summary: 'Build an API that creates shortened URL codes, redirects clients, and counts visits.',
    estimatedMinutes: 30,
    concepts: ['REST', 'Database', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: `Implement a high-performance URL Shortener service with Base62 shortcode generation, HTTP 302 vs 301 redirection rules, and click analytics.`,
    requirements: [
      { id: 'u1', title: 'POST /shorten endpoint', detail: 'Accepts url and optional customAlias. Returns 201 Created with shortCode.', isCritical: true, badge: 'REST' },
      { id: 'u2', title: 'GET /:code Redirection', detail: 'Responds with 302 Found and Location header. If not found, return 404.', isCritical: true, badge: 'HTTP' },
      { id: 'u3', title: 'Click Counter Analytics', detail: 'GET /analytics/:code returns clicks count, createdAt, originalUrl.', isCritical: false, badge: 'Database' }
    ],
    constraints: ['Short codes must be alphanumeric [0-9a-zA-Z]', 'Reject malformed URL protocols with 400'],
    endpoints: [
      {
        id: 'ep-shorten',
        method: 'POST',
        path: '/shorten',
        summary: 'Create shortened link',
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ url: 'https://github.com/torvalds/linux', customAlias: 'linux' }, null, 2),
          fields: [
            { name: 'url', type: 'string', required: true, description: 'Target destination URL' },
            { name: 'customAlias', type: 'string', required: false, description: 'Optional custom slug' }
          ]
        },
        responses: [
          { statusCode: 201, statusText: 'Created', description: 'Short link created', exampleJson: JSON.stringify({ shortCode: 'linux', shortUrl: 'http://rank.sh/linux' }, null, 2) },
          { statusCode: 409, statusText: 'Conflict', description: 'Alias already reserved' }
        ]
      },
      {
        id: 'ep-redirect',
        method: 'GET',
        path: '/:code',
        summary: 'Redirect to original URL',
        responses: [
          {
            statusCode: 302,
            statusText: 'Found',
            description: 'Redirects to target',
            headers: { Location: 'https://github.com/torvalds/linux' }
          },
          { statusCode: 404, statusText: 'Not Found', description: 'Shortcode not found' }
        ]
      }
    ],
    testCases: [
      { id: 'u-tc1', name: 'Creates short code for valid URL', category: 'Contract', description: 'POST /shorten returns 201 and shortCode.', endpoint: '/shorten', method: 'POST', requestPayload: JSON.stringify({ url: 'https://kernel.org' }), expectedStatus: 201, expectedResponseSnippet: 'shortCode' },
      { id: 'u-tc2', name: 'Redirects with HTTP 302', category: 'Contract', description: 'GET /:code yields 302 redirect.', endpoint: '/a1b2c3', method: 'GET', expectedStatus: 302 },
      { id: 'u-tc3', name: 'Rejects malformed URL protocols', category: 'Validation', description: 'Rejects non-http URLs with 400.', endpoint: '/shorten', method: 'POST', requestPayload: JSON.stringify({ url: 'javascript:alert(1)' }), expectedStatus: 400, expectedResponseSnippet: 'invalid_url_protocol' }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

interface ShortLink {
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

const urlStore = new Map<string, ShortLink>();

const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// TODO 1: Implement POST /shorten
// - Validate url is present and valid http/https (return 400 if invalid).
// - Generate unique short code or use customAlias if provided.
// - If customAlias already exists, return 409 Conflict ({"error": "alias_already_exists"}).
// - Save to urlStore and return 201 Created with { shortCode, shortUrl: \`http://rank.sh/\${shortCode}\` }.
app.post('/shorten', (req: Request, res: Response) => {
  // TODO: Your implementation here
  return res.status(501).json({ error: 'not_implemented' });
});

// TODO 2: Implement GET /:code
// - Look up code in urlStore. Return 404 ({"error": "shortcode_not_found"}) if missing.
// - Increment clicks count and return 302 redirect to originalUrl.
app.get('/:code', (req: Request, res: Response) => {
  // TODO: Your implementation here
  return res.status(501).json({ error: 'not_implemented' });
});

export default app;`,
      go: `package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

type ShortLink struct {
	Code        string    \`json:"shortCode"\`
	OriginalURL string    \`json:"originalUrl"\`
	Clicks      int       \`json:"clicks"\`
	CreatedAt   time.Time \`json:"createdAt"\`
}

var (
	store = make(map[string]*ShortLink)
	mu    sync.RWMutex
)

func handleShorten(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement POST /shorten
	w.WriteHeader(http.StatusNotImplemented)
}

func main() {
	http.HandleFunc("/shorten", handleShorten)
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import secrets

app = FastAPI(title="URL Shortener API")

class ShortenRequest(BaseModel):
    url: str
    customAlias: Optional[str] = None

url_db = {}

@app.post("/shorten", status_code=status.HTTP_201_CREATED)
def shorten_url(payload: ShortenRequest):
    # TODO: Implement URL shortening logic
    raise HTTPException(status_code=501, detail={"error": "not_implemented"})
`
    }
  },
  {
    id: 'request-logger',
    title: 'Request Logger Middleware',
    slug: 'request-logger',
    difficulty: 'BEGINNER',
    category: 'Middleware',
    summary: 'Build middleware that records incoming API requests, attaches trace headers, and computes execution time.',
    estimatedMinutes: 20,
    concepts: ['HTTP', 'Middleware'],
    status: 'UNSOLVED',
    problemStatement: 'Construct a robust HTTP logging middleware pipeline. Every incoming request must be stamped with a correlation ID (UUIDv4) and measured for wall-clock latency.',
    requirements: [
      { id: 'l1', title: 'Inject X-Request-Id header', detail: 'If incoming request lacks X-Request-Id, generate UUIDv4. Propagate to all responses.', isCritical: true, badge: 'HTTP' },
      { id: 'l2', title: 'Execution time measurement', detail: 'Measure duration in ms and set in X-Response-Time header.', isCritical: true, badge: 'Middleware' }
    ],
    constraints: ['Do not buffer large request bodies in memory', 'Preserve existing client trace IDs'],
    endpoints: [
      {
        id: 'ep-log-all',
        method: 'GET',
        path: '/api/v1/ping',
        summary: 'Probe endpoint with middleware active',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Returns pong with headers', headers: { 'X-Request-Id': 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'X-Response-Time': '3.8ms' } }
        ]
      }
    ],
    testCases: [
      { id: 'l-tc1', name: 'Generates X-Request-Id when omitted', category: 'Contract', description: 'Stamps valid UUIDv4 on outgoing headers.', endpoint: '/api/v1/ping', method: 'GET', expectedStatus: 200 },
      { id: 'l-tc2', name: 'Preserves existing client trace ID', category: 'Edge Case', description: 'Echoes inbound X-Request-ID unaltered.', endpoint: '/api/v1/ping', method: 'GET', expectedStatus: 200 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// TODO: Implement Request Logger Middleware
// - If incoming request has 'x-request-id' header, preserve it; otherwise generate UUIDv4.
// - Attach 'x-request-id' header to response.
// - Measure execution duration and attach 'x-response-time' header in ms.
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', reqId);
  next();
});

app.get('/api/v1/ping', (req: Request, res: Response) => {
  return res.status(200).json({ status: 'pong' });
});

export default app;`,
      go: `package main

import "net/http"

func main() {
	// TODO: Implement request logger middleware in Go
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI, Request
import time, uuid

app = FastAPI()

# TODO: Implement request logger middleware in FastAPI
`
    }
  },
  {
    id: 'rate-limiter',
    title: 'Sliding Window Rate Limiter',
    slug: 'rate-limiter',
    difficulty: 'INTERMEDIATE',
    category: 'Infrastructure',
    summary: 'Implement a distributed sliding-window rate limiter with Redis and standard HTTP rate limit headers.',
    estimatedMinutes: 45,
    concepts: ['Redis', 'HTTP', 'Concurrency', 'Rate Limiting'],
    status: 'IN_PROGRESS',
    problemStatement: 'Protect downstream APIs from abuse by building a precise sliding-window rate limiter using Redis sorted sets (ZSET + Lua). Enforce a maximum of 60 req/min per IP. Reject excess with 429 Too Many Requests and Retry-After.',
    requirements: [
      { id: 'rl1', title: 'Standard Header compliance', detail: 'Returns X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.', isCritical: true, badge: 'HTTP' },
      { id: 'rl2', title: '429 rejection & Retry-After', detail: 'Exceeding quota yields 429 with Retry-After in seconds.', isCritical: true, badge: 'Rate Limiting' },
      { id: 'rl3', title: 'Atomic Redis evaluation', detail: 'Sliding log evaluation must avoid concurrency race conditions.', isCritical: true, badge: 'Concurrency' }
    ],
    constraints: ['Sliding window within 100ms precision', 'Auto-purge expired Redis timestamps'],
    endpoints: [
      {
        id: 'ep-rl-test',
        method: 'GET',
        path: '/api/resource',
        summary: 'Protected resource',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Allowed' },
          { statusCode: 429, statusText: 'Too Many Requests', description: 'Quota exhausted', headers: { 'Retry-After': '18', 'X-RateLimit-Remaining': '0' } }
        ]
      }
    ],
    testCases: [
      { id: 'rl-tc1', name: 'Allows requests under limit', category: 'Contract', description: 'Decrements X-RateLimit-Remaining.', endpoint: '/api/resource', method: 'GET', expectedStatus: 200 },
      { id: 'rl-tc2', name: 'Returns 429 when 60-request quota breached', category: 'Validation', description: 'Rejects with 429 on excess.', endpoint: '/api/resource', method: 'GET', expectedStatus: 429 },
      { id: 'rl-tc3', name: 'Parallel concurrency race condition safety [Hidden]', category: 'Concurrency', description: '50 simultaneous requests test.', endpoint: '/api/resource', method: 'GET', isHidden: true, expectedStatus: 200 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

const requestLogs = new Map<string, number[]>();
const LIMIT = 60;
const WINDOW_MS = 60000;

// TODO: Implement sliding window rate limiter
app.get('/api/resource', (req: Request, res: Response) => {
  return res.status(200).json({ data: 'Resource payload' });
});

export default app;`,
      go: `package main

import "net/http"

func main() {
	// TODO: Implement rate limiter in Go
	http.ListenAndServe(":8000", nil)
}`,
      python: `from fastapi import FastAPI
app = FastAPI()
# TODO: Implement rate limiter in FastAPI
`
    }
  },
  {
    id: 'idempotent-payment-webhook',
    title: 'Idempotent Payment Webhook',
    slug: 'idempotent-payment-webhook',
    difficulty: 'INTERMEDIATE',
    category: 'Webhooks',
    summary: 'Build a rock-solid webhook receiver that guarantees exactly-once payment processing despite retries.',
    estimatedMinutes: 40,
    concepts: ['Idempotency', 'Database', 'Webhooks', 'Security'],
    status: 'UNSOLVED',
    problemStatement: 'Payment gateways like Stripe frequently retry failed webhooks. Prevent double-charging using event deduplication and HMAC-SHA256 signature verification.',
    requirements: [
      { id: 'p1', title: 'HMAC-SHA256 Signature Verification', detail: 'Verify Stripe-Signature header. Reject bad signatures with 401 Unauthorized.', isCritical: true, badge: 'Security' },
      { id: 'p2', title: 'Event ID deduplication', detail: 'Subsequent calls with same event_id must return 200 OK without double-crediting balance.', isCritical: true, badge: 'Idempotency' }
    ],
    constraints: ['Parallel webhooks must not race on user balance', 'Respond within 200ms'],
    endpoints: [
      {
        id: 'ep-pay-webhook',
        method: 'POST',
        path: '/webhooks/stripe',
        summary: 'Receive payment events',
        requestBody: {
          contentType: 'application/json',
          exampleJson: JSON.stringify({ id: 'evt_101', type: 'payment_intent.succeeded', data: { amount: 5000 } }, null, 2),
          fields: [{ name: 'id', type: 'string', required: true, description: 'Unique event id' }]
        },
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Acknowledged', exampleJson: JSON.stringify({ received: true, status: 'processed' }, null, 2) },
          { statusCode: 401, statusText: 'Unauthorized', description: 'Invalid signature' }
        ]
      }
    ],
    testCases: [
      { id: 'p-tc1', name: 'Credits account on first arrival', category: 'Contract', description: 'New payment event acknowledges with 200.', endpoint: '/webhooks/stripe', method: 'POST', expectedStatus: 200 },
      { id: 'p-tc2', name: 'Deduplicates identical event without mutation', category: 'Edge Case', description: 'Retried webhook returns 200 without double-crediting.', endpoint: '/webhooks/stripe', method: 'POST', expectedStatus: 200 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const processedEvents = new Set<string>();

// TODO: Implement POST /webhooks/stripe
// - Validate event ID
// - Deduplicate: return 200 without double-crediting
app.post('/webhooks/stripe', (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'missing_event_id' });
  processedEvents.add(id);
  return res.status(200).json({ received: true, status: 'processed' });
});

export default app;`,
      go: `package main
import "net/http"
func main() { http.ListenAndServe(":8000", nil) }`,
      python: `from fastapi import FastAPI
app = FastAPI()`
    }
  },
  {
    id: 'jwt-auth-refresh',
    title: 'JWT Authentication & Refresh Flow',
    slug: 'jwt-auth-refresh',
    difficulty: 'INTERMEDIATE',
    category: 'Security',
    summary: 'Implement short-lived access tokens, sliding refresh token rotation, and token revocation.',
    estimatedMinutes: 35,
    concepts: ['Auth', 'Security', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: 'Implement secure JWT authentication with 15-minute accessToken and single-use rotating refreshTokens.',
    requirements: [
      { id: 'j1', title: 'POST /auth/login credentials exchange', detail: 'Valid credentials yield accessToken (JWT) and refreshToken (UUIDv4).', isCritical: true, badge: 'Auth' },
      { id: 'j2', title: 'Refresh Token Rotation', detail: 'Using refreshToken invalidates it and issues new pair.', isCritical: true, badge: 'Security' }
    ],
    constraints: ['Bearer authentication header parsing', 'Revoke entire family on token reuse'],
    endpoints: [
      {
        id: 'ep-auth-login',
        method: 'POST',
        path: '/auth/login',
        summary: 'Authenticate with credentials',
        responses: [
          { statusCode: 200, statusText: 'OK', description: 'Tokens issued', exampleJson: JSON.stringify({ accessToken: 'eyJhbGciOiJIUzI2NiIsInR5cCI6IkpXVCJ9...', refreshToken: '8f411b0e-2d33-4f9e-a89a-ec269e8b704c' }, null, 2) }
        ]
      }
    ],
    testCases: [
      { id: 'j-tc1', name: 'Issues JWT pair on valid credentials', category: 'Contract', description: 'POST /auth/login yields accessToken.', endpoint: '/auth/login', method: 'POST', expectedStatus: 200 },
      { id: 'j-tc2', name: 'Rejects invalid password with 401', category: 'Validation', description: 'Incorrect password returns 401 Unauthorized.', endpoint: '/auth/login', method: 'POST', expectedStatus: 401 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// TODO: Implement POST /auth/login
app.post('/auth/login', (req: Request, res: Response) => {
  // Validate credentials and issue tokens
  return res.status(501).json({ error: 'not_implemented' });
});

export default app;`,
      go: `package main
import "net/http"
func main() { http.ListenAndServe(":8000", nil) }`,
      python: `from fastapi import FastAPI
app = FastAPI()`
    }
  },
  {
    id: 'in-memory-kv-ttl',
    title: 'In-Memory Key-Value Store with TTL',
    slug: 'in-memory-kv-ttl',
    difficulty: 'INTERMEDIATE',
    category: 'Infrastructure',
    summary: 'Build an in-memory key-value engine with Millisecond TTL expirations and O(1) lookups.',
    estimatedMinutes: 35,
    concepts: ['Cache', 'Concurrency', 'HTTP'],
    status: 'UNSOLVED',
    problemStatement: 'Create a lightweight in-memory cache engine with expiration semantics similar to Redis. Support millisecond TTL and active eviction sweeps.',
    requirements: [
      { id: 'kv1', title: 'POST /kv/set with optional ttl_ms', detail: 'Stores key-value. Expired keys return 404 after elapsed duration.', isCritical: true, badge: 'Cache' },
      { id: 'kv2', title: 'GET /kv/get/:key retrieval', detail: 'Returns value or 404 if expired.', isCritical: true, badge: 'HTTP' }
    ],
    constraints: ['Key lookups must be O(1)', 'Active and passive sweep policies'],
    endpoints: [
      {
        id: 'ep-kv-set',
        method: 'POST',
        path: '/kv/set',
        summary: 'Set key-value',
        responses: [{ statusCode: 200, statusText: 'OK', description: 'Key saved' }]
      }
    ],
    testCases: [
      { id: 'kv-tc1', name: 'Sets and retrieves value', category: 'Contract', description: 'POST then GET returns matching value.', endpoint: '/kv/get/session_89', method: 'GET', expectedStatus: 200 },
      { id: 'kv-tc2', name: 'Key expires after TTL elapsed', category: 'Edge Case', description: 'Returns 404 after TTL expires.', endpoint: '/kv/get/session_89', method: 'GET', expectedStatus: 404 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const store = new Map<string, { value: any; expiresAt?: number }>();

// TODO 1: Implement POST /kv/set
app.post('/kv/set', (req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented' });
});

// TODO 2: Implement GET /kv/get/:key
app.get('/kv/get/:key', (req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented' });
});

export default app;`,
      go: `package main
import "net/http"
func main() { http.ListenAndServe(":8000", nil) }`,
      python: `from fastapi import FastAPI
app = FastAPI()`
    }
  },
  {
    id: 'job-queue-worker',
    title: 'Distributed Job Queue Worker API',
    slug: 'job-queue-worker',
    difficulty: 'ADVANCED',
    category: 'Distributed Systems',
    summary: 'Build an asynchronous job processing system with retry backoff, dead-letter queues, and status polling.',
    estimatedMinutes: 50,
    concepts: ['Queues', 'Redis', 'Concurrency', 'Database'],
    status: 'UNSOLVED',
    problemStatement: 'Design an asynchronous background job dispatch API with DLQ retry failover and priority scheduling.',
    requirements: [
      { id: 'q1', title: 'POST /jobs/enqueue dispatch', detail: 'Returns 202 Accepted with jobId and QUEUED status.', isCritical: true, badge: 'Queues' },
      { id: 'q2', title: 'Dead Letter Queue (DLQ) routing', detail: 'After 3 consecutive failures, transition to DEAD_LETTER.', isCritical: true, badge: 'Distributed Systems' }
    ],
    constraints: ['Visibility timeout locks', 'Support Priority queues'],
    endpoints: [
      {
        id: 'ep-job-enqueue',
        method: 'POST',
        path: '/jobs/enqueue',
        summary: 'Enqueue async workload',
        responses: [
          { statusCode: 202, statusText: 'Accepted', description: 'Job queued', exampleJson: JSON.stringify({ jobId: 'job_98x2', status: 'QUEUED' }, null, 2) }
        ]
      }
    ],
    testCases: [
      { id: 'q-tc1', name: 'Returns 202 Accepted with job ticket', category: 'Contract', description: 'Acknowledges queued workload.', endpoint: '/jobs/enqueue', method: 'POST', expectedStatus: 202 },
      { id: 'q-tc2', name: 'Moves to DEAD_LETTER after 3 failed retries [Hidden]', category: 'Edge Case', description: 'Verifies DLQ quarantine.', endpoint: '/jobs/job_fail/status', method: 'GET', isHidden: true, expectedStatus: 200 }
    ],
    starterCode: {
      nodejs: `import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// TODO 1: Implement POST /jobs/enqueue
app.post('/jobs/enqueue', (req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented' });
});

// TODO 2: Implement GET /jobs/:jobId/status
app.get('/jobs/:jobId/status', (req: Request, res: Response) => {
  return res.status(501).json({ error: 'not_implemented' });
});

export default app;`,
      go: `package main
import "net/http"
func main() { http.ListenAndServe(":8000", nil) }`,
      python: `from fastapi import FastAPI
app = FastAPI()`
    }
  }
];