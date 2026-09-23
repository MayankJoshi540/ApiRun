import React, { useState } from 'react';
import { APIEndpoint as EndpointType } from '../types';
import { CodeBlock } from './CodeBlock';
import { ChevronDown, ChevronRight, Copy, Check } from '@/components/ui/GoogleIcon';

interface Props {
  endpoint: EndpointType;
  initiallyExpanded?: boolean;
}

export const APIEndpoint: React.FC<Props> = ({
  endpoint,
  initiallyExpanded = true
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [activeResponseTab, setActiveResponseTab] = useState(0);
  const [copiedPath, setCopiedPath] = useState(false);

  const methodStyles: Record<string, { badge: string; border: string }> = {
    GET: {
      badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      border: 'hover:border-sky-500/40'
    },
    POST: {
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      border: 'hover:border-emerald-500/40'
    },
    PUT: {
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      border: 'hover:border-amber-500/40'
    },
    PATCH: {
      badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      border: 'hover:border-orange-500/40'
    },
    DELETE: {
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      border: 'hover:border-rose-500/40'
    },
    HEAD: {
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      border: 'hover:border-purple-500/40'
    },
    OPTIONS: {
      badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
      border: 'hover:border-gray-500/40'
    },
  };

  const currentStyle = methodStyles[endpoint.method] || methodStyles.GET;

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(endpoint.path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <div className={`rounded-xl border border-white/[0.08] bg-[#090d14] overflow-hidden transition-all ${currentStyle.border}`}>
      {/* Header */}
      <div 
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#0e1420]/80 cursor-pointer hover:bg-[#131b2b] transition-colors select-none"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${currentStyle.badge}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-[14.5px] sm:text-base font-semibold text-white truncate">
            {endpoint.path}
          </span>
          {endpoint.summary && (
            <span className="hidden md:inline text-xs sm:text-sm text-[#94a3b8] font-normal truncate">
              — {endpoint.summary}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#94a3b8] shrink-0">
          <button
            onClick={handleCopyPath}
            className="p-1 rounded hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-colors"
            title="Copy endpoint path"
          >
            {copiedPath ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <span className="hidden sm:inline font-mono font-medium text-[11px] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            {endpoint.responses.length} responses
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
        </div>
      </div>

      {/* Body / Details */}
      {expanded && (
        <div className="p-4 sm:p-5 space-y-5 border-t border-white/[0.08] bg-[#070a10]">
          {endpoint.description && (
            <p className="text-sm sm:text-[14.5px] text-[#cbd5e1] leading-relaxed font-normal">
              {endpoint.description}
            </p>
          )}

          {/* Headers */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                Required HTTP Headers
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-[#0c1017] p-3 text-xs sm:text-sm font-mono space-y-1.5">
                {endpoint.headers.map((h, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <span className="text-emerald-400 font-semibold">{h.key}:</span>
                    <span className="text-[#f1f5f9] bg-white/[0.04] px-2 py-0.5 rounded">{h.value}</span>
                    {h.description && (
                      <span className="text-xs font-sans text-[#94a3b8]">({h.description})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parameters */}
          {endpoint.params && endpoint.params.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                Request Parameters
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-[#0c1017] overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-white/[0.02] text-[#94a3b8] border-b border-white/[0.06] font-mono text-xs">
                    <tr>
                      <th className="py-2.5 px-3.5 font-semibold">Parameter</th>
                      <th className="py-2.5 px-3.5 font-semibold">Type</th>
                      <th className="py-2.5 px-3.5 font-semibold">Location</th>
                      <th className="py-2.5 px-3.5 font-semibold">Required</th>
                      <th className="py-2.5 px-3.5 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {endpoint.params.map((param, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3.5 font-mono text-emerald-400 font-semibold">{param.name}</td>
                        <td className="py-2.5 px-3.5 font-mono text-[#94a3b8]">{param.type}</td>
                        <td className="py-2.5 px-3.5 font-mono text-[#cbd5e1]">{param.in}</td>
                        <td className="py-2.5 px-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            param.required ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-white/[0.04] text-[#64748b]'
                          }`}>
                            {param.required ? 'REQUIRED' : 'OPTIONAL'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-[#cbd5e1] leading-relaxed">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.requestBody && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                  Request Body
                </div>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {endpoint.requestBody.contentType}
                </span>
              </div>
              <CodeBlock code={endpoint.requestBody.exampleJson} language="json" />
            </div>
          )}

          {/* Responses Tabs */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
              Expected HTTP Responses
            </div>
            <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#0c1017] border border-white/[0.08]">
              {endpoint.responses.map((resp, i) => {
                const isSuccess = resp.statusCode >= 200 && resp.statusCode < 300;
                const isRedirect = resp.statusCode >= 300 && resp.statusCode < 400;
                const isActive = i === activeResponseTab;

                const statusColor = isSuccess
                  ? 'text-emerald-400'
                  : isRedirect
                  ? 'text-sky-400'
                  : 'text-amber-400';

                return (
                  <button
                    key={i}
                    onClick={() => setActiveResponseTab(i)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all font-medium ${
                      isActive
                        ? 'bg-white/[0.1] text-white border border-white/[0.15] font-semibold shadow-sm'
                        : 'text-[#94a3b8] hover:text-white border border-transparent'
                    }`}
                  >
                    <span className={`font-mono font-bold ${statusColor}`}>
                      {resp.statusCode}
                    </span>
                    <span>{resp.statusText}</span>
                  </button>
                );
              })}
            </div>

            {endpoint.responses[activeResponseTab] && (
              <div className="space-y-2.5 pt-1">
                {endpoint.responses[activeResponseTab].description && (
                  <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {endpoint.responses[activeResponseTab].description}
                  </div>
                )}
                {endpoint.responses[activeResponseTab].headers && (
                  <div className="rounded-xl bg-[#0c1017] border border-white/[0.08] p-3 text-xs sm:text-sm font-mono space-y-1">
                    <div className="text-xs font-sans font-semibold uppercase text-[#94a3b8] mb-1">Response Headers</div>
                    {Object.entries(endpoint.responses[activeResponseTab].headers || {}).map(([k, v], jidx) => (
                      <div key={jidx} className="flex items-center space-x-2">
                        <span className="text-sky-400 font-semibold">{k}:</span>
                        <span className="text-[#f1f5f9]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {endpoint.responses[activeResponseTab].exampleJson ? (
                  <CodeBlock code={endpoint.responses[activeResponseTab].exampleJson} language="json" />
                ) : (
                  <div className="p-3 rounded-xl bg-[#0c1017] border border-white/[0.08] text-xs sm:text-sm text-[#94a3b8] font-mono">
                    &lt;empty response body&gt;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* cURL Example */}
          {endpoint.curlExample && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                Quick Test cURL Snippet
              </div>
              <CodeBlock code={endpoint.curlExample} language="bash" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
