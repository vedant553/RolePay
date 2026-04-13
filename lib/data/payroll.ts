export type StepStatus = "done" | "active" | "pending";

export interface PayrollStep {
  label: string;
  time?: string;
  status: StepStatus;
}

export interface FinancialBreakdown {
  label: string;
  value: string;
  color: string;
}

export interface ApprovalWorkflowItem {
  name: string;
  role: string;
  status: "approved" | "pending" | "rejected";
  timestamp?: string;
}

export interface DisbursementTransaction {
  id: string;
  employee: string;
  bank: string;
  amount: string;
  status: "processed" | "pending" | "failed";
  timestamp: string;
}

export interface PayrollEntity {
  entity: string;
  country: string;
  employees: number;
  grossPayroll: string;
  netPayroll: string;
  status: "ready" | "processing" | "review" | "approved";
  riskLevel: "low" | "medium" | "high";
}

export const payrollSteps: PayrollStep[] = [
  { label: "Data Collection", time: "Mar 01", status: "done" },
  { label: "Calculation & Validation", time: "Mar 08", status: "done" },
  { label: "Compliance Check", time: "Mar 15", status: "active" },
  { label: "Approval & Disbursement", time: "Mar 28", status: "pending" },
];

export const currentCycle = {
  period: "March 2026",
  status: "In Progress",
  entitiesCount: 4,
  employeesCount: 1248,
  totalGross: "$565,240.00",
  activeHeadcount: 1248,
  taxCompliance: "100%",
  manualOverrides: 12,
};

export const financialBreakdown: FinancialBreakdown[] = [
  { label: "Gross Payroll", value: "$565,240", color: "#10b981" },
  { label: "Tax Withholdings", value: "$84,786", color: "#3b82f6" },
  { label: "Benefits Deductions", value: "$32,450", color: "#8b5cf6" },
  { label: "Net Disbursement", value: "$448,004", color: "#0f172b" },
];

export const payrollEntities: PayrollEntity[] = [
  {
    entity: "SAASA Inc.",
    country: "USA",
    employees: 412,
    grossPayroll: "$218,400",
    netPayroll: "$174,720",
    status: "approved",
    riskLevel: "low",
  },
  {
    entity: "SAASA India Pvt Ltd",
    country: "India",
    employees: 368,
    grossPayroll: "$89,200",
    netPayroll: "$74,928",
    status: "processing",
    riskLevel: "medium",
  },
  {
    entity: "SAASA GmbH",
    country: "Germany",
    employees: 214,
    grossPayroll: "$158,640",
    netPayroll: "$111,048",
    status: "review",
    riskLevel: "high",
  },
  {
    entity: "SAASA Asia Pte Ltd",
    country: "Singapore",
    employees: 254,
    grossPayroll: "$99,000",
    netPayroll: "$85,140",
    status: "ready",
    riskLevel: "low",
  },
];

export const approvalWorkflow: ApprovalWorkflowItem[] = [
  { name: "Alice Mercer", role: "Finance Controller", status: "approved", timestamp: "Mar 14, 09:22 AM" },
  { name: "John Patel", role: "Regional HR Director", status: "approved", timestamp: "Mar 14, 11:45 AM" },
  { name: "Alex Sterling", role: "Head of Payroll", status: "pending" },
  { name: "Diana Reyes", role: "CFO", status: "pending" },
];

export const disbursementTransactions: DisbursementTransaction[] = [
  { id: "TXN-8801", employee: "Sarah Johnson", bank: "Chase Bank", amount: "$12,083.33", status: "processed", timestamp: "Mar 28, 10:00 AM" },
  { id: "TXN-8802", employee: "Marcus Chen", bank: "DBS Bank", amount: "$7,666.67", status: "processed", timestamp: "Mar 28, 10:01 AM" },
  { id: "TXN-8803", employee: "Elena Rodriguez", bank: "Santander", amount: "€4,833.33", status: "pending", timestamp: "Mar 28, 10:02 AM" },
  { id: "TXN-8804", employee: "James Mitchell", bank: "Barclays", amount: "£9,833.33", status: "processed", timestamp: "Mar 28, 10:03 AM" },
  { id: "TXN-8805", employee: "Priya Sharma", bank: "HDFC Bank", amount: "₹400,000", status: "processed", timestamp: "Mar 28, 10:04 AM" },
  { id: "TXN-8806", employee: "Thomas Weber", bank: "Deutsche Bank", amount: "€6,000.00", status: "failed", timestamp: "Mar 28, 10:05 AM" },
];

export const monthlyPayrollData = [
  { month: "Oct", planned: 540, actual: 535 },
  { month: "Nov", planned: 520, actual: 518 },
  { month: "Dec", planned: 580, actual: 575 },
  { month: "Jan", planned: 550, actual: 548 },
  { month: "Feb", planned: 560, actual: 558 },
  { month: "Mar", planned: 570, actual: 565 },
];
