import { Department, DepartmentSalarySummary, Employee, LeaveRecord, PayrollRecord } from '../types/payroll';

/**
 * Business logic that mirrors com.payroll.service.PayrollService in Java
 */
export class PayrollCalculator {
  // Bonus multiplier based on performance rating (1 to 5)
  public static getPerformanceBonusMultiplier(rating: number): number {
    switch (rating) {
      case 5: return 0.25; // 25% bonus
      case 4: return 0.18; // 18% bonus
      case 3: return 0.10; // 10% bonus
      case 2: return 0.05; // 5% bonus
      case 1:
      default: return 0.00; // 0%
    }
  }

  // Progressive tax calculation on gross pay
  public static calculateIncomeTax(grossMonthly: number): number {
    if (grossMonthly <= 2500) {
      return grossMonthly * 0.05; // 5% bracket
    } else if (grossMonthly <= 5000) {
      return 2500 * 0.05 + (grossMonthly - 2500) * 0.12; // 12% bracket
    } else if (grossMonthly <= 10000) {
      return 2500 * 0.05 + 2500 * 0.12 + (grossMonthly - 5000) * 0.20; // 20% bracket
    } else {
      return 2500 * 0.05 + 2500 * 0.12 + 5000 * 0.20 + (grossMonthly - 10000) * 0.28; // 28% bracket
    }
  }

  // Calculate gross pay polymorphically based on employee subtype
  public static calculateGrossBreakdown(
    employee: Employee,
    unpaidLeaveDays: number = 0
  ): {
    baseAmount: number;
    allowances: number;
    overtimePay: number;
    performanceBonus: number;
    grossPay: number;
    unpaidLeaveDeduction: number;
    taxDeduction: number;
    socialSecurityPF: number;
    totalDeductions: number;
    netPay: number;
  } {
    let baseAmount = 0;
    let allowances = 0;
    let overtimePay = 0;

    if (employee.employeeType === 'FULL_TIME') {
      baseAmount = employee.baseSalary;
      const hra = employee.housingAllowance ?? baseAmount * 0.15;
      const med = employee.healthAllowance ?? 350;
      allowances = hra + med;
    } else if (employee.employeeType === 'PART_TIME') {
      const hours = employee.hoursWorkedMonthly ?? 160;
      const regularHours = Math.min(hours, 160);
      const overtimeHours = Math.max(0, hours - 160);
      const regularPay = regularHours * employee.baseSalary;
      const otRate = employee.overtimeHourlyRate ?? (employee.baseSalary * 1.5);
      overtimePay = overtimeHours * otRate;
      baseAmount = regularPay;
      allowances = 0;
    } else if (employee.employeeType === 'CONTRACTOR') {
      baseAmount = employee.baseSalary;
      allowances = 0; // Contractors have fixed retainer
    }

    // Performance bonus on base pay
    const bonusRate = this.getPerformanceBonusMultiplier(employee.performanceRating || 3);
    const performanceBonus = Math.round(baseAmount * bonusRate * 100) / 100;

    const grossPay = Math.round((baseAmount + allowances + overtimePay + performanceBonus) * 100) / 100;

    // Unpaid leave deduction (22 working days standard)
    const dailyBaseRate = employee.employeeType === 'FULL_TIME' ? baseAmount / 22 : (employee.baseSalary * 8);
    const unpaidLeaveDeduction = Math.round(unpaidLeaveDays * dailyBaseRate * 100) / 100;

    // Taxes & statutory deductions
    let taxDeduction = 0;
    let socialSecurityPF = 0;

    if (employee.employeeType === 'CONTRACTOR') {
      const withholdingRate = employee.withholdingTaxRate ?? 0.10;
      taxDeduction = Math.round(grossPay * withholdingRate * 100) / 100;
      socialSecurityPF = 0; // Contractors manage their own social security
    } else {
      taxDeduction = Math.round(this.calculateIncomeTax(grossPay) * 100) / 100;
      socialSecurityPF = Math.round(baseAmount * 0.06 * 100) / 100; // 6% Provident Fund / Pension
    }

    const totalDeductions = Math.round((taxDeduction + socialSecurityPF + unpaidLeaveDeduction) * 100) / 100;
    const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100);

