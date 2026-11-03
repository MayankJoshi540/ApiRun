'use client';

import React, { useState, useEffect } from 'react';
import { Challenge, APIEndpoint } from '../types';
import { 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Terminal,
  ChevronDown,
  ChevronUp
} from '@/components/ui/GoogleIcon';

interface Props {
  challenge: Challenge;
  currentCode: string;
  currentLanguage: 'nodejs' | 'go' | 'python';
}

interface ApiResponse {
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

export const ApiPlaygroundPanel: React.FC<Props> = ({
  challenge,
  currentCode,
  currentLanguage
}) => {
  // Endpoints list from challenge
  const endpoints: APIEndpoint[] = challenge.endpoints || [];

  // Active method & path
  const [method, setMethod] = useState<string>(() => {
    return endpoints.length > 0 ? endpoints[0].method : 'GET';
  });

  const [endpointPath, setEndpointPath] = useState<string>(() => {
    if (endpoints.length === 0) return '/';
    const ep = endpoints[0];
    // Replace url params like :key with a dummy value
    return ep.path.replace(/:([a-zA-Z0-9_]+)/g, 'test_$1');
  });

  const [requestBody, setRequestBody] = useState<string>(() => {
    if (endpoints.length > 0 && endpoints[0].requestBody?.exampleJson) {
      try {
        return JSON.stringify(JSON.parse(endpoints[0].requestBody.exampleJson), null, 2);
      } catch {
        return endpoints[0].requestBody.exampleJson;
      }
    }
    return '{\n  "key": "example_key",\n  "value": "example_value"\n}';
  });

  const [activeReqSubTab, setActiveReqSubTab] = useState<'body' | 'headers'>('body');
  const [customHeaders, setCustomHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  
  // Execution state
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);

  // When user picks an endpoint from presets
  const handleSelectEndpoint = (ep: APIEndpoint) => {
    setMethod(ep.method.toUpperCase());
    const samplePath = ep.path.replace(/:([a-zA-Z0-9_]+)/g, 'sample_$1');
    setEndpointPath(samplePath);

    if (ep.requestBody?.exampleJson) {
      try {
        setRequestBody(JSON.stringify(JSON.parse(ep.requestBody.exampleJson), null, 2));
      } catch {
        setRequestBody(ep.requestBody.exampleJson);
      }
    } else if (ep.method === 'GET' || ep.method === 'DELETE') {
      setRequestBody('');
    }
  };

  const handlePrettifyJson = () => {
    try {
      if (requestBody.trim()) {
        const parsed = JSON.parse(requestBody);
        setRequestBody(JSON.stringify(parsed, null, 2));
      }
    } catch {}
  };

  const handleSendRequest = async () => {
    if (isSending) return;
    setIsSending(true);

    try {
      let parsedBody: any = undefined;
      if (method !== 'GET' && method !== 'HEAD' && requestBody.trim()) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch {
          parsedBody = requestBody;
        }
      }

      let parsedHeaders: Record<string, string> = { 'content-type': 'application/json' };
      if (customHeaders.trim()) {
        try {
          parsedHeaders = { ...parsedHeaders, ...JSON.parse(customHeaders) };
        } catch {}
      }

      const res = await fetch('/api/run-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          language: currentLanguage,
          method,
          endpoint: endpointPath,
          payload: parsedBody,
          headers: parsedHeaders,
        })
      });

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({
        status: 500,
        statusText: 'Failed to Connect',
        data: { error: 'sandbox_unreachable', message: err?.message || 'Network error' },
        headers: {},
        durationMs: 1,
        logs: [],
        error: err?.message
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response) return;
    const text = typeof response.data === 'object' 
      ? JSON.stringify(response.data, null, 2) 
      : String(response.data);
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (status >= 300 && status < 400) return 'text-sky-400 bg-sky-500/15 border-sky-500/30';
    if (status >= 400 && status < 500) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  const getMethodBadgeColor = (m: string) => {
    switch (m.toUpperCase()) {
      case 'GET': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'POST': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'PUT': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'DELETE': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'PATCH': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* ── PRESETS CHIP BAR ── */}
      {endpoints.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Preset Endpoints (Click to Load)</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {endpoints.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectEndpoint(ep)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14161c] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono transition-all cursor-pointer active:scale-[0.97]"
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getMethodBadgeColor(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="text-zinc-200">{ep.path}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── REQUEST CONTROLS (METHOD + URL + SEND) ── */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Method Select */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`h-10 px-3 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer bg-[#14161c] focus:outline-none focus:ring-1 focus:ring-emerald-400 ${getMethodBadgeColor(method)}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        {/* URL Input */}
        <div className="flex-1 relative min-w-[200px]">
          <input
            type="text"
            value={endpointPath}
            onChange={(e) => setEndpointPath(e.target.value)}
            placeholder="/kv/set"
            className="w-full h-10 px-3.5 rounded-xl bg-[#14161c] border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-mono text-sm placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendRequest}
          disabled={isSending}
          className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 shrink-0"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </>
          )}
        </button>
      </div>

      {/* ── TWO-COLUMN SPLIT: REQUEST (Left/Top) & RESPONSE (Right/Bottom) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── REQUEST PANEL ── */}
        <div className="space-y-2 p-3.5 rounded-xl bg-[#12141a] border border-zinc-800">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveReqSubTab('body')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeReqSubTab === 'body'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Body (JSON)
              </button>
              <button
                onClick={() => setActiveReqSubTab('headers')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeReqSubTab === 'headers'
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Headers
              </button>
            </div>

            {activeReqSubTab === 'body' && (
              <button
                onClick={handlePrettifyJson}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Prettify JSON
              </button>
            )}
          </div>

          {activeReqSubTab === 'body' ? (
            <div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={7}
                placeholder={method === 'GET' ? '(GET requests usually do not require a body)' : '{\n  "key": "value"\n}'}
                className="w-full p-2.5 rounded-lg bg-[#0a0c10] border border-zinc-800 text-zinc-200 font-mono text-xs focus:outline-none focus:border-zinc-700 resize-y leading-relaxed"
              />
              <span className="text-[11px] text-zinc-500 font-mono">
                {method === 'GET' ? 'ℹ GET requests bypass request body.' : '✓ Sent as parsed JSON to req.body'}
              </span>
            </div>
          ) : (
            <div>
              <textarea
                value={customHeaders}
                onChange={(e) => setCustomHeaders(e.target.value)}
                rows={7}
                placeholder='{\n  "Authorization": "Bearer secret_token"\n}'
                className="w-full p-2.5 rounded-lg bg-[#0a0c10] border border-zinc-800 text-zinc-200 font-mono text-xs focus:outline-none focus:border-zinc-700 resize-y leading-relaxed"
              />
              <span className="text-[11px] text-zinc-500 font-mono">
                ✓ Headers available via req.headers or req.get(&apos;header-name&apos;)
              </span>
            </div>
          )}
        </div>

        {/* ── RESPONSE PANEL ── */}
        <div className="space-y-2 p-3.5 rounded-xl bg-[#12141a] border border-zinc-800">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Response
              </span>
              {response && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${getStatusColor(response.status)}`}>
                  <span>HTTP {response.status}</span>
                  <span className="font-sans font-medium text-[11px]">{response.statusText}</span>
                </span>
              )}
            </div>

            {response && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                  ⚡ {response.durationMs}ms
                </span>
                <button
                  onClick={handleCopyResponse}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Response"
                >
                  {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {!response && !isSending && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 text-zinc-400">
              <Zap className="w-7 h-7 text-emerald-400/60" />
              <p className="text-xs font-medium text-zinc-300">No request sent yet</p>
              <p className="text-[11px] text-zinc-500 max-w-[280px]">
                Select an endpoint preset or type a route and click <strong className="text-emerald-400">&quot;Send Request&quot;</strong> to test your code live.
              </p>
            </div>
          )}

          {isSending && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <p className="text-xs font-mono text-zinc-300">Invoking route handler inside VM sandbox...</p>
            </div>
          )}

          {response && !isSending && (
            <div className="space-y-2">
              {/* Matched Route Notice */}
              {response.matchedRoute && (
                <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Handled by: <code className="text-white bg-zinc-800 px-1 py-0.5 rounded">{response.matchedRoute}</code></span>
                </div>
              )}

              {/* Response Body Pre */}
              <div className="relative">
                <pre className="p-3 rounded-lg bg-[#0a0c10] border border-zinc-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[180px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700">
                  {typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : String(response.data || '(Empty response body)')}
                </pre>
              </div>

              {/* Collapsible Headers Section */}
              <div className="pt-1">
                <button
                  onClick={() => setShowHeaders(!showHeaders)}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showHeaders ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  <span>Response Headers ({Object.keys(response.headers || {}).length})</span>
                </button>

                {showHeaders && (
                  <div className="mt-1.5 p-2 rounded bg-[#0a0c10] border border-zinc-800 font-mono text-[11px] space-y-1 text-zinc-300 max-h-[100px] overflow-y-auto">
                    {Object.entries(response.headers || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-zinc-500">{k}:</span>
                        <span className="text-zinc-200 font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* If console logs were captured */}
              {response.logs && response.logs.length > 0 && (
                <div className="pt-1">
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mb-1">
                    <Terminal className="w-3 h-3 text-sky-400" />
                    <span>Handler Console Logs</span>
                  </div>
                  <div className="p-2 rounded bg-[#0a0c10] border border-zinc-800 font-mono text-[11px] space-y-0.5 text-zinc-400 max-h-[80px] overflow-y-auto">
                    {response.logs.map((l, i) => (
                      <div key={i} className="text-zinc-300">
                        <span className="text-zinc-500 mr-2">[{l.timestamp}]</span>
                        <span>{l.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
