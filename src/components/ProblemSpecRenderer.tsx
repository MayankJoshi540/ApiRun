import React from 'react';
import { Challenge } from '../types';
import { APIEndpoint } from './APIEndpoint';
import { CodeBlock } from './CodeBlock';

interface Props {
  challenge: Challenge;
}

/**
 * Formats inline code, methods, bold text, and HTTP status codes cleanly without any SVGs or gradients.
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
          method === 'GET' ? 'bg-[#0e2538] text-[#38bdf8] border-[#1e4466]' :
          method === 'POST' ? 'bg-[#0d2a1f] text-[#34d399] border-[#18533b]' :
          method === 'PUT' ? 'bg-[#2d210b] text-[#fbbf24] border-[#574015]' :
          method === 'DELETE' ? 'bg-[#2d1216] text-[#fb7185] border-[#59232c]' :
          'bg-[#231533] text-[#c084fc] border-[#472a66]';

        parts.push(
          <span
            key={`route-${match.index}`}
            className="inline-flex items-center space-x-2 px-2 py-0.5 my-0.5 rounded font-mono text-[13.5px] border bg-[#0b0e14] align-baseline font-medium"
          >
            <span className={`px-1.5 py-0.2 rounded text-[11px] font-bold border ${methodColor}`}>{method}</span>
            <span className="text-[#f8fafc] font-semibold">{path}</span>
          </span>
        );
      } else {
        parts.push(
          <code
            key={`c-${match.index}`}
            className="px-2 py-0.5 mx-0.5 rounded bg-[#131b26] text-[#38bdf8] font-mono text-[13.5px] border border-[#23354c] inline-block align-baseline font-medium"
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
      parts.push(<span key={`d-${match.index}`} className="text-[#64748b] mx-1.5">—</span>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(renderTextWithStatusBadges(text.substring(lastIndex), `t-${lastIndex}`));
  }

  return parts;
}

function renderTextWithStatusBadges(text: string, prefix: string): React.ReactNode {
  const statusRegex = /\b(200 OK|201 Created|204 No Content|400 Bad Request|401 Unauthorized|403 Forbidden|404 Not Found|422 Unprocessable Entity|429 Too Many Requests|500 Internal Server Error)\b/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = statusRegex.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.substring(last, m.index));
    }
    const s = m[0];
    const is2xx = s.startsWith('2');
    const is4xx = s.startsWith('4');
    const color = is2xx
      ? 'bg-[#0d2a1f] text-[#34d399] border-[#18533b]'
      : is4xx
      ? 'bg-[#2d210b] text-[#fbbf24] border-[#574015]'
      : 'bg-[#2d1216] text-[#fb7185] border-[#59232c]';

    nodes.push(
      <span
        key={`${prefix}-${m.index}`}
        className={`inline-flex items-center font-mono text-[12px] font-bold px-2 py-0.5 rounded border mx-1 ${color}`}
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
    <div className="space-y-6 text-[#f8fafc] font-sans">
      {/* 1. Clear Goal Overview Box (No gradient, No SVG) */}
      <div className="rounded-xl border border-white/[0.12] bg-[#0c1017] p-5 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#34d399] bg-[#0d2a1f] border border-[#18533b] px-2 py-0.5 rounded">
            TASK OBJECTIVE
          </span>
          <span className="text-xs text-[#94a3b8] font-mono">
            Category: <span className="text-[#f1f5f9] font-medium">{challenge.category}</span>
          </span>
        </div>
        <p className="text-[16px] font-semibold text-white leading-relaxed">
          {challenge.summary}
        </p>
      </div>

      {/* 2. Structured Problem Statement & Behavior */}
      <div className="rounded-xl border border-white/[0.12] bg-[#0c1017] p-5 sm:p-6 space-y-4">
        <div className="pb-3 border-b border-white/[0.08]">
          <h3 className="text-base font-bold text-white tracking-tight">
            Problem Description
          </h3>
        </div>

        {/* Clean Paragraphs & Lists */}
        <div className="space-y-3.5 text-[15.5px] text-[#cbd5e1] leading-relaxed">
          {challenge.problemStatement.split(/\n\n+/).map((para, pIdx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            const lines = trimmed.split('\n');
            const isList = lines.every(l => /^\s*(\d+\.|\-|\*)\s+/.test(l));

            if (isList) {
              return (
                <div key={pIdx} className="space-y-2 my-3">
                  {lines.map((line, lIdx) => {
                    const match = line.match(/^\s*(\d+\.|\-|\*)\s+(.*)$/);
                    if (!match) return <div key={lIdx}>{formatInline(line)}</div>;

                    const bullet = match[1];
                    const content = match[2];
                    const isNum = /^\d+\./.test(bullet);

                    return (
                      <div
                        key={lIdx}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-[#070a0f] border border-white/[0.06]"
                      >
                        {isNum ? (
                          <span className="shrink-0 w-5 h-5 rounded bg-[#131b26] border border-[#23354c] text-[#38bdf8] text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                            {bullet.replace('.', '')}
                          </span>
                        ) : (
                          <span className="shrink-0 text-[#34d399] font-mono font-bold mt-0.5">•</span>
                        )}
                        <div className="text-[15px] text-[#e2e8f0] leading-relaxed flex-1">
                          {formatInline(content)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <p key={pIdx} className="text-[15.5px] text-[#cbd5e1] leading-relaxed">
                {formatInline(trimmed)}
              </p>
            );
          })}
        </div>
      </div>

      {/* 3. Clean Input / Output Examples */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-xs font-mono font-bold text-[#94a3b8] tracking-wider uppercase">
            Input &amp; Output Examples
          </h3>
        </div>

        <div className="space-y-3">
          {challenge.endpoints.map((ep, idx) => {
            const successResp = ep.responses.find(r => r.statusCode >= 200 && r.statusCode < 300) || ep.responses[0];
            const errorResp = ep.responses.find(r => r.statusCode >= 400);

            return (
              <div
                key={ep.id || idx}
                className="rounded-xl border border-white/[0.12] bg-[#0c1017] p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#131b26] border border-[#23354c] text-[#38bdf8]">
                      Example {idx + 1}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {ep.method} {ep.path}
                    </span>
                  </div>
                  {ep.summary && (
                    <span className="text-xs text-[#94a3b8] hidden sm:inline">
                      {ep.summary}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Request */}
                  <div className="rounded-lg border border-white/[0.06] bg-[#070a0f] p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                      Request
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-white space-x-2">
                      <span className="text-[#38bdf8] font-bold">{ep.method}</span>
                      <span>{ep.path}</span>
                    </div>
                    {ep.requestBody?.exampleJson && (
                      <div className="pt-1">
                        <div className="text-[11px] font-mono text-[#64748b] mb-1">Body:</div>
                        <CodeBlock code={ep.requestBody.exampleJson} language="json" />
                      </div>
                    )}
                  </div>

                  {/* Response */}
                  <div className="rounded-lg border border-white/[0.06] bg-[#070a0f] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                        Expected Response
                      </div>
                      {successResp && (
                        <span className="text-[11px] font-mono font-bold text-[#34d399] bg-[#0d2a1f] border border-[#18533b] px-2 py-0.5 rounded">
                          HTTP {successResp.statusCode} {successResp.statusText}
                        </span>
                      )}
                    </div>
                    {successResp?.exampleJson && (
                      <div className="pt-1">
                        <CodeBlock code={successResp.exampleJson} language="json" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Validation / Error Case */}
                {errorResp && (
                  <div className="rounded-lg border border-[#574015] bg-[#1a140a] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#fbbf24] uppercase tracking-wider">
                        Validation Error Case
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#fbbf24] bg-[#2d210b] border border-[#574015] px-2 py-0.5 rounded">
                        HTTP {errorResp.statusCode} {errorResp.statusText}
                      </span>
                    </div>
                    {errorResp.description && (
                      <p className="text-xs sm:text-sm text-[#cbd5e1]">{errorResp.description}</p>
                    )}
                    {errorResp.exampleJson && (
                      <CodeBlock code={errorResp.exampleJson} language="json" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Constraints & Rules (Clean solid layout) */}
      <div className="rounded-xl border border-white/[0.12] bg-[#0c1017] p-5 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
          System Constraints &amp; Rules
        </div>
        <div className="space-y-2">
          {challenge.constraints.map((c, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 rounded-lg bg-[#070a0f] border border-white/[0.06] text-sm text-[#f1f5f9]"
            >
              <span className="text-[#34d399] font-mono font-bold">•</span>
              <span className="font-medium">{formatInline(c)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Complete Endpoints Spec */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-xs font-mono font-bold text-[#94a3b8] tracking-wider uppercase">
            API Endpoints Specification ({challenge.endpoints.length})
          </h3>
        </div>

        <div className="space-y-3">
          {challenge.endpoints.map(ep => (
            <APIEndpoint key={ep.id} endpoint={ep} initiallyExpanded={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