    return {
      baseAmount,
      allowances,
      overtimePay,
      performanceBonus,
      grossPay,
      unpaidLeaveDeduction,
      taxDeduction,
      socialSecurityPF,
      totalDeductions,
      netPay,
    };
  }

  // Generates ASCII payslip as produced by Java terminal output
  public static generateAsciiPayslip(
    record: PayrollRecord,
    departmentCode: string = 'ENG'
  ): string {
    const pad = (s: string | number, len: number, right = false) => {
      const str = String(s);
      if (str.length >= len) return str.slice(0, len);
      return right ? ' '.repeat(len - str.length) + str : str + ' '.repeat(len - str.length);
    };

    const currency = (num: number) => `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const width = 68;
    const border = '='.repeat(width);
    const dashBorder = '-'.repeat(width);

    return [
      border,
      `                    ACME ENTERPRISE CORP                    `,
      `                MONTHLY EMPLOYEE PAYSLIP                    `,
      `               PAY PERIOD: ${record.payPeriod} | STATUS: ${record.paymentStatus}               `,
      border,
      ` Employee ID    : #${pad(record.employeeId, 8)} Department   : ${pad(record.departmentName + ' (' + departmentCode + ')', 20)}`,
      ` Employee Name  : ${pad(record.employeeName, 18)} Position     : ${pad(record.position, 20)}`,
      ` Employment Type: ${pad(record.employeeType, 18)} Generated At : ${pad(record.processedAt.split('T')[0], 20)}`,
      dashBorder,
      ` EARNINGS & ALLOWANCES                    DEDUCTIONS & WITHHOLDINGS  `,
      dashBorder,
      ` Base Salary / Pay     : ${pad(currency(record.baseAmount), 11, true)}  | Income Tax (PAYE)     : ${pad(currency(record.taxDeduction), 11, true)}`,
      ` Allowances (HRA/Med)  : ${pad(currency(record.allowances), 11, true)}  | Provident Fund / 401k : ${pad(currency(record.socialSecurityPF), 11, true)}`,
      ` Overtime Compensation : ${pad(currency(record.overtimePay), 11, true)}  | Unpaid Leave Penalty  : ${pad(currency(record.unpaidLeaveDeduction), 11, true)}`,
      ` Performance Bonus     : ${pad(currency(record.performanceBonus), 11, true)}  |                           `,
      dashBorder,
      ` TOTAL GROSS EARNINGS  : ${pad(currency(record.grossPay), 11, true)}  | TOTAL DEDUCTIONS      : ${pad(currency(record.totalDeductions), 11, true)}`,
      dashBorder,
      ` NET TAKE-HOME PAY     : ${pad(currency(record.netPay), 16, true)} [CLEARED FOR DIRECT DEPOSIT]`,
      border,
      ` * This is a computer-generated payslip produced via Core Java JDBC  *`,
      ` * Architecture: com.payroll.service.PayrollService (JDK 17)          *`,
      border,
    ].join('\n');
  }

  // Generates ASCII table for Employee Directory
  public static generateAsciiEmployeeTable(
    employees: Employee[],
    departmentsMap: Map<number, Department>
  ): string {
    if (employees.length === 0) {
      return '(No employee records found in database)';
    }

    const pad = (s: string | number, len: number, right = false) => {
      const str = String(s);
      if (str.length >= len) return str.slice(0, len);
      return right ? ' '.repeat(len - str.length) + str : str + ' '.repeat(len - str.length);
    };

    const header = `+------+----------------------+------------+-------------+----------------------+-----------+--------+`;
    const titles = `| ID   | Name                 | Type       | Dept        | Position             | Base Pay  | Rating |`;
    
    const rows = employees.map(emp => {
      const dept = departmentsMap.get(emp.departmentId);
      const deptName = dept ? dept.code : 'N/A';
      const payStr = `$${emp.baseSalary.toLocaleString()}${emp.employeeType === 'PART_TIME' ? '/hr' : '/mo'}`;
      const ratingStars = '★'.repeat(emp.performanceRating) + '☆'.repeat(5 - emp.performanceRating);
      return `| #${pad(emp.id, 4)} | ${pad(emp.name, 20)} | ${pad(emp.employeeType, 10)} | ${pad(deptName, 11)} | ${pad(emp.position, 20)} | ${pad(payStr, 9, true)} | ${pad(ratingStars, 6)} |`;
    });

    return [
      header,
      titles,
      header,
      ...rows,
      header,
      ` Total Employees: ${employees.length} records retrieved from SQLite database via PreparedStatement`,
    ].join('\n');
  }

  // Generates ASCII table for Department Salary Summaries
  public static generateAsciiDepartmentSummary(
    summaries: DepartmentSalarySummary[]
  ): string {
    const pad = (s: string | number, len: number, right = false) => {
      const str = String(s);
      if (str.length >= len) return str.slice(0, len);
      return right ? ' '.repeat(len - str.length) + str : str + ' '.repeat(len - str.length);
    };

    const currency = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const header = `+------+------------------------+-------+--------------+--------------+--------------+--------------+---------+`;
    const titles = `| Code | Department Name        | Staff | Mo. Budget   | Total Gross  | Avg. Salary  | Max Salary   | Util %  |`;

    const rows = summaries.map(s => {
      return `| ${pad(s.departmentCode, 4)} | ${pad(s.departmentName, 22)} | ${pad(s.headCount, 5, true)} | ${pad(currency(s.monthlyBudget), 12, true)} | ${pad(currency(s.totalGrossPayroll), 12, true)} | ${pad(currency(s.averageSalary), 12, true)} | ${pad(currency(s.highestSalary), 12, true)} | ${pad(s.budgetUtilizationPct.toFixed(1) + '%', 7, true)} |`;
    });

    const totalStaff = summaries.reduce((acc, curr) => acc + curr.headCount, 0);
    const totalPayroll = summaries.reduce((acc, curr) => acc + curr.totalGrossPayroll, 0);
    const totalBudget = summaries.reduce((acc, curr) => acc + curr.monthlyBudget, 0);

    return [
      header,
      titles,
      header,
      ...rows,
      header,
      ` TOTALS: ${totalStaff} staff across ${summaries.length} departments | Total Payroll: ${currency(totalPayroll)} / Total Budget: ${currency(totalBudget)} (${((totalPayroll / (totalBudget || 1)) * 100).toFixed(1)}% utilized)`,
    ].join('\n');
  }
}
