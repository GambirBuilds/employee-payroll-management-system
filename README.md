# 💼 Employee & Payroll Management System

A comprehensive **Employee & Payroll Management System** built with **React, TypeScript, and Vite** as an interactive frontend for a Core Java payroll application.

The project demonstrates real-world **Object-Oriented Programming (OOP), Collections Framework, JDBC/DAO architecture, payroll processing, employee management, leave tracking, exception handling, and database concepts** through an interactive web-based interface.

---

## 📌 Project Overview

The **Employee & Payroll Management System** is designed to manage employee information, departments, leave records, payroll calculations, and salary information.

The application provides an interactive interface where users can explore the underlying Java payroll architecture, inspect source files, view database records, understand OOP relationships, and generate payroll-related outputs.

The project is particularly suitable for demonstrating **Core Java programming concepts and software architecture** in an academic or portfolio environment.

---

## ✨ Key Features

### 👨‍💼 Employee Management

* View employee records
* Search employees by:

  * Name
  * Email
  * Position
* Add new employees
* Update employee information
* Delete employees
* Validate duplicate employee emails
* Validate department relationships
* Sort employees by:

  * Salary — Ascending
  * Salary — Descending
  * Name
  * Employee ID

### 💰 Payroll Management

The system supports payroll processing for multiple employee types:

* Full-Time Employees
* Part-Time Employees
* Contractors

Payroll calculations include:

* Base salary/pay
* Housing allowance
* Health allowance
* Overtime compensation
* Performance bonuses
* Income tax
* Provident Fund / social security contribution
* Unpaid leave deductions
* Total deductions
* Net salary

### 📊 Performance-Based Bonuses

Employee performance ratings from **1–5** can affect payroll bonuses.

| Rating | Bonus |
| ------ | ----: |
| ⭐ 5    |   25% |
| ⭐ 4    |   18% |
| ⭐ 3    |   10% |
| ⭐ 2    |    5% |
| ⭐ 1    |    0% |

### 🏢 Department Management

Departments contain:

* Department ID
* Department code
* Department name
* Monthly budget
* Head of Department
* Creation date

The system also supports department salary summaries and budget utilization calculations.

### 🏖️ Leave & Attendance

The application tracks employee leave records, including:

* Paid annual leave
* Sick leave
* Unpaid leave
* Number of leave days
* Reason
* Approval status
* Application date

Unpaid leave can affect the employee's final payroll calculation.

### 🧾 Payslip Generation

The system can generate formatted ASCII-style payslips containing:

* Employee information
* Department
* Employment type
* Pay period
* Earnings
* Allowances
* Overtime
* Performance bonus
* Tax deductions
* Provident Fund
* Unpaid leave deductions
* Gross salary
* Net salary

### 🧩 OOP Architecture

The Java project demonstrates the four major OOP principles:

* **Abstraction**
* **Encapsulation**
* **Inheritance**
* **Polymorphism**

The employee hierarchy includes:

```text
                 Payable
                    │
                    ▼
              Employee
             (Abstract)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
 FullTimeEmployee  PartTimeEmployee  ContractorEmployee
```

### 🗃️ Collections Framework

The project demonstrates common Java Collections concepts such as:

* `ArrayList`
* `HashMap`
* `Map`
* `Comparator`
* Collection sorting
* Employee lookup and caching

### 🛢️ JDBC & DAO Architecture

The project demonstrates a database-oriented architecture using:

* JDBC
* DAO Pattern
* Prepared Statements
* Database operations
* CRUD operations
* Resource management
* Externalized configuration

### ⚠️ Exception Handling

The system includes domain-specific exception concepts such as:

* `EmployeeNotFoundException`
* `DuplicateEmployeeException`
* `DatabaseOperationException`
* Validation errors
* Foreign-key validation

### 📦 Java Source Export

The application includes an interactive **Code Explorer** that allows users to inspect the Java project source code.

The project can also package/export the demonstrated Java source files as a ZIP archive.

---

# 🛠️ Technologies Used

## Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Motion**

## Java Concepts Demonstrated

* Core Java
* OOP
* Abstract Classes
* Interfaces
* Inheritance
* Polymorphism
* Encapsulation
* Collections Framework
* Exception Handling
* JDBC
* DAO Pattern
* Service Layer
* Payroll Algorithms
* File Export

## Data & Persistence

The interactive frontend uses browser `localStorage` for its demonstration data layer.

The embedded Java architecture demonstrates how the application can be structured around JDBC and DAO-based persistence.

---

# 🏗️ System Architecture

The project follows a layered architecture concept:

