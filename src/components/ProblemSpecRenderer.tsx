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
          method === 'GET' ? 'bg-[#0a84ff]/15 text-[#64d2ff] border-[#0a84ff]/30' :
          method === 'POST' ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30' :
          method === 'PUT' ? 'bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/30' :
          method === 'DELETE' ? 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/30' :
          'bg-[#bf5af2]/15 text-[#bf5af2] border-[#bf5af2]/30';

        parts.push(
          <span
            key={`route-${match.index}`}
            className="inline-flex items-center space-x-2 px-2 py-0.5 my-0.5 rounded-md font-mono text-[13px] border border-white/[0.08] bg-white/[0.04] align-baseline font-medium"
          >
            <span className={`px-1.5 py-0.2 rounded text-[11px] font-bold border ${methodColor}`}>{method}</span>
            <span className="text-[#f5f5f7] font-semibold">{path}</span>
          </span>
        );
      } else {
        parts.push(
          <code
            key={`c-${match.index}`}
            className="px-2 py-0.5 mx-0.5 rounded-md bg-white/[0.08] text-[#64d2ff] font-mono text-[13px] border border-white/[0.08] inline-block align-baseline font-medium"
          >
            {inner}
          </code>
        );
      }
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`} className="text-white font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token === '&mdash;') {
      parts.push(<span key={`d-${match.index}`} className="text-[#86868b] mx-1.5">—</span>);
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
      ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30'
      : is4xx
      ? 'bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/30'
      : 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/30';

    nodes.push(
      <span
        key={`${prefix}-${m.index}`}
        className={`inline-flex items-center font-mono text-[12px] font-bold px-2 py-0.5 rounded-md border mx-1 ${color}`}
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
    <div className="space-y-6 text-[#f5f5f7] font-sans">

      {/* 2. Structured Problem Statement & Behavior */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Problem Description
          </h3>
        </div>

        {/* Clean Paragraphs & Lists */}
        <div className="space-y-3.5 text-[15px] text-[#d1d1d6] leading-relaxed">
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
                        className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                      >
                        {isNum ? (
                          <span className="shrink-0 w-5 h-5 rounded-md bg-white/[0.08] border border-white/[0.1] text-[#64d2ff] text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                            {bullet.replace('.', '')}
                          </span>
                        ) : (
                          <span className="shrink-0 text-[#30d158] font-mono font-bold mt-0.5">•</span>
                        )}
                        <div className="text-[14.5px] text-[#f5f5f7] leading-relaxed flex-1">
                          {formatInline(content)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <p key={pIdx} className="text-[15px] text-[#d1d1d6] leading-relaxed">
                {formatInline(trimmed)}
              </p>
            );
          })}
        </div>
      </div>

      {/* 3. Clean Input / Output Examples */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-xs font-mono font-semibold text-[#86868b] tracking-wider uppercase">
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
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.1] text-[#64d2ff]">
                      Example {idx + 1}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {ep.method} {ep.path}
                    </span>
                  </div>
                  {ep.summary && (
                    <span className="text-xs text-[#86868b] hidden sm:inline">
                      {ep.summary}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Request */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#86868b]">
                      Request
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-white space-x-2">
                      <span className="text-[#64d2ff] font-bold">{ep.method}</span>
                      <span>{ep.path}</span>
                    </div>
                    {ep.requestBody?.exampleJson && (
                      <div className="pt-1">
                        <div className="text-[11px] font-mono text-[#86868b] mb-1">Body:</div>
                        <CodeBlock code={ep.requestBody.exampleJson} language="json" />
                      </div>
                    )}
                  </div>

                  {/* Response */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-white/[0.06]">
                      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#86868b]">
                        Expected Response
                      </div>
                      {successResp && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-[#30d158] bg-[#30d158]/15 border border-[#30d158]/30 shrink-0 shadow-sm">
                          <span>HTTP {successResp.statusCode}</span>
                          <span className="text-[#30d158]/80 font-sans font-medium text-[10.5px]">{successResp.statusText}</span>
                        </div>
                      )}
                    </div>
                    {successResp?.exampleJson && (
                      <div className="pt-0.5">
                        <CodeBlock code={successResp.exampleJson} language="json" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Validation / Error Case */}
                {errorResp && (
                  <div className="rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/5 p-3.5 space-y-2.5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[#ffd60a]/20">
                      <span className="text-[11px] font-mono font-bold text-[#ffd60a] uppercase tracking-wider">
                        Validation Error Case
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-[#ffd60a] bg-[#ffd60a]/15 border border-[#ffd60a]/30 shrink-0 shadow-sm">
                        <span>HTTP {errorResp.statusCode}</span>
                        <span className="text-[#ffd60a]/80 font-sans font-medium text-[10.5px]">{errorResp.statusText}</span>
                      </span>
                    </div>
                    {errorResp.description && (
                      <p className="text-xs sm:text-sm text-[#d1d1d6]">{errorResp.description}</p>
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

      {/* 4. Constraints & Rules */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3 shadow-sm">
        <div className="text-xs font-mono uppercase tracking-wider text-[#86868b] font-semibold">
          System Constraints &amp; Rules
        </div>
        <div className="space-y-2">
          {challenge.constraints.map((c, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-[#f5f5f7]"
            >
              <span className="text-[#30d158] font-mono font-bold">•</span>
              <span className="font-medium">{formatInline(c)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Complete Endpoints Spec */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-xs font-mono font-semibold text-[#86868b] tracking-wider uppercase">
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
