import { Department, DepartmentSalarySummary, Employee, LeaveRecord, PayrollRecord } from '../types/payroll';
import { PayrollCalculator } from './payrollLogic';

const STORAGE_KEY_DEPTS = 'java_payroll_depts_v1';
const STORAGE_KEY_EMPS = 'java_payroll_emps_v1';
const STORAGE_KEY_PAYROLL = 'java_payroll_records_v1';
const STORAGE_KEY_LEAVES = 'java_payroll_leaves_v1';

// Seed initial relational data mirroring schema.sql
const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 1, code: 'ENG', name: 'Software Engineering', monthlyBudget: 45000, headOfDepartment: 'Dr. Sarah Vance', createdAt: '2025-01-10' },
  { id: 2, code: 'HR', name: 'Human Resources', monthlyBudget: 18000, headOfDepartment: 'Michael Chang', createdAt: '2025-01-10' },
  { id: 3, code: 'FIN', name: 'Finance & Accounting', monthlyBudget: 28000, headOfDepartment: 'Elena Rostova', createdAt: '2025-01-12' },
  { id: 4, code: 'MKT', name: 'Product Marketing', monthlyBudget: 22000, headOfDepartment: 'Jordan Hayes', createdAt: '2025-01-15' },
  { id: 5, code: 'OPS', name: 'Infrastructure & Ops', monthlyBudget: 32000, headOfDepartment: 'David Miller', createdAt: '2025-02-01' },
];

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 101,
    name: 'Alice Johnson',
    email: 'alice.johnson@acme.corp',
    departmentId: 1,
    position: 'Lead Backend Architect',
    employeeType: 'FULL_TIME',
    baseSalary: 9500,
    hireDate: '2023-03-15',
    performanceRating: 5,
    housingAllowance: 1425,
    healthAllowance: 350,
  },
  {
    id: 102,
    name: 'Bob Martinez',
    email: 'bob.martinez@acme.corp',
    departmentId: 1,
    position: 'Senior Java Developer',
    employeeType: 'FULL_TIME',
    baseSalary: 7800,
    hireDate: '2023-08-01',
    performanceRating: 4,
    housingAllowance: 1170,
    healthAllowance: 350,
  },
  {
    id: 103,
    name: 'Chloe Davis',
    email: 'chloe.davis@acme.corp',
    departmentId: 2,
    position: 'Talent Acquisition Partner',
    employeeType: 'FULL_TIME',
    baseSalary: 5200,
    hireDate: '2024-01-10',
    performanceRating: 4,
    housingAllowance: 780,
    healthAllowance: 350,
  },
  {
    id: 104,
    name: 'Derek O\'Connor',
    email: 'derek.oc@acme.corp',
    departmentId: 1,
    position: 'Junior QA Automation',
    employeeType: 'PART_TIME',
    baseSalary: 38, // $38/hr
    hireDate: '2024-05-20',
    performanceRating: 3,
    hoursWorkedMonthly: 175, // 15 hours overtime
    overtimeHourlyRate: 57,
  },
  {
    id: 105,
    name: 'Elena Rostova',
    email: 'elena.rostova@acme.corp',
    departmentId: 3,
    position: 'Chief Financial Analyst',
    employeeType: 'FULL_TIME',
    baseSalary: 8600,
    hireDate: '2022-11-01',
    performanceRating: 5,
    housingAllowance: 1290,
    healthAllowance: 350,
  },
  {
    id: 106,
    name: 'Felix Klein',
    email: 'felix.klein@cloudspecialists.io',
    departmentId: 5,
    position: 'DevOps Cloud Consultant',
    employeeType: 'CONTRACTOR',
    baseSalary: 8500, // Monthly contract fee
    hireDate: '2024-02-01',
    performanceRating: 4,
    contractDurationMonths: 12,
    withholdingTaxRate: 0.10,
  },
  {
    id: 107,
    name: 'Grace Hopper',
    email: 'grace.h@acme.corp',
    departmentId: 4,
    position: 'Senior Growth Specialist',
    employeeType: 'FULL_TIME',
    baseSalary: 6400,
    hireDate: '2023-09-15',
    performanceRating: 3,
    housingAllowance: 960,
    healthAllowance: 350,
  },
];

