import React, { useState, useEffect } from 'react';
import { PayrollDatabase } from '../services/payrollDatabase';
import { Database, Play, RefreshCw, Table, FileText, CheckCircle2 } from 'lucide-react';

export const DatabaseViewer: React.FC = () => {
  const db = PayrollDatabase.getInstance();
  const [activeTable, setActiveTable] = useState<'employees' | 'departments' | 'payroll' | 'leaves'>('employees');
  const [queryInput, setQueryInput] = useState('SELECT * FROM employees;');
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: (string | number | boolean | null)[][];
    rowCount: number;
    message: string;
  } | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const runQuery = (sql: string) => {
    try {
      const res = db.executeRawQuery(sql);
      setQueryResult(res);
    } catch (e: any) {
      setQueryResult({
        columns: ['error'],
        rows: [[e.message]],
        rowCount: 0,
        message: 'Query failed with SQLException.',
      });
    }
  };

  useEffect(() => {
    // Run default query on active table change
    let defaultSql = 'SELECT * FROM employees;';
    if (activeTable === 'departments') defaultSql = 'SELECT * FROM departments;';
    if (activeTable === 'payroll') defaultSql = 'SELECT * FROM payroll_records;';
    if (activeTable === 'leaves') defaultSql = 'SELECT * FROM leave_records;';
    setQueryInput(defaultSql);
    runQuery(defaultSql);
  }, [activeTable, refreshKey]);

  const employees = db.getAllEmployees();
  const departments = db.getAllDepartments();
  const payrollRecords = db.getAllPayrollRecords();

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Top Header & Table Tabs */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">SQLite JDBC Inspector</span>
          </div>

          {/* Table Segmented Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTable('employees')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTable === 'employees' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              employees ({employees.length})
            </button>
            <button
              onClick={() => setActiveTable('departments')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTable === 'departments' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              departments ({departments.length})
            </button>
            <button
              onClick={() => setActiveTable('payroll')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTable === 'payroll' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              payroll_records ({payrollRecords.length})
            </button>
            <button
              onClick={() => setActiveTable('leaves')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTable === 'leaves' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              leave_records
            </button>
          </div>
        </div>

        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* SQL Query Bar */}
      <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2">
        <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">SQL &gt;</span>
        <input
          type="text"
          value={queryInput}
          onChange={e => setQueryInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runQuery(queryInput)}
          placeholder="Enter SQL PreparedStatement query..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
        />
        <button
          onClick={() => runQuery(queryInput)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium font-mono flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Play className="w-3.5 h-3.5" />
          Execute
        </button>
      </div>

      {/* Results / Table Canvas */}
      <div className="flex-1 overflow-auto bg-[#070b12] p-4">
        {queryResult && queryResult.rows.length > 0 ? (
          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  {queryResult.columns.map((col, idx) => (
                    <th key={idx} className="px-3.5 py-2.5 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queryResult.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-900/40 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3.5 py-2 text-slate-300 tabular-nums">
                        {cell === null ? (
                          <span className="text-slate-600 italic">NULL</span>
                        ) : typeof cell === 'boolean' ? (
                          cell ? 'TRUE' : 'FALSE'
                        ) : typeof cell === 'number' && queryResult.columns[cellIdx].includes('salary') ? (
                          `$${cell.toLocaleString()}`
                        ) : typeof cell === 'number' && queryResult.columns[cellIdx].includes('pay') ? (
                          `$${cell.toLocaleString()}`
                        ) : (
                          String(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-2">
            <Table className="w-8 h-8 text-slate-600" />
            <span>No records returned from query or table is empty.</span>
          </div>
        )}
      </div>

      {/* Query Status Bar */}
      <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {queryResult?.message || 'Ready'}
        </span>
        <span>Driver: org.sqlite.JDBC · Database: payroll_system.db</span>
      </div>
    </div>
  );
};
