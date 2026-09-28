import React, { useState } from 'react';
import { Layers, ShieldCheck, Box, GitBranch, ArrowDown, Database, Cpu, FileCode, CheckCircle2 } from 'lucide-react';

export const ArchitectureView: React.FC<{ onSelectFile: (path: string) => void }> = ({ onSelectFile }) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'collections' | 'jdbc' | 'exceptions'>('hierarchy');

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Top Header & Navigation */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">OOP Architecture & Design Patterns</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'hierarchy' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OOP Class Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'collections' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Collections Framework
          </button>
          <button
            onClick={() => setActiveTab('jdbc')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'jdbc' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JDBC & DAO Pattern
          </button>
          <button
            onClick={() => setActiveTab('exceptions')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'exceptions' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exception Hierarchy
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'hierarchy' && (
          <div className="space-y-6">
            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Object-Oriented Design (OOP) Principles Implementation</h3>
              <p className="text-xs text-slate-400">
                Fulfills <strong>Section 3.1</strong> of course requirements: Abstraction, Encapsulation, Inheritance, and Polymorphism.
              </p>
            </div>

            {/* UML Diagram Representation */}
            <div className="flex flex-col items-center space-y-4">
              {/* Interface: Payable */}
              <div 
                onClick={() => onSelectFile('src/main/java/com/payroll/model/Payable.java')}
                className="w-80 p-3 bg-indigo-950/40 border border-indigo-700/60 rounded-lg text-center cursor-pointer hover:border-indigo-400 transition-colors group"
              >
                <div className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">&laquo;interface&raquo;</div>
                <div className="text-sm font-mono font-bold text-slate-100 group-hover:text-indigo-300">Payable</div>
                <div className="text-[11px] text-slate-400 mt-1 border-t border-indigo-900/60 pt-1 font-mono text-left pl-2">
                  + calculateGrossPay(): double<br />
                  + calculateNetPay(int leaves): double<br />
                  + getCompensationSummary(): String
                </div>
              </div>

              <ArrowDown className="w-4 h-4 text-slate-600" />

              {/* Abstract Class: Employee */}
              <div 
                onClick={() => onSelectFile('src/main/java/com/payroll/model/Employee.java')}
                className="w-96 p-3 bg-sky-950/40 border border-sky-700/60 rounded-lg text-center cursor-pointer hover:border-sky-400 transition-colors group"
              >
                <div className="text-[10px] uppercase font-mono text-sky-400 tracking-wider">&laquo;abstract class&raquo; implements Payable, Comparable&lt;Employee&gt;</div>
                <div className="text-sm font-mono font-bold text-slate-100 group-hover:text-sky-300">Employee</div>
                <div className="text-[11px] text-slate-400 mt-1 border-t border-sky-900/60 pt-1 font-mono text-left pl-2">
                  - id: int<br />
                  - name: String<br />
                  - email: String<br />
                  - baseSalary: double<br />
                  - performanceRating: int (1-5)<br />
                  + {`{abstract}`} getEmployeeType(): String<br />
                  + compareTo(Employee): int
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <ArrowDown className="w-4 h-4 text-slate-600" />
                <ArrowDown className="w-4 h-4 text-slate-600" />
                <ArrowDown className="w-4 h-4 text-slate-600" />
              </div>

              {/* Concrete Subtypes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {/* FullTimeEmployee */}
                <div 
                  onClick={() => onSelectFile('src/main/java/com/payroll/model/FullTimeEmployee.java')}
                  className="p-3 bg-emerald-950/30 border border-emerald-700/60 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors group"
                >
                  <div className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider">Subtype 1</div>
                  <div className="text-sm font-mono font-bold text-slate-100 group-hover:text-emerald-300">FullTimeEmployee</div>
                  <div className="text-[11px] text-slate-400 mt-1 border-t border-emerald-900/60 pt-1 font-mono">
                    - housingAllowance: double<br />
                    - healthAllowance: double<br />
                    + calculateGrossPay() [HRA+Med]<br />
                    + calculateNetPay() [Tax+PF]
                  </div>
                </div>

                {/* PartTimeEmployee */}
                <div 
                  onClick={() => onSelectFile('src/main/java/com/payroll/model/PartTimeEmployee.java')}
                  className="p-3 bg-emerald-950/30 border border-emerald-700/60 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors group"
                >
                  <div className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider">Subtype 2</div>
                  <div className="text-sm font-mono font-bold text-slate-100 group-hover:text-emerald-300">PartTimeEmployee</div>
                  <div className="text-[11px] text-slate-400 mt-1 border-t border-emerald-900/60 pt-1 font-mono">
                    - hoursWorkedMonthly: double<br />
                    - overtimeHourlyRate: double<br />
                    + calculateGrossPay() [1.5x OT]<br />
                    + calculateNetPay() [Hourly rate]
                  </div>
                </div>

                {/* ContractorEmployee */}
                <div 
                  onClick={() => onSelectFile('src/main/java/com/payroll/model/ContractorEmployee.java')}
                  className="p-3 bg-emerald-950/30 border border-emerald-700/60 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors group"
                >
                  <div className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider">Subtype 3</div>
                  <div className="text-sm font-mono font-bold text-slate-100 group-hover:text-emerald-300">ContractorEmployee</div>
                  <div className="text-[11px] text-slate-400 mt-1 border-t border-emerald-900/60 pt-1 font-mono">
                    - contractDurationMonths: int<br />
                    - withholdingTaxRate: double<br />
                    + calculateGrossPay() [Retainer]<br />
                    + calculateNetPay() [Withholding]
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="space-y-4">
            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Collections Framework Usage & Algorithms</h3>
              <p className="text-xs text-slate-400">
                Demonstrates <strong>Section 3.1 Collections Framework</strong>: List implementations, Map lookups, and Comparator sorting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 space-y-2">
                <span className="text-xs font-mono text-purple-400 font-semibold">1. java.util.ArrayList</span>
                <p className="text-xs text-slate-300">
                  Used in <code>EmployeeDAOImpl.findAll()</code> and <code>EmployeeService</code> to maintain ordered collections of records for iterative table generation and reports.
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-slate-400">
                  List&lt;Employee&gt; all = new ArrayList&lt;&gt;();
                </div>
              </div>

              <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 space-y-2">
                <span className="text-xs font-mono text-sky-400 font-semibold">2. java.util.HashMap</span>
                <p className="text-xs text-slate-300">
                  Employed as an in-memory cache for ultra-fast $O(1)$ constant-time ID lookups, avoiding redundant database round-trips during payroll calculations.
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-slate-400">
                  Map&lt;Integer, Employee&gt; cache = new HashMap&lt;&gt;();
                </div>
              </div>

              <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 space-y-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold">3. java.util.Comparator</span>
                <p className="text-xs text-slate-300">
                  Custom comparators provide multi-criteria sorting by base salary (descending/ascending) and by full employee name.
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-slate-400">
                  Comparator.comparingDouble(Employee::getBaseSalary).reversed();
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jdbc' && (
          <div className="space-y-4">
            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">JDBC Persistence & Data Access Object (DAO) Pattern</h3>
              <p className="text-xs text-slate-400">
                Fulfills <strong>Section 3.1 JDBC Connectivity</strong>: PreparedStatement, resource management, and externalized credentials.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-emerald-400 font-bold mb-1">&bull; PreparedStatement Query Protection</div>
                <div className="text-slate-400">
                  No SQL injection vulnerability: all dynamic values are bound via indexed parameter markers <code>?</code> (e.g. <code>ps.setString(1, emp.getName())</code>).
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-emerald-400 font-bold mb-1">&bull; Automatic Resource Cleanup via Try-With-Resources</div>
                <div className="text-slate-400">
                  Ensures all <code>Connection</code>, <code>PreparedStatement</code>, and <code>ResultSet</code> objects close deterministically to prevent connection leaks.
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded">
                <div className="text-emerald-400 font-bold mb-1">&bull; Credentials Decoupled from Code</div>
                <div className="text-slate-400">
                  Database URLs, user, and password parameters reside in <code>src/main/resources/db.properties</code>, adhering to enterprise security best practices.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exceptions' && (
          <div className="space-y-4">
            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Custom Exception Hierarchy</h3>
              <p className="text-xs text-slate-400">
                Meets <strong>Section 3.1 Exception Handling</strong>: checked domain exceptions and wrapping of SQLException.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-rose-900/50 bg-rose-950/20 rounded-lg space-y-2">
                <div className="text-xs font-mono text-rose-300 font-bold">EmployeeNotFoundException</div>
                <p className="text-xs text-slate-400">
                  Checked exception thrown when an ID lookup fails during update, delete, or payroll computation.
                </p>
              </div>

              <div className="p-4 border border-rose-900/50 bg-rose-950/20 rounded-lg space-y-2">
                <div className="text-xs font-mono text-rose-300 font-bold">DuplicateEmployeeException</div>
                <p className="text-xs text-slate-400">
                  Enforces database uniqueness constraints, preventing duplicate emails without unhandled crashes.
                </p>
              </div>

              <div className="p-4 border border-rose-900/50 bg-rose-950/20 rounded-lg space-y-2">
                <div className="text-xs font-mono text-rose-300 font-bold">DatabaseOperationException</div>
                <p className="text-xs text-slate-400">
                  Meaningfully wraps checked <code>SQLException</code> instances with contextual error diagnosis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