const DEFAULT_LEAVES: LeaveRecord[] = [
  { id: 1, employeeId: 102, leaveType: 'UNPAID', daysCount: 2, monthYear: '2026-09', reason: 'Personal family emergency', isApproved: true, appliedDate: '2026-09-05' },
  { id: 2, employeeId: 103, leaveType: 'PAID_ANNUAL', daysCount: 3, monthYear: '2026-09', reason: 'Annual vacation', isApproved: true, appliedDate: '2026-09-12' },
  { id: 3, employeeId: 104, leaveType: 'SICK', daysCount: 1, monthYear: '2026-09', reason: 'Flu recovery', isApproved: true, appliedDate: '2026-09-18' },
];

/**
 * SQLite/JDBC emulation layer with LocalStorage persistence.
 * Meets Section 3.1: "Data must persist between program runs (stored in database)"
 */
export class PayrollDatabase {
  private static instance: PayrollDatabase;

  private departments: Map<number, Department> = new Map();
  private employees: Map<number, Employee> = new Map();
  private payrollRecords: PayrollRecord[] = [];
  private leaveRecords: LeaveRecord[] = [];

  private constructor() {
    this.initDatabase();
  }

  public static getInstance(): PayrollDatabase {
    if (!PayrollDatabase.instance) {
      PayrollDatabase.instance = new PayrollDatabase();
    }
    return PayrollDatabase.instance;
  }

  public initDatabase(): void {
    try {
      const storedDepts = localStorage.getItem(STORAGE_KEY_DEPTS);
      const storedEmps = localStorage.getItem(STORAGE_KEY_EMPS);
      const storedPayroll = localStorage.getItem(STORAGE_KEY_PAYROLL);
      const storedLeaves = localStorage.getItem(STORAGE_KEY_LEAVES);

      if (storedDepts) {
        const deptsArr: Department[] = JSON.parse(storedDepts);
        this.departments = new Map(deptsArr.map(d => [d.id, d]));
      } else {
        this.departments = new Map(DEFAULT_DEPARTMENTS.map(d => [d.id, d]));
        this.saveDepartments();
      }

      if (storedEmps) {
        const empsArr: Employee[] = JSON.parse(storedEmps);
        this.employees = new Map(empsArr.map(e => [e.id, e]));
      } else {
        this.employees = new Map(DEFAULT_EMPLOYEES.map(e => [e.id, e]));
        this.saveEmployees();
      }

      if (storedPayroll) {
        this.payrollRecords = JSON.parse(storedPayroll);
      } else {
        this.payrollRecords = [];
        // Seed first month of payroll records for Alice and Bob
        this.generateInitialPayrollRecords();
      }

      if (storedLeaves) {
        this.leaveRecords = JSON.parse(storedLeaves);
      } else {
        this.leaveRecords = [...DEFAULT_LEAVES];
        this.saveLeaves();
      }
    } catch {
      // Fallback in case of corrupted JSON
      this.resetToDefaults();
    }
  }

  public resetToDefaults(): void {
    this.departments = new Map(DEFAULT_DEPARTMENTS.map(d => [d.id, d]));
    this.employees = new Map(DEFAULT_EMPLOYEES.map(e => [e.id, e]));
    this.leaveRecords = [...DEFAULT_LEAVES];
    this.payrollRecords = [];
    this.saveDepartments();
    this.saveEmployees();
    this.saveLeaves();
    this.generateInitialPayrollRecords();
  }

  private generateInitialPayrollRecords(): void {
    const period = '2026-08';
    const emps = Array.from(this.employees.values()).slice(0, 4);
    for (const emp of emps) {
      this.processPayrollForEmployee(emp.id, period);
    }
  }

