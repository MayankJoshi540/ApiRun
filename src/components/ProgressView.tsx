import React from 'react';
import { Challenge, UserStats } from '../types';
import { ProgressIndicator } from './ProgressIndicator';
import { CheckCircle2, Terminal, ArrowRight, Award, Shield } from 'lucide-react';

interface Props {
  userStats: UserStats;
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
}

export const ProgressView: React.FC<Props> = ({
  userStats,
  challenges,
  onSelectChallenge
}) => {
  const solvedChallenges = challenges.filter(c => c.status === 'SOLVED');
  const inProgressChallenges = challenges.filter(c => c.status === 'IN_PROGRESS');

  const concepts = [
    'HTTP', 'REST', 'Validation', 'Database', 'Redis',
    'Middleware', 'Concurrency', 'Auth', 'Idempotency', 'Webhooks', 'Queues'
  ];

  const conceptStats = concepts.map(concept => {
    const total = challenges.filter(c => c.concepts.includes(concept as any)).length;
    const passed = solvedChallenges.filter(c => c.concepts.includes(concept as any)).length;
    return { concept, total, passed };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      {/* Top Profile Header */}
      <div className="p-6 rounded bg-[#12161f] border border-[#262d3a]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#171c26] border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl">
              AR
            </div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>LEVEL 2 BACKEND ENGINEER</span>
              </div>
              <h1 className="text-xl font-bold text-[#e6edf3] font-sans">
                Developer Profile
              </h1>
              <p className="text-xs text-[#8b949e]">
                Verified API contract tester telemetry & performance benchmarks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-[#090b0e] border border-[#262d3a] rounded">
              <div className="text-[10px] text-[#8b949e]">CHALLENGES SOLVED</div>
              <div className="text-lg font-bold text-emerald-400">
                {userStats.challengesSolved} <span className="text-xs text-[#8b949e]">/ {challenges.length}</span>
              </div>
            </div>

            <div className="p-3 bg-[#090b0e] border border-[#262d3a] rounded">
              <div className="text-[10px] text-[#8b949e]">TESTS PASSED</div>
              <div className="text-lg font-bold text-[#e6edf3]">
                {userStats.totalTestsPassed}
              </div>
            </div>

            <div className="p-3 bg-[#090b0e] border border-[#262d3a] rounded">
              <div className="text-[10px] text-[#8b949e]">AVG LATENCY</div>
              <div className="text-lg font-bold text-[#e6edf3]">
                {userStats.averageLatencyMs}ms
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Mastery Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-[#e6edf3] uppercase tracking-wider">
            Backend Concept Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {conceptStats.map(({ concept, total, passed }) => (
            <div key={concept} className="p-4 rounded bg-[#12161f] border border-[#262d3a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#e6edf3]">{concept}</span>
                <span className="text-[#8b949e]">
                  {passed} / {total} solved
                </span>
              </div>
              <ProgressIndicator passed={passed} total={total || 1} showLabel={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Status Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-[#e6edf3] uppercase tracking-wider">
            Challenge History
          </h2>
        </div>

        <div className="bg-[#12161f] border border-[#262d3a] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090b0e] border-b border-[#262d3a] text-[#8b949e]">
                <tr>
                  <th className="p-3">Challenge</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262d3a]">
                {challenges.map(c => {
                  const isSolved = c.status === 'SOLVED';
                  const isInProgress = c.status === 'IN_PROGRESS';
                  return (
                    <tr key={c.id} className="hover:bg-[#171c26]/50 transition-colors">
                      <td className="p-3 font-semibold text-[#e6edf3]">{c.title}</td>
                      <td className="p-3 text-[#8b949e]">{c.category}</td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          c.difficulty === 'BEGINNER' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' :
                          c.difficulty === 'INTERMEDIATE' ? 'text-sky-400 bg-sky-950/40 border-sky-800/40' :
                          'text-amber-400 bg-amber-950/40 border-amber-800/40'
                        }`}>
                          {c.difficulty}
                        </span>
                      </td>
                      <td className="p-3">
                        {isSolved ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Solved</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="text-amber-400">In Progress</span>
                        ) : (
                          <span className="text-[#6e7681]">Unsolved</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectChallenge(c)}
                          className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};