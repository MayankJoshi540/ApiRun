import React, { useState } from 'react';
import { APIEndpoint as EndpointType } from '../types';
import { CodeBlock } from './CodeBlock';
import { ChevronDown, ChevronRight } from '@/components/ui/GoogleIcon';

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

  const methodStyles = {
    GET: 'bg-sky-950/60 text-sky-400 border-sky-800/60',
    POST: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    PUT: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    PATCH: 'bg-orange-950/60 text-orange-400 border-orange-800/60',
    DELETE: 'bg-red-950/60 text-red-400 border-red-800/60',
    HEAD: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
    OPTIONS: 'bg-gray-800/60 text-gray-400 border-gray-700/60',
  };

  const currentStyle = methodStyles[endpoint.method] || methodStyles.GET;

  return (
    <div className="rounded-md border border-[#262d3a] bg-[#12161f] mb-4 overflow-hidden font-sans">
      {/* Header */}
      <div 
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center justify-between px-4 py-3 bg-[#171c26] cursor-pointer hover:bg-[#1e2430] transition-colors select-none"
      >
        <div className="flex items-center space-x-3">
          <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded ${currentStyle}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm font-semibold text-[#e6edf3]">
            {endpoint.path}
          </span>
          <span className="hidden sm:inline text-xs text-[#94a3b8] font-normal">
            — {endpoint.summary}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#8b949e]">
          <span className="hidden md:inline font-medium">{endpoint.responses.length} responses</span>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </div>

      {/* Body / Details */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-[#262d3a]">
          {endpoint.description && (
            <p className="text-xs text-[#cbd5e1] leading-relaxed font-normal">
              {endpoint.description}
            </p>
          )}

          {/* Headers */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">HTTP Headers</div>
              <div className="rounded-md border border-[#262d3a] bg-[#090b0e] p-2.5 text-xs font-mono">
                {endpoint.headers.map((h, i) => (
                  <div key={i} className="flex items-center space-x-2 py-0.5">
                    <span className="text-emerald-400 font-semibold">{h.key}:</span>
                    <span className="text-[#e6edf3]">{h.value}</span>
                    {h.description && (
                      <span className="text-xs font-sans text-[#6e7681]">({h.description})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parameters */}
          {endpoint.params && endpoint.params.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Parameters</div>
              <div className="rounded-md border border-[#262d3a] bg-[#090b0e] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#171c26] text-[#8b949e] border-b border-[#262d3a]">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Name</th>
                      <th className="py-2 px-3 font-semibold">Type</th>
                      <th className="py-2 px-3 font-semibold">In</th>
                      <th className="py-2 px-3 font-semibold">Required</th>
                      <th className="py-2 px-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262d3a]">
                    {endpoint.params.map((param, i) => (
                      <tr key={i} className="hover:bg-[#12161f]/50">
                        <td className="py-2 px-3 font-mono text-emerald-400 font-semibold">{param.name}</td>
                        <td className="py-2 px-3 font-mono text-[#cbd5e1]">{param.type}</td>
                        <td className="py-2 px-3 font-mono text-[#8b949e]">{param.in}</td>
                        <td className="py-2 px-3">
                          <span className={param.required ? 'text-red-400 font-semibold' : 'text-[#6e7681]'}>
                            {param.required ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[#cbd5e1] leading-relaxed">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.requestBody && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Request Body (JSON)</div>
                <span className="font-mono text-[11px] text-[#8b949e]">{endpoint.requestBody.contentType}</span>
              </div>
              <CodeBlock code={endpoint.requestBody.exampleJson} language="json" />
            </div>
          )}

          {/* Responses Tabs */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Expected Responses</div>
            <div className="flex flex-wrap gap-1.5 bg-[#090b0e] p-1 rounded-md border border-[#262d3a]">
              {endpoint.responses.map((resp, i) => {
                const isSuccess = resp.statusCode >= 200 && resp.statusCode < 300;
                const isRedirect = resp.statusCode >= 300 && resp.statusCode < 400;
                const isActive = i === activeResponseTab;

                return (
                  <button
                    key={i}
                    onClick={() => setActiveResponseTab(i)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs transition-colors font-medium ${
                      isActive
                        ? 'bg-[#171c26] text-[#e6edf3] border border-[#374151] font-semibold'
                        : 'text-[#8b949e] hover:text-[#e6edf3] border border-transparent'
                    }`}
                  >
                    <span className={`font-mono font-bold ${
                      isSuccess ? 'text-emerald-400' : isRedirect ? 'text-sky-400' : 'text-amber-400'
                    }`}>
                      {resp.statusCode}
                    </span>
                    <span>{resp.statusText}</span>
                  </button>
                );
              })}
            </div>

            {endpoint.responses[activeResponseTab] && (
              <div className="space-y-2">
                <div className="text-xs text-[#cbd5e1] leading-relaxed">
                  {endpoint.responses[activeResponseTab].description}
                </div>
                {endpoint.responses[activeResponseTab].headers && (
                  <div className="rounded-md bg-[#090b0e] border border-[#262d3a] p-2.5 text-xs font-mono">
                    <div className="text-[10px] font-sans font-semibold uppercase text-[#8b949e] mb-1">Headers</div>
                    {Object.entries(endpoint.responses[activeResponseTab].headers || {}).map(([k, v], jidx) => (
                      <div key={jidx} className="space-x-1">
                        <span className="text-sky-400">{k}:</span>
                        <span className="text-[#e6edf3]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {endpoint.responses[activeResponseTab].exampleJson ? (
                  <CodeBlock code={endpoint.responses[activeResponseTab].exampleJson} language="json" />
                ) : (
                  <div className="p-3 rounded-md bg-[#090b0e] border border-[#262d3a] text-xs text-[#8b949e]">
                    &lt;empty response body&gt;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* cURL Example */}
          {endpoint.curlExample && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">cURL Example</div>
              <CodeBlock code={endpoint.curlExample} language="bash" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