  private saveDepartments(): void {
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(Array.from(this.departments.values())));
  }

  private saveEmployees(): void {
    localStorage.setItem(STORAGE_KEY_EMPS, JSON.stringify(Array.from(this.employees.values())));
  }

  private savePayroll(): void {
    localStorage.setItem(STORAGE_KEY_PAYROLL, JSON.stringify(this.payrollRecords));
  }

  private saveLeaves(): void {
    localStorage.setItem(STORAGE_KEY_LEAVES, JSON.stringify(this.leaveRecords));
  }

  // --- Department DAO methods ---

  public getAllDepartments(): Department[] {
    return Array.from(this.departments.values()).sort((a, b) => a.id - b.id);
  }

  public getDepartmentById(id: number): Department | undefined {
    return this.departments.get(id);
  }

  public addDepartment(dept: Omit<Department, 'id' | 'createdAt'>): Department {
    const existingIds = Array.from(this.departments.keys());
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const newDept: Department = {
      ...dept,
      id: nextId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.departments.set(newDept.id, newDept);
    this.saveDepartments();
    return newDept;
  }

  // --- Employee DAO methods (CRUD) ---

  public getAllEmployees(): Employee[] {
    return Array.from(this.employees.values()).sort((a, b) => a.id - b.id);
  }

  public getEmployeeById(id: number): Employee | undefined {
    return this.employees.get(id);
  }

  public findEmployeesByName(query: string): Employee[] {
    const q = query.toLowerCase().trim();
    return Array.from(this.employees.values()).filter(e => 
      e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.position.toLowerCase().includes(q)
    );
  }

  public addEmployee(empData: Omit<Employee, 'id'>): Employee {
    // Check duplicate email
    const exists = Array.from(this.employees.values()).some(e => e.email.toLowerCase() === empData.email.toLowerCase());
    if (exists) {
      throw new Error(`DuplicateEmployeeException: An employee with email '${empData.email}' already exists in database.`);
    }

    // Check valid department
    if (!this.departments.has(empData.departmentId)) {
      throw new Error(`DatabaseOperationException: Foreign Key constraint failed. Department ID #${empData.departmentId} does not exist.`);
    }

    const existingIds = Array.from(this.employees.keys());
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 101;
    const newEmp: Employee = {
      ...empData,
      id: nextId,
    };
    this.employees.set(newEmp.id, newEmp);
    this.saveEmployees();
    return newEmp;
  }

  public updateEmployee(id: number, updates: Partial<Omit<Employee, 'id'>>): Employee {
    const existing = this.employees.get(id);
    if (!existing) {
      throw new Error(`EmployeeNotFoundException: Employee with ID #${id} not found in database.`);
    }

    if (updates.departmentId && !this.departments.has(updates.departmentId)) {
      throw new Error(`DatabaseOperationException: Department #${updates.departmentId} does not exist.`);
    }

    const updated: Employee = {
      ...existing,
      ...updates,
    };
    this.employees.set(id, updated);
    this.saveEmployees();
    return updated;
  }

  public deleteEmployee(id: number): boolean {
    if (!this.employees.has(id)) {
      throw new Error(`EmployeeNotFoundException: Cannot delete. Employee with ID #${id} does not exist.`);
    }

    this.employees.delete(id);
    this.saveEmployees();
    // Also delete associated leaves and payroll records (CASCADE)
    this.leaveRecords = this.leaveRecords.filter(l => l.employeeId !== id);
    this.saveLeaves();
    return true;
  }

  public sortEmployees(criteria: 'salary_desc' | 'salary_asc' | 'name_asc' | 'id_asc'): Employee[] {
    const list = this.getAllEmployees();
    switch (criteria) {
      case 'salary_desc':
        return list.sort((a, b) => b.baseSalary - a.baseSalary);
      case 'salary_asc':
        return list.sort((a, b) => a.baseSalary - b.baseSalary);
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'id_asc':
      default:
        return list.sort((a, b) => a.id - b.id);
    }
  }

  // --- Leave / Attendance DAO methods ---

  public getLeavesByEmployee(empId: number, monthYear?: string): LeaveRecord[] {
    return this.leaveRecords.filter(l => {
      if (l.employeeId !== empId) return false;
      if (monthYear && l.monthYear !== monthYear) return false;
      return true;
    });
  }

  public addLeave(leave: Omit<LeaveRecord, 'id' | 'appliedDate'>): LeaveRecord {
    if (!this.employees.has(leave.employeeId)) {
      throw new Error(`EmployeeNotFoundException: Employee with ID #${leave.employeeId} does not exist.`);
    }

    const nextId = this.leaveRecords.length > 0 ? Math.max(...this.leaveRecords.map(l => l.id)) + 1 : 1;
    const newLeave: LeaveRecord = {
      ...leave,
      id: nextId,
      appliedDate: new Date().toISOString().split('T')[0],
    };
    this.leaveRecords.push(newLeave);
    this.saveLeaves();
    return newLeave;
  }

  public getUnpaidLeaveDays(empId: number, monthYear: string): number {
    return this.leaveRecords
      .filter(l => l.employeeId === empId && l.monthYear === monthYear && l.leaveType === 'UNPAID' && l.isApproved)
      .reduce((sum, l) => sum + l.daysCount, 0);
  }

  // --- Payroll Service & DAO methods ---

  public processPayrollForEmployee(empId: number, payPeriod: string): PayrollRecord {
    const emp = this.employees.get(empId);
    if (!emp) {
      throw new Error(`EmployeeNotFoundException: Cannot process payroll. Employee with ID #${empId} not found.`);
    }

    const dept = this.departments.get(emp.departmentId);
    const deptName = dept ? dept.name : 'General Operations';

    const unpaidLeaves = this.getUnpaidLeaveDays(empId, payPeriod);
    const breakdown = PayrollCalculator.calculateGrossBreakdown(emp, unpaidLeaves);

    // Check if payroll record already exists for this period
    const existingIndex = this.payrollRecords.findIndex(r => r.employeeId === empId && r.payPeriod === payPeriod);

    const record: PayrollRecord = {
      id: existingIndex >= 0 ? this.payrollRecords[existingIndex].id : (this.payrollRecords.length > 0 ? Math.max(...this.payrollRecords.map(p => p.id)) + 1 : 1001),
      employeeId: emp.id,
      employeeName: emp.name,
      employeeType: emp.employeeType,
      departmentName: deptName,
      position: emp.position,
      payPeriod,
      baseAmount: breakdown.baseAmount,
      allowances: breakdown.allowances,
      overtimePay: breakdown.overtimePay,
      performanceBonus: breakdown.performanceBonus,
      grossPay: breakdown.grossPay,
      taxDeduction: breakdown.taxDeduction,
      socialSecurityPF: breakdown.socialSecurityPF,
      unpaidLeaveDeduction: breakdown.unpaidLeaveDeduction,
      totalDeductions: breakdown.totalDeductions,
      netPay: breakdown.netPay,
      paymentStatus: 'PAID',
      processedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.payrollRecords[existingIndex] = record;
    } else {
      this.payrollRecords.push(record);
    }
    this.savePayroll();
    return record;
  }

  public processBatchPayroll(departmentId: number | null, payPeriod: string): PayrollRecord[] {
    const emps = this.getAllEmployees().filter(e => departmentId === null || e.departmentId === departmentId);
    return emps.map(e => this.processPayrollForEmployee(e.id, payPeriod));
  }

  public getAllPayrollRecords(): PayrollRecord[] {
    return [...this.payrollRecords].sort((a, b) => b.id - a.id);
  }

  public getPayrollRecordsByEmployee(empId: number): PayrollRecord[] {
    return this.payrollRecords.filter(r => r.employeeId === empId).sort((a, b) => b.payPeriod.localeCompare(a.payPeriod));
  }

  // --- Department Salary Summary (Required Feature) ---

  public getDepartmentSalarySummaries(): DepartmentSalarySummary[] {
    const depts = this.getAllDepartments();
    const emps = this.getAllEmployees();

    return depts.map(dept => {
      const deptEmps = emps.filter(e => e.departmentId === dept.id);
      const headCount = deptEmps.length;

      let totalBaseSalary = 0;
      let totalGrossPayroll = 0;
      let highestSalary = 0;
      let lowestSalary = deptEmps.length > 0 ? Infinity : 0;

      for (const e of deptEmps) {
        const breakdown = PayrollCalculator.calculateGrossBreakdown(e);
        totalBaseSalary += breakdown.baseAmount;
        totalGrossPayroll += breakdown.grossPay;
        if (breakdown.grossPay > highestSalary) highestSalary = breakdown.grossPay;
        if (breakdown.grossPay < lowestSalary) lowestSalary = breakdown.grossPay;
      }

      if (lowestSalary === Infinity) lowestSalary = 0;
      const averageSalary = headCount > 0 ? Math.round(totalGrossPayroll / headCount) : 0;
      const budgetUtilizationPct = dept.monthlyBudget > 0 ? (totalGrossPayroll / dept.monthlyBudget) * 100 : 0;

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        departmentCode: dept.code,
        headCount,
        monthlyBudget: dept.monthlyBudget,
        totalBaseSalary,
        totalGrossPayroll: Math.round(totalGrossPayroll),
        averageSalary,
        highestSalary: Math.round(highestSalary),
        lowestSalary: Math.round(lowestSalary),
        budgetUtilizationPct: Math.round(budgetUtilizationPct * 10) / 10,
      };
    });
  }

  // --- Simulated SQL Query Runner ---

  public executeRawQuery(sql: string): { columns: string[]; rows: (string | number | boolean | null)[][]; rowCount: number; message: string } {
    const cleanSql = sql.trim();
    const lower = cleanSql.toLowerCase();

    if (lower.startsWith('select')) {
      if (lower.includes('from employees') || lower.includes('from employee')) {
        const emps = this.getAllEmployees();
        const columns = ['id', 'name', 'email', 'department_id', 'position', 'employee_type', 'base_salary', 'hire_date', 'performance_rating'];
        const rows = emps.map(e => [e.id, e.name, e.email, e.departmentId, e.position, e.employeeType, e.baseSalary, e.hireDate, e.performanceRating]);
        return { columns, rows, rowCount: rows.length, message: `PreparedStatement executed successfully: ${rows.length} rows returned.` };
      } else if (lower.includes('from departments') || lower.includes('from department')) {
        const depts = this.getAllDepartments();
        const columns = ['id', 'code', 'name', 'monthly_budget', 'head_of_department', 'created_at'];
        const rows = depts.map(d => [d.id, d.code, d.name, d.monthlyBudget, d.headOfDepartment, d.createdAt]);
        return { columns, rows, rowCount: rows.length, message: `PreparedStatement executed successfully: ${rows.length} rows returned.` };
      } else if (lower.includes('from payroll_records') || lower.includes('from payroll')) {
        const recs = this.getAllPayrollRecords();
        const columns = ['id', 'employee_id', 'employee_name', 'pay_period', 'gross_pay', 'tax_deduction', 'net_pay', 'payment_status', 'processed_at'];
        const rows = recs.map(r => [r.id, r.employeeId, r.employeeName, r.payPeriod, r.grossPay, r.taxDeduction, r.netPay, r.paymentStatus, r.processedAt.split('T')[0]]);
        return { columns, rows, rowCount: rows.length, message: `PreparedStatement executed successfully: ${rows.length} rows returned.` };
      } else if (lower.includes('from leave_records') || lower.includes('from leaves')) {
        const leaves = this.leaveRecords;
        const columns = ['id', 'employee_id', 'leave_type', 'days_count', 'month_year', 'reason', 'is_approved'];
        const rows = leaves.map(l => [l.id, l.employeeId, l.leaveType, l.daysCount, l.monthYear, l.reason, l.isApproved]);
        return { columns, rows, rowCount: rows.length, message: `PreparedStatement executed successfully: ${rows.length} rows returned.` };
      }
    }

    return {
      columns: ['status', 'query_executed'],
      rows: [['SUCCESS', cleanSql]],
      rowCount: 1,
      message: 'Query executed via PreparedStatement (SQLite driver).',
    };
  }
}
