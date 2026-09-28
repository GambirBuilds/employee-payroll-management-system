import React from 'react';
import { Download, Terminal } from 'lucide-react';

interface TopBarProps {
  activeView: 'terminal' | 'code' | 'database' | 'architecture' | 'rubric';
  setActiveView: (view: 'terminal' | 'code' | 'database' | 'architecture' | 'rubric') => void;
  onOpenExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeView, setActiveView, onOpenExport }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
        Enterprise Payroll Engine
      </span>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveView('terminal')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'terminal' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-2' : 'hover:text-slate-200'
          }`}
        >
          Live Terminal
        </button>
        <button
          onClick={() => setActiveView('code')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'code' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-2' : 'hover:text-slate-200'
          }`}
        >
          Java Codebase
        </button>
        <button
          onClick={() => setActiveView('database')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'database' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-2' : 'hover:text-slate-200'
          }`}
        >
          Database Tables
        </button>
        <button
          onClick={() => setActiveView('architecture')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'architecture' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-2' : 'hover:text-slate-200'
          }`}
        >
          OOP Architecture
        </button>
        <button
          onClick={() => setActiveView('rubric')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'rubric' ? 'text-emerald-400 font-semibold underline underline-offset-8 decoration-2' : 'hover:text-slate-200'
          }`}
        >
          Rubric Checklist
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenExport}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Project (.ZIP)
        </button>
      </div>
    </header>
  );
};
