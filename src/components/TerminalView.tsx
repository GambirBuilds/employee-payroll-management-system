import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, Trash2, Download, CheckCircle2, AlertTriangle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { PayrollDatabase } from '../services/payrollDatabase';
import { PayrollCalculator } from '../services/payrollLogic';
import { Employee } from '../types/payroll';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'ascii';
  text: string;
}

export const TerminalView: React.FC<{ onNavigateToCode?: (filename: string) => void }> = ({ onNavigateToCode }) => {
  const db = PayrollDatabase.getInstance();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [currentPrompt, setCurrentPrompt] = useState('Enter selection [1-9]: ');
  
  // Interactive wizard state when creating/updating an employee step-by-step
  const [wizardState, setWizardState] = useState<{
    step: string;
    data: any;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const printLine = (text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), text, type }]);
  };

  const printAscii = (text: string) => {
    setLines(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), text, type: 'ascii' }]);
  };

  const clearScreen = () => {
    setLines([]);
    setWizardState(null);
    setCurrentPrompt('Enter selection [1-9]: ');
    printWelcomeBanner();
  };

  const printWelcomeBanner = () => {
    const banner = [
      '==================================================================',
      '      ACME ENTERPRISE CORP :: EMPLOYEE & PAYROLL SYSTEM (v2.4)    ',
      '         Core Java Terminal Backend Application (JDK 17)          ',
      '==================================================================',
      ' [INFO] SQLite JDBC Driver loaded: org.sqlite.JDBC (3.45.1.0)',
      ' [INFO] Database schema verified: departments, employees, payroll, leaves.',
      ' [INFO] Memory cache initialized: HashMap<Integer, Employee> (7 records).',
      '------------------------------------------------------------------',
      ' MAIN MENU:',
      '  [1] List All Employees (Formatted ASCII Table)',
      '  [2] Add New Employee (Full-Time, Part-Time, Contractor)',
      '  [3] Search Employee by ID or Name/Position Keyword',
      '  [4] Update Employee Details (Salary, Position, Rating)',
      '  [5] Delete Employee Record (with Database Safety Checks)',
      '  [6] Sort Employees (Comparator: Salary, Name, ID)',
      '  [7] Run Monthly Payroll & Generate Formatted Payslip',
      '  [8] Department Salary Summary & Budget Utilization',
      '  [9] Exit / Restart Terminal Session',
      '------------------------------------------------------------------',
    ];
    setLines(banner.map(line => ({
      id: Math.random().toString(36).substring(2, 9),
      text: line,
      type: line.startsWith(' [INFO]') ? 'system' : 'output',
    })));
  };

  useEffect(() => {
    printWelcomeBanner();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input && !wizardState) return;

    // Record history
    setInputHistory(prev => [...prev, input]);
    setHistoryIdx(-1);

    // Echo input
    printLine(`${currentPrompt}${rawInput}`, 'input');

    // If currently inside an interactive wizard step (e.g. adding an employee)
    if (wizardState) {
      processWizardStep(input);
      return;
    }

    // Process top-level menu
    switch (input) {
      case '1':
        handleListEmployees();
        break;
      case '2':
        handleStartAddEmployeeWizard();
        break;
      case '3':
        handleStartSearchWizard();
        break;
      case '4':
        handleStartUpdateWizard();
        break;
      case '5':
        handleStartDeleteWizard();
        break;
      case '6':
        handleStartSortWizard();
        break;
      case '7':
        handleStartPayslipWizard();
        break;
      case '8':
        handleDepartmentSummary();
        break;
      case '9':
        printLine('Session closed. Restarting terminal...', 'system');
        setTimeout(() => clearScreen(), 700);
        break;
      case 'help':
      case 'menu':
        printWelcomeBanner();
        break;
      case 'clear':
      case 'cls':
        clearScreen();
        break;
      default:
        printLine(` >> InputValidator: Invalid option '${input}'. Please enter a number between 1 and 9.`, 'error');
        break;
    }
  };

  // --- MENU HANDLERS ---

  const handleListEmployees = () => {
    const emps = db.getAllEmployees();
    const depts = new Map(db.getAllDepartments().map(d => [d.id, d]));
    const asciiTable = PayrollCalculator.generateAsciiEmployeeTable(emps, depts);
    printAscii(asciiTable);
    printLine(`\nSUCCESS: Retrieved ${emps.length} employee records via PreparedStatement and ArrayList.`, 'success');
  };

  const handleDepartmentSummary = () => {
    const summaries = db.getDepartmentSalarySummaries();
    const asciiSummary = PayrollCalculator.generateAsciiDepartmentSummary(summaries);
    printAscii(asciiSummary);
    printLine('\nSUCCESS: Computed departmental payroll budgets and staff headcounts.', 'success');
  };

  // --- WIZARDS (Interactive Prompts simulating Scanner in Java) ---

  const handleStartAddEmployeeWizard = () => {
    printLine('\n--- ADD NEW EMPLOYEE ---', 'system');
    printLine('Select Employment Type:\n  1) Full-Time Salaried (HRA, Health, 401k/PF)\n  2) Part-Time Hourly (Hours worked + Overtime)\n  3) Contractor (Fixed Retainer, Withholding)');
    setCurrentPrompt('Select Type [1-3]: ');
    setWizardState({ step: 'ADD_TYPE', data: {} });
  };

  const handleStartSearchWizard = () => {
    printLine('\n--- SEARCH EMPLOYEE (Collections HashMap / Query) ---', 'system');
    printLine('Search mode:\n  1) Direct ID Lookup (O(1) HashMap)\n  2) Search by Name or Position Keyword');
    setCurrentPrompt('Mode [1-2]: ');
    setWizardState({ step: 'SEARCH_MODE', data: {} });
  };

  const handleStartUpdateWizard = () => {
    printLine('\n--- UPDATE EMPLOYEE DETAILS ---', 'system');
    setCurrentPrompt('Enter Employee ID to update: ');
    setWizardState({ step: 'UPDATE_ID', data: {} });
  };

  const handleStartDeleteWizard = () => {
    printLine('\n--- DELETE EMPLOYEE (Foreign Key Enforced) ---', 'system');
    setCurrentPrompt('Enter Employee ID to delete: ');
    setWizardState({ step: 'DELETE_ID', data: {} });
  };

  const handleStartSortWizard = () => {
    printLine('\n--- SORT EMPLOYEES (Java Comparator) ---', 'system');
    printLine('Sort criteria:\n  1) Salary (Highest to Lowest)\n  2) Salary (Lowest to Highest)\n  3) Name (Alphabetical A-Z)\n  4) ID (Default natural order)');
    setCurrentPrompt('Select sort [1-4]: ');
    setWizardState({ step: 'SORT_CHOICE', data: {} });
  };

  const handleStartPayslipWizard = () => {
    printLine('\n--- RUN MONTHLY PAYROLL & GENERATE PAYSLIP ---', 'system');
    const emps = db.getAllEmployees();
    printLine(`Active employees: ${emps.map(e => `#${e.id} (${e.name})`).join(', ')}`);
    setCurrentPrompt('Enter Employee ID (e.g. 101): ');
    setWizardState({ step: 'PAYSLIP_ID', data: {} });
  };

  // Multi-step Scanner simulation
  const processWizardStep = (input: string) => {
    if (!wizardState) return;
    const { step, data } = wizardState;

    if (input.toLowerCase() === 'cancel' || input.toLowerCase() === 'exit') {
      printLine('Operation cancelled by user.', 'system');
      setWizardState(null);
      setCurrentPrompt('Enter selection [1-9]: ');
      return;
    }

    switch (step) {
      // --- ADD EMPLOYEE WIZARD ---
      case 'ADD_TYPE': {
        const typeNum = parseInt(input);
        if (![1, 2, 3].includes(typeNum)) {
          printLine(' >> Invalid type. Please enter 1, 2, or 3 (or type "cancel"):', 'error');
          return;
        }
        const typeMap = { 1: 'FULL_TIME', 2: 'PART_TIME', 3: 'CONTRACTOR' } as const;
        const employeeType = typeMap[typeNum as 1 | 2 | 3];
        setWizardState({ step: 'ADD_NAME', data: { ...data, employeeType } });
        setCurrentPrompt('Enter Full Name: ');
        break;
      }
      case 'ADD_NAME': {
        if (!input) {
          printLine(' >> Name cannot be blank:', 'error');
          return;
        }
        setWizardState({ step: 'ADD_EMAIL', data: { ...data, name: input } });
        setCurrentPrompt(`Enter Corporate Email for ${input}: `);
        break;
      }
      case 'ADD_EMAIL': {
        if (!input.includes('@')) {
          printLine(' >> Invalid email format. Must contain "@":', 'error');
          return;
        }
        setWizardState({ step: 'ADD_DEPT', data: { ...data, email: input } });
        printLine('Available Departments: 1=ENG, 2=HR, 3=FIN, 4=MKT, 5=OPS');
        setCurrentPrompt('Enter Department ID [1-5]: ');
        break;
      }
      case 'ADD_DEPT': {
        const deptId = parseInt(input);
        if (isNaN(deptId) || deptId < 1 || deptId > 5) {
          printLine(' >> Department must be between 1 and 5:', 'error');
          return;
        }
        setWizardState({ step: 'ADD_POSITION', data: { ...data, departmentId: deptId } });
        setCurrentPrompt('Enter Position Title (e.g. Cloud Engineer): ');
        break;
      }
      case 'ADD_POSITION': {
        if (!input) {
          printLine(' >> Position cannot be empty:', 'error');
          return;
        }
        const isPartTime = data.employeeType === 'PART_TIME';
        setWizardState({ step: 'ADD_SALARY', data: { ...data, position: input } });
        setCurrentPrompt(isPartTime ? 'Enter Hourly Wage ($/hour, e.g. 45): ' : 'Enter Monthly Base Salary ($/month, e.g. 7500): ');
        break;
      }
      case 'ADD_SALARY': {
        const salary = parseFloat(input);
        if (isNaN(salary) || salary <= 0) {
          printLine(' >> Please enter a positive numerical amount:', 'error');
          return;
        }
        setWizardState({ step: 'ADD_RATING', data: { ...data, baseSalary: salary } });
        setCurrentPrompt('Enter Performance Rating (1 to 5 stars, default 3): ');
        break;
      }
      case 'ADD_RATING': {
        let rating = parseInt(input);
        if (isNaN(rating) || rating < 1 || rating > 5) rating = 3;
        
        const finalData = {
          ...data,
          performanceRating: rating,
          hireDate: new Date().toISOString().split('T')[0],
        };

        try {
          const created = db.addEmployee(finalData);
          printLine(`\nSUCCESS: Employee created! [${created.employeeType}] #${created.id} - ${created.name}`, 'success');
          printLine(`PreparedStatement: INSERT INTO employees (id, name, email, department_id, base_salary...) VALUES (${created.id}, '${created.name}', ...)`, 'system');
          printLine(`In-memory cache updated: employeeCache.put(${created.id}, employee);`, 'system');
        } catch (err: any) {
          printLine(`\nEXCEPTION CAUGHT: ${err.message}`, 'error');
        }

        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }

      // --- SEARCH WIZARD ---
      case 'SEARCH_MODE': {
        if (input === '1') {
          setWizardState({ step: 'SEARCH_BY_ID', data: {} });
          setCurrentPrompt('Enter Employee ID: ');
        } else if (input === '2') {
          setWizardState({ step: 'SEARCH_BY_QUERY', data: {} });
          setCurrentPrompt('Enter Name or Position keyword: ');
        } else {
          printLine(' >> Please select 1 or 2:', 'error');
        }
        break;
      }
      case 'SEARCH_BY_ID': {
        const id = parseInt(input);
        const emp = db.getEmployeeById(id);
        if (emp) {
          const dept = db.getDepartmentById(emp.departmentId);
          printLine(`\n[CACHE HIT - O(1) LOOKUP in HashMap<Integer, Employee>]`, 'system');
          printLine(`  ID           : #${emp.id}`);
          printLine(`  Name         : ${emp.name}`);
          printLine(`  Type         : ${emp.employeeType}`);
          printLine(`  Email        : ${emp.email}`);
          printLine(`  Department   : ${dept ? dept.name : 'N/A'} (${dept?.code})`);
          printLine(`  Position     : ${emp.position}`);
          printLine(`  Base Salary  : $${emp.baseSalary.toLocaleString()}${emp.employeeType === 'PART_TIME' ? '/hr' : '/mo'}`);
          printLine(`  Rating       : ${'★'.repeat(emp.performanceRating)}${'☆'.repeat(5 - emp.performanceRating)} (${emp.performanceRating}/5)`);
          printLine(`  Hired Date   : ${emp.hireDate}`);
        } else {
          printLine(`\nEmployeeNotFoundException: Employee with ID #${id} does not exist in SQLite database.`, 'error');
        }
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }
      case 'SEARCH_BY_QUERY': {
        const matches = db.findEmployeesByName(input);
        printLine(`\nPreparedStatement query: SELECT * FROM employees WHERE LOWER(name) LIKE '%${input}%' OR LOWER(position) LIKE '%${input}%'`, 'system');
        if (matches.length === 0) {
          printLine(`No employees matched keyword "${input}".`, 'output');
        } else {
          printLine(`Found ${matches.length} matching employee(s):`, 'success');
          for (const m of matches) {
            printLine(`  - #${m.id} ${m.name} | ${m.position} | Base: $${m.baseSalary} | Rating: ${m.performanceRating}/5`);
          }
        }
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }

      // --- UPDATE WIZARD ---
      case 'UPDATE_ID': {
        const id = parseInt(input);
        const emp = db.getEmployeeById(id);
        if (!emp) {
          printLine(`EmployeeNotFoundException: ID #${id} not found in database.`, 'error');
          setWizardState(null);
          setCurrentPrompt('Enter selection [1-9]: ');
          return;
        }
        printLine(`Editing: #${emp.id} ${emp.name} (${emp.position}, Base: $${emp.baseSalary}, Rating: ${emp.performanceRating})`);
        setWizardState({ step: 'UPDATE_SALARY', data: { id, currentSalary: emp.baseSalary } });
        setCurrentPrompt(`Enter new Base Salary (or press ENTER to keep $${emp.baseSalary}): `);
        break;
      }
      case 'UPDATE_SALARY': {
        const newSalary = input ? parseFloat(input) : data.currentSalary;
        setWizardState({ step: 'UPDATE_RATING', data: { ...data, newSalary } });
        setCurrentPrompt('Enter new Performance Rating [1-5] (or press ENTER to keep current): ');
        break;
      }
      case 'UPDATE_RATING': {
        const newRating = input ? parseInt(input) : undefined;
        try {
          const updates: any = { baseSalary: data.newSalary };
          if (newRating && newRating >= 1 && newRating <= 5) {
            updates.performanceRating = newRating;
          }
          const updated = db.updateEmployee(data.id, updates);
          printLine(`\nSUCCESS: Updated employee #${updated.id} (${updated.name})! Base salary set to $${updated.baseSalary}.`, 'success');
          printLine(`PreparedStatement executed: UPDATE employees SET base_salary = ?, performance_rating = ? WHERE id = ?`, 'system');
        } catch (err: any) {
          printLine(`Error: ${err.message}`, 'error');
        }
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }

      // --- DELETE WIZARD ---
      case 'DELETE_ID': {
        const id = parseInt(input);
        const emp = db.getEmployeeById(id);
        if (!emp) {
          printLine(`EmployeeNotFoundException: Employee #${id} does not exist in database.`, 'error');
          setWizardState(null);
          setCurrentPrompt('Enter selection [1-9]: ');
          return;
        }
        setWizardState({ step: 'DELETE_CONFIRM', data: { id, name: emp.name } });
        setCurrentPrompt(`Are you sure you want to permanently delete #${id} (${emp.name})? (yes/no): `);
        break;
      }
      case 'DELETE_CONFIRM': {
        if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y') {
          try {
            db.deleteEmployee(data.id);
            printLine(`\nSUCCESS: Employee #${data.id} (${data.name}) was deleted from SQLite database.`, 'success');
            printLine(`PreparedStatement executed: DELETE FROM employees WHERE id = ?`, 'system');
            printLine(`employeeCache.remove(${data.id});`, 'system');
          } catch (err: any) {
            printLine(`Error: ${err.message}`, 'error');
          }
        } else {
          printLine('Deletion cancelled.', 'system');
        }
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }

      // --- SORT WIZARD ---
      case 'SORT_CHOICE': {
        let criteria: 'salary_desc' | 'salary_asc' | 'name_asc' | 'id_asc' = 'salary_desc';
        if (input === '1') criteria = 'salary_desc';
        else if (input === '2') criteria = 'salary_asc';
        else if (input === '3') criteria = 'name_asc';
        else if (input === '4') criteria = 'id_asc';
        else {
          printLine(' >> Invalid choice. Enter 1, 2, 3, or 4:', 'error');
          return;
        }

        const sorted = db.sortEmployees(criteria);
        const depts = new Map(db.getAllDepartments().map(d => [d.id, d]));
        printLine(`\n--- SORTED EMPLOYEE LIST (Comparator: ${criteria}) ---`, 'system');
        printAscii(PayrollCalculator.generateAsciiEmployeeTable(sorted, depts));
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }

      // --- PAYSLIP WIZARD ---
      case 'PAYSLIP_ID': {
        const id = parseInt(input);
        const emp = db.getEmployeeById(id);
        if (!emp) {
          printLine(`EmployeeNotFoundException: Employee with ID #${id} does not exist.`, 'error');
          setWizardState(null);
          setCurrentPrompt('Enter selection [1-9]: ');
          return;
        }
        setWizardState({ step: 'PAYSLIP_PERIOD', data: { empId: id, empName: emp.name } });
        setCurrentPrompt('Enter Pay Period (default: 2026-09): ');
        break;
      }
      case 'PAYSLIP_PERIOD': {
        const payPeriod = input.trim() || '2026-09';
        setWizardState({ step: 'PAYSLIP_LEAVES', data: { ...data, payPeriod } });
        setCurrentPrompt('Enter unpaid leave days this month [0-22, default 0]: ');
        break;
      }
      case 'PAYSLIP_LEAVES': {
        const unpaidDays = parseInt(input) || 0;
        try {
          if (unpaidDays > 0) {
            db.addLeave({
              employeeId: data.empId,
              leaveType: 'UNPAID',
              daysCount: unpaidDays,
              monthYear: data.payPeriod,
              reason: 'Unapproved absence / Leave without pay',
              isApproved: true,
            });
            printLine(`Logged ${unpaidDays} unpaid leave day(s) affecting monthly net salary.`, 'system');
          }

          const record = db.processPayrollForEmployee(data.empId, data.payPeriod);
          const dept = db.getDepartmentById(db.getEmployeeById(data.empId)?.departmentId || 1);
          const asciiPayslip = PayrollCalculator.generateAsciiPayslip(record, dept?.code || 'GEN');

          printLine('\nPAYROLL PROCESSING COMPLETE (Saved to SQLite payroll_records):', 'success');
          printAscii(asciiPayslip);
        } catch (err: any) {
          printLine(`PayrollProcessingException: ${err.message}`, 'error');
        }
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
      }

      default:
        setWizardState(null);
        setCurrentPrompt('Enter selection [1-9]: ');
        break;
    }
  };

  // Quick Action Preset triggers
  const triggerPreset = (menuNumber: string) => {
    handleCommand(menuNumber);
  };

  const triggerDirectPayslip = (empId: number) => {
    printLine(`execute: generate payslip for employee #${empId}`, 'input');
    try {
      const record = db.processPayrollForEmployee(empId, '2026-09');
      const dept = db.getDepartmentById(db.getEmployeeById(empId)?.departmentId || 1);
      const asciiPayslip = PayrollCalculator.generateAsciiPayslip(record, dept?.code || 'ENG');
      printAscii(asciiPayslip);
    } catch (e: any) {
      printLine(`Error: ${e.message}`, 'error');
    }
  };

  const triggerExceptionDemo = () => {
    printLine('execute: simulate EmployeeNotFoundException (lookup ID #99999)', 'input');
    printLine('com.payroll.exception.EmployeeNotFoundException: Employee record not found for ID #99999 in database.', 'error');
    printLine('  at com.payroll.service.EmployeeService.getEmployeeById(EmployeeService.java:38)', 'error');
    printLine('  at com.payroll.ui.ConsoleMenu.handleSearchEmployee(ConsoleMenu.java:112)', 'error');
    printLine(' >> Handled gracefully by try-catch block: System will not crash.', 'system');
  };

  const triggerDownloadCsv = () => {
    const emps = db.getAllEmployees();
    const rows = ['ID,Name,Email,DepartmentID,Position,Type,BaseSalary,Rating,HireDate'];
    for (const e of emps) {
      rows.push(`${e.id},"${e.name}","${e.email}",${e.departmentId},"${e.position}",${e.employeeType},${e.baseSalary},${e.performanceRating},${e.hireDate}`);
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_roster_export.csv';
    a.click();
    printLine('Exported employee directory to employee_roster_export.csv', 'success');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-2 flex items-center gap-1">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            bash - java -cp "bin:lib/sqlite-jdbc.jar" com.payroll.Main
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearScreen}
            title="Clear terminal screen"
            className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          <button
            onClick={() => {
              db.resetToDefaults();
              clearScreen();
              printLine('Database re-seeded with original records.', 'system');
            }}
            title="Reset database to initial state"
            className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset DB
          </button>
        </div>
      </div>

      {/* Quick Action Presets Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-mono text-slate-400">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider shrink-0 font-medium">Quick Presets:</span>
        <button
          onClick={() => triggerPreset('1')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/60 shrink-0 transition-colors"
        >
          [1] List All
        </button>
        <button
          onClick={() => triggerDirectPayslip(101)}
          className="px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 rounded border border-emerald-800/50 shrink-0 transition-colors"
        >
          [7] Alice's Payslip
        </button>
        <button
          onClick={() => triggerDirectPayslip(104)}
          className="px-2.5 py-1 bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 rounded border border-sky-800/50 shrink-0 transition-colors"
        >
          [7] Part-Time OT Slip
        </button>
        <button
          onClick={() => triggerPreset('8')}
          className="px-2.5 py-1 bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 rounded border border-indigo-800/50 shrink-0 transition-colors"
        >
          [8] Dept Summary
        </button>
        <button
          onClick={() => triggerPreset('6')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/60 shrink-0 transition-colors"
        >
          [6] Sort Salary
        </button>
        <button
          onClick={triggerExceptionDemo}
          className="px-2.5 py-1 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 rounded border border-amber-800/50 shrink-0 transition-colors"
        >
          Test Exception
        </button>
        <button
          onClick={triggerDownloadCsv}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/60 shrink-0 transition-colors flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          Export CSV
        </button>
      </div>

      {/* Terminal Screen Canvas */}
      <div 
        className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1 select-text bg-[#070b12]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((l) => {
          if (l.type === 'input') {
            return (
              <div key={l.id} className="text-slate-200 flex items-start gap-1 py-0.5">
                <span className="text-emerald-400 font-bold select-none">{'>'}</span>
                <span>{l.text}</span>
              </div>
            );
          } else if (l.type === 'error') {
            return (
              <div key={l.id} className="text-rose-400 font-medium py-0.5">
                {l.text}
              </div>
            );
          } else if (l.type === 'success') {
            return (
              <div key={l.id} className="text-emerald-400 py-0.5 font-medium">
                {l.text}
              </div>
            );
          } else if (l.type === 'system') {
            return (
              <div key={l.id} className="text-cyan-400/90 text-xs py-0.5">
                {l.text}
              </div>
            );
          } else if (l.type === 'ascii') {
            return (
              <pre key={l.id} className="text-amber-200/95 leading-relaxed overflow-x-auto my-1 font-mono text-xs">
                {l.text}
              </pre>
            );
          }
          return (
            <div key={l.id} className="text-slate-300 py-0.5 whitespace-pre-wrap">
              {l.text}
            </div>
          );
        })}

        {/* Active Command Input Line */}
        <div className="flex items-center gap-1.5 pt-2 text-slate-100">
          <span className="text-emerald-400 font-bold select-none font-mono">
            {currentPrompt}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCommand(inputVal);
                setInputVal('');
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (inputHistory.length > 0) {
                  const nextIdx = historyIdx + 1;
                  if (nextIdx < inputHistory.length) {
                    setHistoryIdx(nextIdx);
                    setInputVal(inputHistory[inputHistory.length - 1 - nextIdx]);
                  }
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIdx > 0) {
                  const nextIdx = historyIdx - 1;
                  setHistoryIdx(nextIdx);
                  setInputVal(inputHistory[inputHistory.length - 1 - nextIdx]);
                } else if (historyIdx === 0) {
                  setHistoryIdx(-1);
                  setInputVal('');
                }
              }
            }}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-slate-100 caret-emerald-400"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder={wizardState ? "Type answer and press Enter..." : "Type 1-9 and press Enter..."}
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer Indicator */}
      <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Scanner Active
          </span>
          <span>JDK: 17.0.9</span>
          <span>JDBC: SQLite 3.45</span>
          <span>Encoding: UTF-8</span>
        </div>
        <div className="text-slate-400">
          Press <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">Enter</kbd> to submit
        </div>
      </div>
    </div>
  );
};
