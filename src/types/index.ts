export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export type ChallengeStatus = 'SOLVED' | 'IN_PROGRESS' | 'UNSOLVED';

export type BackendConcept = 
  | 'HTTP' 
  | 'REST' 
  | 'Database' 
  | 'Redis' 
  | 'Middleware' 
  | 'Validation' 
  | 'Concurrency' 
  | 'Auth' 
  | 'Cache' 
  | 'Queues' 
  | 'Idempotency' 
  | 'Webhooks' 
  | 'Rate Limiting'
  | 'Security';

export interface EndpointHeader {
  key: string;
  value: string;
  required: boolean;
  description?: string;
}

export interface EndpointParam {
  name: string;
  type: string;
  in: 'path' | 'query';
  required: boolean;
  description: string;
  example?: string;
}

export interface BodyField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface EndpointRequestBody {
  contentType: string;
  exampleJson: string;
  fields: BodyField[];
}

export interface EndpointResponse {
  statusCode: number;
  statusText: string;
  description: string;
  exampleJson?: string;
  headers?: Record<string, string>;
}

export interface APIEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  headers?: EndpointHeader[];
  params?: EndpointParam[];
  requestBody?: EndpointRequestBody;
  responses: EndpointResponse[];
  curlExample?: string;
}

export interface Requirement {
  id: string;
  title: string;
  detail: string;
  isCritical?: boolean;
  badge?: string;
}

export interface TestCase {
  id: string;
  name: string;
  category: 'Contract' | 'Validation' | 'Edge Case' | 'Concurrency' | 'Performance';
  description: string;
  endpoint: string;
  method: HttpMethod;
  isHidden?: boolean;
  requestPayload?: string;
  expectedStatus: number;
  expectedResponseSnippet?: string;
}

export interface TestResultItem {
  testId: string;
  name: string;
  category: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  durationMs: number;
  isHidden?: boolean;
  endpoint: string;
  method: HttpMethod;
  expectedStatus: number;
  actualStatus?: number;
  requestPayload?: string;
  expectedResponse?: string;
  actualResponse?: string;
  logs: string[];
  failureReason?: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  scorePercent: number;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED';
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  summary: string;
  problemStatement: string;
  requirements: Requirement[];
  constraints: string[];
  concepts: BackendConcept[];
  status: ChallengeStatus;
  estimatedMinutes: number;
  endpoints: APIEndpoint[];
  testCases: TestCase[];
  architectureNotes?: string;
  starterCode?: {
    nodejs: string;
    go: string;
    python: string;
  };
}

export interface UserStats {
  solvedCount: number;
  challengesSolved: number;
  totalChallenges: number;
  totalTestsPassed: number;
  totalSubmissions: number;
  averageLatencyMs: number;
  currentStreak: number;
  rankTitle: string;
}
