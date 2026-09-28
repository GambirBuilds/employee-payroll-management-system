import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { TerminalView } from './components/TerminalView';
import { CodeExplorer } from './components/CodeExplorer';
import { DatabaseViewer } from './components/DatabaseViewer';
import { ArchitectureView } from './components/ArchitectureView';
import { RubricChecklistView } from './components/RubricChecklistView';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [activeView, setActiveView] = useState<'terminal' | 'code' | 'database' | 'architecture' | 'rubric'>('terminal');
  const [targetCodeFile, setTargetCodeFile] = useState<string>('src/main/java/com/payroll/model/Employee.java');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleNavigateToCode = (filePath: string) => {
    // If only filename was provided (e.g. Employee.java), match against known files
    if (!filePath.includes('/')) {
      const match = [
        'src/main/java/com/payroll/model/',
        'src/main/java/com/payroll/dao/',
        'src/main/java/com/payroll/service/',
        'src/main/java/com/payroll/exception/',
        'src/main/java/com/payroll/util/',
        'src/main/java/com/payroll/ui/',
        'src/main/java/com/payroll/',
        '',
      ];
      for (const prefix of match) {
        if (filePath.endsWith('.xml') || filePath.endsWith('.sql') || filePath.endsWith('.md')) {
          setTargetCodeFile(filePath);
          break;
        }
      }
      setTargetCodeFile(filePath);
    } else {
      setTargetCodeFile(filePath);
    }
    setActiveView('code');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Strict 3-zone Top Bar Contract */}
      <TopBar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenExport={() => setExportModalOpen(true)}
      />

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden items-center justify-around bg-slate-900 border-b border-slate-800 text-[11px] font-mono py-1.5 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveView('terminal')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeView === 'terminal' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Terminal
        </button>
        <button
          onClick={() => setActiveView('code')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeView === 'code' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Java Code
        </button>
        <button
          onClick={() => setActiveView('database')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeView === 'database' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Database
        </button>
        <button
          onClick={() => setActiveView('architecture')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeView === 'architecture' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          OOP Architecture
        </button>
        <button
          onClick={() => setActiveView('rubric')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeView === 'rubric' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Rubric
        </button>
      </div>

      {/* Main Workspace Viewport */}
      <main className="flex-1 p-3 md:p-5 overflow-hidden min-h-0">
        {activeView === 'terminal' && (
          <TerminalView onNavigateToCode={handleNavigateToCode} />
        )}

        {activeView === 'code' && (
          <CodeExplorer initialFile={targetCodeFile} />
        )}

        {activeView === 'database' && (
          <DatabaseViewer />
        )}

        {activeView === 'architecture' && (
          <ArchitectureView onSelectFile={handleNavigateToCode} />
        )}

        {activeView === 'rubric' && (
          <RubricChecklistView onNavigateToCode={handleNavigateToCode} />
        )}
      </main>

      {/* Export & ZIP Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
