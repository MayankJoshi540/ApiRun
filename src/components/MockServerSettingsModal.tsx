import React, { useState } from 'react';
import { X, Server, Check, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serverUrl: string;
  onChangeServerUrl: (url: string) => void;
}

export const MockServerSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  serverUrl,
  onChangeServerUrl
}) => {
  const [urlInput, setUrlInput] = useState(serverUrl);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeServerUrl(urlInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
      <div className="w-full max-w-md bg-[#0d0f14] border border-[#262d3a] rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-[#090b0e] border-b border-[#262d3a]">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-[#e6edf3]">Target Backend Server</span>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#e6edf3] p-1 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8b949e] block">
              Local or Remote HTTP Base URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="http://localhost:8000"
              className="w-full bg-[#12161f] border border-[#262d3a] rounded-md px-3 py-2 text-xs text-[#e6edf3] focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="p-3 rounded-md bg-[#12161f] border border-[#262d3a] flex items-start space-x-2.5 text-xs text-[#8b949e]">
            <Info className="w-4 h-4 text-sky-400 flex-no-shrink mt-0.5" />
            <span className="leading-relaxed">
              Direct test assertion requests to your active backend server (e.g. <code className="font-mono text-[#c9d1d9]">http://localhost:8000</code>).
            </span>
          </div>

          <div className="flex justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md bg-[#12161f] border border-[#262d3a] text-xs font-medium text-[#8b949e] hover:text-[#e6edf3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Target</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};