```text
┌──────────────────────────────────────────────┐
│                 User Interface               │
│              React + TypeScript              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Application Services            │
│          Payroll Logic / Business Rules      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                Domain Models                 │
│ Employee | Department | Payroll | Leave      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Data Access Layer               │
│              DAO / JDBC Concepts             │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  Database                   │
│       Relational Persistence Concept         │
└──────────────────────────────────────────────┘
```

---

# 📂 Project Structure

```text
employee-and-payroll-management-system/
│
├── src/
│   ├── components/
│   │   ├── ArchitectureView.tsx
│   │   ├── CodeExplorer.tsx
│   │   ├── DatabaseViewer.tsx
│   │   ├── ExportModal.tsx
│   │   ├── RubricChecklistView.tsx
│   │   ├── TerminalView.tsx
│   │   └── TopBar.tsx
│   │
│   ├── data/
│   │   └── javaSourceFiles.ts
│   │
│   ├── services/
│   │   ├── payrollDatabase.ts
│   │   ├── payrollLogic.ts
│   │   └── zipExporter.ts
│   │
│   ├── types/
│   │   └── payroll.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── bun.lock
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* **Node.js 18+**
* npm, Bun, or another compatible package manager
* Git

Check your Node.js version:

```bash
node --version
```

---

## 📥 Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/employee-and-payroll-management-system.git
```

Move into the project directory:

```bash
cd employee-and-payroll-management-system
```

---

## 📦 Install Dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

---

## ▶️ Run the Development Server

Using npm:

```bash
npm run dev
```

Or:

```bash
bun run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 🏭 Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🔍 Type Checking

The project includes a TypeScript checking script:

```bash
npm run lint
```

This runs:

```bash
tsc --noEmit
```

---

# 💵 Payroll Calculation Logic

The payroll engine supports different calculations depending on employee type.

## Full-Time Employee

The gross salary can include:

```text
Base Salary
+ Housing Allowance
+ Health Allowance
+ Performance Bonus
= Gross Pay
```

Deductions can include:

```text
Income Tax
+ Provident Fund
+ Unpaid Leave Deduction
= Total Deductions
```

Then:

```text
Net Pay = Gross Pay - Total Deductions
```

---

## Part-Time Employee

Part-time employees are paid according to their working hours.

Regular hours are calculated up to **160 hours per month**.

Hours beyond 160 are treated as overtime:

```text
Overtime Pay = Overtime Hours × Overtime Hourly Rate
```

The default overtime rate is based on **1.5× the hourly rate**.

---

## Contractor

Contractors receive a fixed monthly retainer.

The system applies a withholding tax rate to the calculated gross pay.

---

# 📈 Progressive Income Tax

The payroll calculator demonstrates a progressive income-tax model:

| Monthly Gross Pay | Tax Calculation      |
| ----------------- | -------------------- |
| Up to $2,500      | 5%                   |
| $2,501 – $5,000   | 5% + 12%             |
| $5,001 – $10,000  | 5% + 12% + 20%       |
| Above $10,000     | 5% + 12% + 20% + 28% |

> **Note:** These rates are implemented as demonstration logic for the project and should not be treated as actual tax advice or a representation of a specific country's current tax system.

---

# 🧠 OOP Concepts

## Abstraction

The Java implementation uses an abstract `Employee` class and the `Payable` interface.

```java
public abstract class Employee implements Payable
```

The `Payable` interface defines common payroll operations:

```java
double calculateGrossPay();

double calculateNetPay(int unpaidLeaveDays);

String getCompensationSummary();
```

---

## Encapsulation

Employee properties are maintained using private fields with public getters and setters.

```java
private double baseSalary;

public double getBaseSalary() {
    return baseSalary;
}

public void setBaseSalary(double baseSalary) {
    this.baseSalary = baseSalary;
}
```

---

## Inheritance

Specialized employee classes inherit from the base `Employee` class:

```java
public class FullTimeEmployee extends Employee
```

```java
public class PartTimeEmployee extends Employee
```

```java
public class ContractorEmployee extends Employee
```

---

## Polymorphism

Each employee type implements payroll calculations differently.

For example:

```java
employee.calculateGrossPay();
```

can execute different implementations depending on whether the employee is:

* Full-time
* Part-time
* Contractor

---

# 🗄️ DAO Pattern

The project demonstrates the **Data Access Object (DAO)** design pattern to separate database operations from business logic.

Conceptually:

```text
UI
 │
 ▼
Service Layer
 │
 ▼
DAO Layer
 │
 ▼
