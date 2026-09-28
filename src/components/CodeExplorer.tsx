import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, JavaSourceFile } from '../data/javaSourceFiles';
import { FileCode, Folder, Copy, Check, Search, Download, Award, Layers, ShieldCheck } from 'lucide-react';

export const CodeExplorer: React.FC<{ initialFile?: string }> = ({ initialFile }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    initialFile || 'src/main/java/com/payroll/model/Employee.java'
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedFile = JAVA_PROJECT_FILES.find(f => f.path === selectedFilePath) || JAVA_PROJECT_FILES[0];

  const filteredFiles = JAVA_PROJECT_FILES.filter(f => {
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    const matchesQuery = searchQuery === '' || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.rubricCriterion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'model': return 'text-sky-400 border-sky-800/60 bg-sky-950/40';
      case 'dao': return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
      case 'service': return 'text-purple-400 border-purple-800/60 bg-purple-950/40';
      case 'exception': return 'text-rose-400 border-rose-800/60 bg-rose-950/40';
      case 'config': return 'text-amber-400 border-amber-800/60 bg-amber-950/40';
      case 'ui': return 'text-teal-400 border-teal-800/60 bg-teal-950/40';
      default: return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div className="flex h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Left Sidebar: File Tree & Navigation */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/70 flex flex-col shrink-0">
        {/* Search & Filter Header */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Project Tree</span>
            <span className="text-[11px] text-slate-500 ml-auto font-mono">{filteredFiles.length} files</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search classes, DAOs, schema..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 pl-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] pt-1">
            {['all', 'model', 'dao', 'service', 'exception', 'config'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs">
          {filteredFiles.map(file => {
            const isSelected = file.path === selectedFilePath;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`w-full text-left px-2.5 py-2 rounded flex items-start gap-2 transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate font-medium text-slate-200">{file.name}</span>
                    <span className={`text-[9px] uppercase px-1 py-0.2 rounded border shrink-0 ${getCategoryColor(file.category)}`}>
                      {file.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-sans mt-0.5">
                    {file.path}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Code View Area */}
      <div className="flex-1 flex flex-col bg-slate-950 min-w-0 overflow-hidden">
        {/* Top File Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-medium text-slate-200">{selectedFile.name}</span>
              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${getCategoryColor(selectedFile.category)}`}>
                {selectedFile.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {selectedFile.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownloadSingle}
              title="Download this file"
              className="px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Rubric Criterion Callout Banner */}
        <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 text-xs">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400">Course Rubric Criterion:</span>
          <span className="text-amber-300 font-mono text-[11px] font-medium">{selectedFile.rubricCriterion}</span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex-1 overflow-auto bg-[#070b12] p-4 font-mono text-xs text-slate-200 leading-relaxed select-text flex">
          {/* Line Numbers Column */}
          <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 shrink-0 font-mono text-[11px]">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Actual Code Column */}
          <pre className="pl-4 flex-1 overflow-x-auto whitespace-pre font-mono">
            {selectedFile.content}
          </pre>
        </div>

        {/* File Footer Stats */}
        <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Path: {selectedFile.path}</span>
          <span>{lines.length} lines · UTF-8</span>
        </div>
      </div>
    </div>
  );
};
