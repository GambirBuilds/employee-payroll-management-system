import React, { useState } from 'react';
import { Download, Copy, Check, X, GitCommit, Terminal, FolderArchive, ShieldCheck } from 'lucide-react';
import { generateProjectZip, triggerDownload } from '../services/zipExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECOMMENDED_GIT_COMMITS = [
  'commit 1: chore: initial project scaffolding with pom.xml and directory structure',
  'commit 2: feat(model): create Payable interface and abstract Employee base class',
  'commit 3: feat(model): implement FullTimeEmployee, PartTimeEmployee, and ContractorEmployee',
  'commit 4: feat(db): create schema.sql and DatabaseConnection singleton for SQLite JDBC',
  'commit 5: feat(dao): implement EmployeeDAO with PreparedStatement and try-with-resources',
  'commit 6: feat(service): add EmployeeService with HashMap cache and Comparator sorting',
  'commit 7: feat(service): implement PayrollService with progressive tax and payslip formatting',
  'commit 8: feat(exceptions): create custom domain exceptions (EmployeeNotFound, DuplicateEmployee)',
  'commit 9: feat(cli): build interactive Scanner ConsoleMenu with InputValidator',
  'commit 10: docs: add comprehensive README.md with setup instructions and terminal transcripts',
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [copiedCommits, setCopiedCommits] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const blob = await generateProjectZip();
      triggerDownload(blob, 'java-employee-payroll-system.zip');
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setDownloading(false);
    }
  };

  const copyCommands = () => {
    const text = `# Step 1: Unzip project\nunzip java-employee-payroll-system.zip\ncd java-employee-payroll-system\n\n# Step 2: Compile with Maven\nmvn clean compile\n\n# Step 3: Run the terminal application\nmvn exec:java`;
    navigator.clipboard.writeText(text);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const copyGitCommits = () => {
    navigator.clipboard.writeText(RECOMMENDED_GIT_COMMITS.join('\n'));
    setCopiedCommits(true);
    setTimeout(() => setCopiedCommits(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-slate-100">Export Complete Java Course Project</h2>
            </div>
            <p className="text-xs text-slate-400">
              Download the fully functional, standalone Maven project ready for IntelliJ IDEA, Eclipse, VS Code, or terminal compilation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Download Action Box */}
        <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-emerald-300">Ready to Download: java-employee-payroll-system.zip</div>
            <div className="text-xs text-slate-400">
              Includes 18 Java source files, pom.xml, schema.sql, db.properties, .gitignore, and the required README.md.
            </div>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs font-mono flex items-center gap-2 transition-colors shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Building ZIP...' : 'Download .ZIP'}
          </button>
        </div>

        {/* Compile & Run Instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              Execution Commands
            </span>
            <button
              onClick={copyCommands}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono transition-colors"
            >
              {copiedCommands ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedCommands ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 overflow-x-auto">
{`# 1. Compile project with Maven
mvn clean compile

# 2. Run Main console application
mvn exec:java`}
          </pre>
        </div>

        {/* Section 5 Submission: Recommended Commit History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Recommended Git Commits (Section 5 Requirement)
              </span>
            </div>
            <button
              onClick={copyGitCommits}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono transition-colors"
            >
              {copiedCommits ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedCommits ? 'Copied' : 'Copy Commit Messages'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Section 5 requires a minimum of 8–10 incremental commits. Use these commit messages when pushing your repository to GitHub:
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-400 max-h-36 overflow-y-auto space-y-1">
            {RECOMMENDED_GIT_COMMITS.map((msg, i) => (
              <div key={i} className="truncate">
                <span className="text-slate-600 mr-2">{i + 1}.</span>
                <span className="text-slate-300">{msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