Database
```

This separation improves:

* Maintainability
* Testability
* Code organization
* Database abstraction
* Separation of concerns

---

# 📊 Database Entities

The core domain model contains entities such as:

```text
Department
    │
    └── Employee
           │
           ├── PayrollRecord
           │
           └── LeaveRecord
```

### Employee

Stores employee information and employment details.

### Department

Stores department information and budget data.

### PayrollRecord

Stores processed payroll and payslip information.

### LeaveRecord

Stores employee leave and attendance information.

---

# 🖥️ Application Views

The frontend includes several interactive views.

### 🖥️ Terminal View

Provides a terminal-style interface for demonstrating the Java application's behavior and output.

### 🧑‍💻 Code Explorer

Allows users to explore the Java source-code architecture directly from the application.

### 🗃️ Database Viewer

Displays employee, department, leave, and payroll information.

### 🏛️ Architecture View

Provides a visual representation of:

* OOP class hierarchy
* Collections Framework
* JDBC & DAO Pattern
* Exception hierarchy

### 📋 Rubric Checklist

Provides an overview of the major technical requirements demonstrated by the project.

### 📦 Export

Allows the demonstrated Java project source files to be packaged for export.

---

# 🎓 Academic Purpose

This project demonstrates several important software-development and programming concepts:

* Object-Oriented Programming
* Software architecture
* Data modelling
* CRUD operations
* Collections
* Exception handling
* Database connectivity
* DAO design pattern
* Payroll algorithms
* Employee management
* Leave management
* Separation of concerns

It can be used as a practical demonstration of **Core Java and enterprise application development concepts**.

---

# 🔐 Environment Variables

The project includes an `.env.example` file.

Example:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="YOUR_APP_URL"
```


---

# 🧪 Example Payroll Flow

```text
Employee
   │
   ▼
Employee Type
   │
   ├── Full-Time
   │      ├── Base Salary
   │      ├── Allowances
   │      └── Performance Bonus
   │
   ├── Part-Time
   │      ├── Regular Hours
   │      ├── Overtime
   │      └── Performance Bonus
   │
   └── Contractor
          ├── Monthly Retainer
          └── Performance Bonus
   │
   ▼
Gross Pay
   │
   ▼
Deductions
   ├── Income Tax
   ├── Provident Fund
   └── Unpaid Leave
   │
   ▼
Net Pay
   │
   ▼
Payslip
```

---

# 📸 Screenshots

<img width="1600" height="756" alt="WhatsApp Image 2026-09-28 at 14 01 23" src="https://github.com/user-attachments/assets/43a7e73e-9598-439e-8f98-72c52a51b04a" />

<img width="1600" height="696" alt="WhatsApp Image 2026-09-28 at 14 02 01" src="https://github.com/user-attachments/assets/baa7f870-56cd-46d5-bd65-9f49c3c7a043" />

<img width="1600" height="762" alt="WhatsApp Image 2026-09-28 at 14 02 21" src="https://github.com/user-attachments/assets/fbea85cf-5280-495c-9577-822b78a2b9ec" />

```

# 🔮 Future Improvements

Possible future enhancements include:

* [ ] Real relational database integration
* [ ] MySQL/PostgreSQL support
* [ ] Authentication and role-based access
* [ ] Admin dashboard
* [ ] Employee self-service portal
* [ ] Automated monthly payroll processing
* [ ] PDF payslip generation
* [ ] Email payslip delivery
* [ ] Advanced attendance tracking
* [ ] Payroll reports and analytics
* [ ] Automated unit and integration testing
* [ ] Cloud deployment
* [ ] REST API integration
* [ ] Audit logs
* [ ] Multi-currency support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes:

```bash
git commit -m "Add: your feature"
```

5. Push the branch:

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

# 🐛 Issues

If you discover a bug or have a feature request, please open an issue in the GitHub repository with:

* A clear description
* Steps to reproduce the issue
* Expected behavior
* Actual behavior
* Screenshots, if applicable

---

# 📄 License

This project is intended primarily for **educational and portfolio purposes**.

If you plan to distribute or reuse the project commercially, add an appropriate open-source license such as MIT, Apache-2.0, or GPL-3.0.

---

# 👨‍💻 Author

**Your Name**

GitHub: `https://github.com/GambirBuilds`

---

## ⭐ Support

If you find this project useful for learning about **Java, OOP, payroll systems, database architecture, or React**, consider giving the repository a ⭐ on GitHub.

---

<div align="center">

### 💼 Employee & Payroll Management System

**Built with React • TypeScript • Vite • Core Java Concepts**

</div>
