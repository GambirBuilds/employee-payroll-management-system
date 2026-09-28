export type EmployeeType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';

export interface Department {
  id: number;
  code: string;
  name: string;
  monthlyBudget: number;
  headOfDepartment: string;
  createdAt: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  position: string;
  employeeType: EmployeeType;
  baseSalary: number; // For full-time: monthly base; part-time: hourly rate; contractor: fixed monthly retainer
  hireDate: string;
  performanceRating: number; // 1 to 5 stars
  // Subtype-specific fields
  healthAllowance?: number; // Full-time
  housingAllowance?: number; // Full-time
  hoursWorkedMonthly?: number; // Part-time
  overtimeHourlyRate?: number; // Part-time
  contractDurationMonths?: number; // Contractor
  withholdingTaxRate?: number; // Contractor
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeType: EmployeeType;
  departmentName: string;
  position: string;
  payPeriod: string; // e.g. "2026-09"
  baseAmount: number;
  allowances: number;
  overtimePay: number;
  performanceBonus: number;
  grossPay: number;
  taxDeduction: number;
  socialSecurityPF: number;
  unpaidLeaveDeduction: number;
  totalDeductions: number;
  netPay: number;
  paymentStatus: 'PAID' | 'PROCESSED' | 'PENDING';
  processedAt: string;
}

export interface LeaveRecord {
  id: number;
  employeeId: number;
  leaveType: 'PAID_ANNUAL' | 'SICK' | 'UNPAID';
  daysCount: number;
  monthYear: string; // e.g. "2026-09"
  reason: string;
  isApproved: boolean;
  appliedDate: string;
}

export interface DepartmentSalarySummary {
  departmentId: number;
  departmentName: string;
  departmentCode: string;
  headCount: number;
  monthlyBudget: number;
  totalBaseSalary: number;
  totalGrossPayroll: number;
  averageSalary: number;
  highestSalary: number;
  lowestSalary: number;
  budgetUtilizationPct: number;
}
