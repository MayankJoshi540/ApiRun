import React from 'react';

export const EndpointCard: React.FC = () => {
  const endpoints = [
    { method: 'GET', path: '/api/tasks', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
    { method: 'POST', path: '/api/tasks', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
    { method: 'PUT', path: '/api/tasks/:id', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { method: 'DELETE', path: '/api/tasks/:id', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' }
  ];

  return (
    <div className="relative group animate-card-float-4 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Clean Technical Card Container */}
      <div className="relative w-[220px] 2xl:w-[250px] rounded-2xl bg-[#080d14] border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-xl text-left select-none">
        <div className="space-y-2 font-mono text-[10px] sm:text-[11px]">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="flex items-center space-x-2.5">
              <span className={`w-12 text-center px-1 py-0.5 rounded font-bold border ${ep.color}`}>
                {ep.method}
              </span>
              <span className="text-[#94a3b8] font-medium tracking-tight">
                {ep.path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
