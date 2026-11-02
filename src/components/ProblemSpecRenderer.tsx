import React, { useState } from 'react';
import { Challenge, APIEndpoint as EndpointType, EndpointResponse } from '../types';
import { CodeBlock } from './CodeBlock';
import { Copy, Check, Terminal, CheckCircle2, AlertCircle } from '@/components/ui/GoogleIcon';

interface Props {
  challenge: Challenge;
}

/**
 * Formats inline code, methods, bold text, and HTTP status codes cleanly with razor-sharp contrast and comfortable sizing.
 */
function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|&mdash;)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderTextWithStatusBadges(text.substring(lastIndex, match.index), `t-${lastIndex}`));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      const inner = token.slice(1, -1);
      const routeMatch = inner.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD)\s+(\S+)$/i);
      if (routeMatch) {
        const method = routeMatch[1].toUpperCase();
        const path = routeMatch[2];
        const methodColor =
          method === 'GET' ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
          method === 'POST' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
          method === 'PUT' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
          method === 'DELETE' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
          'bg-purple-500/15 text-purple-400 border-purple-500/30';

        parts.push(
          <span
            key={`route-${match.index}`}
            className="inline-flex items-center space-x-2 px-2.5 py-0.5 my-0.5 rounded-md font-mono text-[13.5px] border border-zinc-700 bg-zinc-900 align-baseline font-semibold shadow-xs"
          >
            <span className={`px-2 py-0.5 rounded text-[11.5px] font-bold border ${methodColor}`}>{method}</span>
            <span className="text-zinc-100 font-semibold">{path}</span>
          </span>
        );
      } else {
        parts.push(
          <code
            key={`c-${match.index}`}
            className="px-2 py-0.5 mx-0.5 rounded-md bg-zinc-800 text-emerald-400 font-mono text-[14px] border border-zinc-700/80 inline-block align-baseline font-medium"
          >
            {inner}
          </code>
        );
      }
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`} className="text-white font-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token === '&mdash;') {
      parts.push(<span key={`d-${match.index}`} className="text-zinc-500 mx-1.5">—</span>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(renderTextWithStatusBadges(text.substring(lastIndex), `t-${lastIndex}`));
  }

  return parts;
}

function renderTextWithStatusBadges(text: string, prefix: string): React.ReactNode {
  const statusRegex = /\b(200 OK|201 Created|202 Accepted|204 No Content|302 Found|400 Bad Request|401 Unauthorized|403 Forbidden|404 Not Found|409 Conflict|422 Unprocessable Entity|429 Too Many Requests|500 Internal Server Error)\b/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = statusRegex.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.substring(last, m.index));
    }
    const s = m[0];
    const is2xx = s.startsWith('2');
    const is3xx = s.startsWith('3');
    const is4xx = s.startsWith('4');
    const color = is2xx
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : is3xx
      ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
      : is4xx
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/15 text-rose-400 border-rose-500/30';

    nodes.push(
      <span
        key={`${prefix}-${m.index}`}
        className={`inline-flex items-center font-mono text-[13px] font-bold px-2 py-0.5 rounded-md border mx-0.5 ${color}`}
      >
        {s}
      </span>
    );
    last = m.index + s.length;
  }

  if (last < text.length) {
    nodes.push(text.substring(last));
  }

  return <span key={prefix}>{nodes}</span>;
}

export const ProblemSpecRenderer: React.FC<Props> = ({ challenge }) => {
  return (
    <div className="space-y-6 text-zinc-200 font-sans leading-relaxed antialiased">
      {/* ── 1. PROBLEM OVERVIEW CARD ── */}
      <div className="rounded-xl border border-zinc-800 bg-[#16181d] p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-200">
              Problem Overview
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono font-medium">
            {challenge.category}
          </span>
        </div>

        {/* Paragraphs and Lists with increased, comfortable font size */}
        <div className="space-y-4 text-[16px] text-zinc-200 leading-[1.8] font-normal">
          {challenge.problemStatement.split(/\n\n+/).map((para, pIdx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            const lines = trimmed.split('\n');
            const isList = lines.every(l => /^\s*(\d+\.|\-|\*)\s+/.test(l));

            if (isList) {
              return (
                <div key={pIdx} className="space-y-2.5 my-3">
                  {lines.map((line, lIdx) => {
                    const match = line.match(/^\s*(\d+\.|\-|\*)\s+(.*)$/);
                    if (!match) return <div key={lIdx}>{formatInline(line)}</div>;

                    const bullet = match[1];
                    const content = match[2];
                    const isNum = /^\d+\./.test(bullet);

                    return (
                      <div
                        key={lIdx}
                        className="flex items-start space-x-3 p-3.5 rounded-lg bg-[#111216] border border-zinc-800/80"
                      >
                        {isNum ? (
                          <span className="shrink-0 w-6 h-6 rounded bg-zinc-800 text-sky-400 border border-zinc-700 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                            {bullet.replace('.', '')}
                          </span>
                        ) : (
                          <span className="shrink-0 text-emerald-400 font-bold text-lg leading-none mt-1">•</span>
                        )}
                        <div className="text-[15.5px] text-zinc-100 leading-relaxed flex-1">
                          {formatInline(content)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <p key={pIdx} className="text-[16px] text-zinc-200 leading-[1.8]">
                {formatInline(trimmed)}
              </p>
            );
          })}
        </div>
      </div>

      {/* ── 2. CONSOLIDATED API ENDPOINTS & CONTRACTS ── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-mono font-bold text-zinc-300 tracking-wider uppercase">
              API Endpoints &amp; Contracts ({challenge.endpoints.length})
            </h3>
          </div>
        </div>

        <div className="space-y-3.5">
          {challenge.endpoints.map((ep, idx) => (
            <EndpointCard key={ep.id || idx} endpoint={ep} index={idx} />
          ))}
        </div>
      </div>

      {/* ── 3. SYSTEM CONSTRAINTS & RULES ── */}
      {challenge.constraints && challenge.constraints.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-[#16181d] p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center space-x-2.5 text-sm font-mono uppercase tracking-wider text-zinc-200 font-bold border-b border-zinc-800 pb-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Constraints &amp; Invariants</span>
          </div>
          <div className="space-y-2.5">
            {challenge.constraints.map((c, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-lg bg-[#111216] border border-zinc-800/80 text-[15px] sm:text-[15.5px] text-zinc-200"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{formatInline(c)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Clean, non-redundant, fully-responsive endpoint contract card with readable fonts.
 */
const EndpointCard: React.FC<{ endpoint: EndpointType; index: number }> = ({ endpoint, index }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const methodColors: Record<string, { badge: string; text: string }> = {
    GET: { badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30', text: 'text-sky-400' },
    POST: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', text: 'text-emerald-400' },
    PUT: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', text: 'text-amber-400' },
    DELETE: { badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30', text: 'text-rose-400' },
    PATCH: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', text: 'text-purple-400' },
  };

  const currentTheme = methodColors[endpoint.method] || methodColors.GET;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedResponse = endpoint.responses[activeTab] || endpoint.responses[0];

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#16181d] overflow-hidden shadow-sm">
      {/* Endpoint Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-5 py-3 bg-[#121317] border-b border-zinc-800">
        <div className="flex items-center space-x-3 min-w-0">
          <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${currentTheme.badge}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-white truncate">
            {endpoint.path}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          {endpoint.summary && (
            <span className="text-xs sm:text-[13px] text-zinc-400 hidden sm:inline mr-2 truncate">
              {endpoint.summary}
            </span>
          )}
          <button
            onClick={handleCopyPath}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copy path"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Endpoint Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Request Payload / Headers (if applicable) */}
        {endpoint.requestBody?.exampleJson && (
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>Request Body (JSON)</span>
              <span className="text-[11px] text-zinc-500 font-normal">Content-Type: application/json</span>
            </div>
            <CodeBlock code={endpoint.requestBody.exampleJson} language="json" />
          </div>
        )}

        {/* Expected Responses Section */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
            Expected Responses
          </div>

          {/* Response Status Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2.5">
            {endpoint.responses.map((resp, rIdx) => {
              const is2xx = resp.statusCode >= 200 && resp.statusCode < 300;
              const isSelected = activeTab === rIdx;

              const activeClass = isSelected
                ? is2xx
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200';

              return (
                <button
                  key={rIdx}
                  onClick={() => setActiveTab(rIdx)}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-[13px] font-mono border transition-all cursor-pointer flex items-center space-x-1.5 ${activeClass}`}
                >
                  <span>{resp.statusCode}</span>
                  <span className="text-[11px] opacity-80">{resp.statusText}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Response Detail */}
          {selectedResponse && (
            <div className="space-y-2 pt-1">
              {selectedResponse.description && (
                <p className="text-[13.5px] text-zinc-300">
                  {selectedResponse.description}
                </p>
              )}
              {selectedResponse.exampleJson ? (
                <CodeBlock code={selectedResponse.exampleJson} language="json" />
              ) : (
                <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/60 text-xs sm:text-[13px] font-mono text-zinc-400 italic">
                  Empty response body (HTTP {selectedResponse.statusCode})
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
