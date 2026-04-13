export interface ComplianceFiling {
  id: string;
  name: string;
  type: "EPF" | "ESIC" | "TDS" | "Professional Tax" | "Labour Welfare Fund" | "GST" | "PAYE" | "Social Security";
  country: string;
  dueDate: string;
  daysLeft: number;
  status: "Filed" | "Pending" | "Overdue" | "Automated";
  amount: string;
  entity: string;
  priority: "high" | "medium" | "low";
}

export interface ComplianceRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  jurisdictions: string[];
  status: "active" | "draft" | "paused";
  lastTriggered?: string;
}

export interface ComplianceMetric {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  icon: string;
}

export const complianceFilings: ComplianceFiling[] = [
  {
    id: "CF-001",
    name: "EPF Monthly Return",
    type: "EPF",
    country: "India",
    dueDate: "April 15, 2026",
    daysLeft: 3,
    status: "Pending",
    amount: "₹1,24,800",
    entity: "SAASA India Pvt Ltd",
    priority: "high",
  },
  {
    id: "CF-002",
    name: "ESIC Contribution",
    type: "ESIC",
    country: "India",
    dueDate: "April 15, 2026",
    daysLeft: 3,
    status: "Automated",
    amount: "₹32,400",
    entity: "SAASA India Pvt Ltd",
    priority: "high",
  },
  {
    id: "CF-003",
    name: "TDS Q4 Return",
    type: "TDS",
    country: "India",
    dueDate: "May 31, 2026",
    daysLeft: 47,
    status: "Filed",
    amount: "₹2,84,600",
    entity: "SAASA India Pvt Ltd",
    priority: "medium",
  },
  {
    id: "CF-004",
    name: "Professional Tax",
    type: "Professional Tax",
    country: "India",
    dueDate: "April 30, 2026",
    daysLeft: 18,
    status: "Automated",
    amount: "₹18,750",
    entity: "SAASA India Pvt Ltd",
    priority: "low",
  },
  {
    id: "CF-005",
    name: "Labour Welfare Fund",
    type: "Labour Welfare Fund",
    country: "India",
    dueDate: "June 15, 2026",
    daysLeft: 62,
    status: "Filed",
    amount: "₹4,200",
    entity: "SAASA India Pvt Ltd",
    priority: "low",
  },
  {
    id: "CF-006",
    name: "PAYE Monthly",
    type: "PAYE",
    country: "UK",
    dueDate: "April 19, 2026",
    daysLeft: 7,
    status: "Pending",
    amount: "£28,400",
    entity: "SAASA UK Ltd",
    priority: "high",
  },
  {
    id: "CF-007",
    name: "Federal Payroll Tax",
    type: "Social Security",
    country: "USA",
    dueDate: "April 30, 2026",
    daysLeft: 18,
    status: "Automated",
    amount: "$31,200",
    entity: "SAASA Inc.",
    priority: "medium",
  },
  {
    id: "CF-008",
    name: "Lohnsteuer (Wage Tax)",
    type: "TDS",
    country: "Germany",
    dueDate: "April 10, 2026",
    daysLeft: -2,
    status: "Overdue",
    amount: "€22,400",
    entity: "SAASA GmbH",
    priority: "high",
  },
];

export const complianceRules: ComplianceRule[] = [
  {
    id: "CR-001",
    name: "EPF Auto-Filing",
    trigger: "Payroll cycle completion",
    action: "Submit EPF return to EPFO portal",
    jurisdictions: ["India"],
    status: "active",
    lastTriggered: "Mar 15, 2026",
  },
  {
    id: "CR-002",
    name: "TDS Deduction Rule",
    trigger: "Salary above ₹5L/year",
    action: "Auto-deduct TDS per Income Tax slab",
    jurisdictions: ["India"],
    status: "active",
    lastTriggered: "Mar 31, 2026",
  },
  {
    id: "CR-003",
    name: "Overtime Threshold Alert",
    trigger: "Overtime > 15% of base",
    action: "Flag for manager review + compliance alert",
    jurisdictions: ["USA", "Germany", "UK"],
    status: "active",
    lastTriggered: "Mar 28, 2026",
  },
  {
    id: "CR-004",
    name: "PAYE Calculation",
    trigger: "UK payroll processing",
    action: "Apply HMRC PAYE tax codes",
    jurisdictions: ["UK"],
    status: "active",
    lastTriggered: "Mar 31, 2026",
  },
];

export const complianceMetrics: ComplianceMetric[] = [
  { label: "Overall Compliance Score", value: "94%", trend: "+2%", trendDirection: "up", icon: "shield" },
  { label: "Filings Due This Month", value: "8", trend: "-3", trendDirection: "down", icon: "file" },
  { label: "Automated Filings", value: "6", trend: "75%", icon: "zap" },
  { label: "Potential Penalties Avoided", value: "₹48,000", icon: "check" },
];

export const jurisdictionRisk = [
  { jurisdiction: "India", riskScore: 45, filingsPending: 2, automationRate: 85 },
  { jurisdiction: "Germany", riskScore: 62, filingsPending: 1, automationRate: 70 },
  { jurisdiction: "UK", riskScore: 28, filingsPending: 1, automationRate: 90 },
  { jurisdiction: "USA", riskScore: 18, filingsPending: 0, automationRate: 95 },
  { jurisdiction: "Singapore", riskScore: 8, filingsPending: 0, automationRate: 98 },
];
