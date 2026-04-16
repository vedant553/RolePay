export type PayrollComplianceStatus = "Draft" | "Approved" | "Locked";
export type ComplianceSeverity = "Low" | "Medium" | "High";
export type ComplianceReportType = "Tax" | "PF" | "CNPS" | "Statutory";
export type ComplianceReportStatus = "Generated" | "Pending";
export type ComplianceModule = "Payroll" | "Employee";
export type ComplianceUserRole = "HR" | "Finance" | "System";
export type ComplianceRuleType = "Tax" | "Contribution" | "Deduction";
export type ComplianceCalculationType = "Percentage" | "Fixed Amount";
export type ComplianceRuleScope =
  | "All Employees"
  | "Specific Department"
  | "Specific Role";
export type ComplianceRuleStatus = "Active" | "Inactive";
export type ComplianceRuleSource = "Default" | "Custom";

export interface CountryComplianceRecord {
  country: string;
  employeesCovered: number;
  currencyCode: string;
  payrollStatus: PayrollComplianceStatus;
  lockedAt?: string;
}

export interface ComplianceRule {
  id: string;
  country: string;
  name: string;
  ruleType: ComplianceRuleType;
  calculationType: ComplianceCalculationType;
  value: number;
  appliesTo: ComplianceRuleScope;
  scopeValue?: string;
  effectiveFrom: string;
  status: ComplianceRuleStatus;
  source: ComplianceRuleSource;
}

export interface ComplianceReport {
  id: string;
  name: string;
  type: ComplianceReportType;
  month: string;
  year: string;
  country: string;
  department: string;
  status: ComplianceReportStatus;
}

export interface ComplianceAuditLog {
  id: string;
  country: string;
  action: string;
  module: ComplianceModule;
  userRole: ComplianceUserRole;
  timestamp: string;
  beforeValue: string;
  afterValue: string;
  reason: string;
}

export interface ComplianceAlert {
  id: string;
  country: string;
  severity: ComplianceSeverity;
  title: "Missing tax data" | "High deductions" | "Country mismatch";
  description: string;
  timestamp: string;
  reviewed: boolean;
}

export const complianceCountries: CountryComplianceRecord[] = [
  {
    country: "India",
    employeesCovered: 248,
    currencyCode: "INR",
    payrollStatus: "Approved",
  },
  {
    country: "South Africa",
    employeesCovered: 96,
    currencyCode: "ZAR",
    payrollStatus: "Draft",
  },
  {
    country: "UAE",
    employeesCovered: 64,
    currencyCode: "AED",
    payrollStatus: "Locked",
    lockedAt: "Apr 15, 2026, 10:30 AM",
  },
  {
    country: "Cameroon",
    employeesCovered: 52,
    currencyCode: "XAF",
    payrollStatus: "Draft",
  },
];

export const complianceRules: ComplianceRule[] = [
  {
    id: "RULE-IN-001",
    country: "India",
    name: "PF",
    ruleType: "Contribution",
    calculationType: "Percentage",
    value: 12,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-IN-002",
    country: "India",
    name: "TDS",
    ruleType: "Tax",
    calculationType: "Percentage",
    value: 10,
    appliesTo: "Specific Department",
    scopeValue: "Finance",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-IN-003",
    country: "India",
    name: "Professional Tax",
    ruleType: "Deduction",
    calculationType: "Fixed Amount",
    value: 200,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-ZA-001",
    country: "South Africa",
    name: "PAYE",
    ruleType: "Tax",
    calculationType: "Percentage",
    value: 18,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-ZA-002",
    country: "South Africa",
    name: "UIF",
    ruleType: "Contribution",
    calculationType: "Percentage",
    value: 1,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-ZA-003",
    country: "South Africa",
    name: "SDL",
    ruleType: "Contribution",
    calculationType: "Percentage",
    value: 1,
    appliesTo: "Specific Department",
    scopeValue: "Operations",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-AE-001",
    country: "UAE",
    name: "VAT",
    ruleType: "Tax",
    calculationType: "Percentage",
    value: 5,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-AE-002",
    country: "UAE",
    name: "EOSB",
    ruleType: "Contribution",
    calculationType: "Percentage",
    value: 8.33,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-AE-003",
    country: "UAE",
    name: "WPS Adjustment",
    ruleType: "Deduction",
    calculationType: "Fixed Amount",
    value: 1200,
    appliesTo: "Specific Role",
    scopeValue: "Contract Staff",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-CM-001",
    country: "Cameroon",
    name: "CNPS",
    ruleType: "Contribution",
    calculationType: "Percentage",
    value: 4.2,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-CM-002",
    country: "Cameroon",
    name: "PIT",
    ruleType: "Tax",
    calculationType: "Percentage",
    value: 11,
    appliesTo: "All Employees",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
  {
    id: "RULE-CM-003",
    country: "Cameroon",
    name: "VAT",
    ruleType: "Tax",
    calculationType: "Percentage",
    value: 19.25,
    appliesTo: "Specific Department",
    scopeValue: "Finance",
    effectiveFrom: "2026-04-01",
    status: "Active",
    source: "Default",
  },
];

export const complianceReports: ComplianceReport[] = [
  {
    id: "RPT-001",
    name: "India PF Register",
    type: "PF",
    month: "April",
    year: "2026",
    country: "India",
    department: "Operations",
    status: "Generated",
  },
  {
    id: "RPT-002",
    name: "India Tax Summary",
    type: "Tax",
    month: "April",
    year: "2026",
    country: "India",
    department: "Finance",
    status: "Generated",
  },
  {
    id: "RPT-003",
    name: "South Africa PAYE Report",
    type: "Tax",
    month: "April",
    year: "2026",
    country: "South Africa",
    department: "Finance",
    status: "Pending",
  },
  {
    id: "RPT-004",
    name: "South Africa UIF Report",
    type: "Statutory",
    month: "March",
    year: "2026",
    country: "South Africa",
    department: "HR",
    status: "Generated",
  },
  {
    id: "RPT-005",
    name: "UAE VAT Pack",
    type: "Statutory",
    month: "April",
    year: "2026",
    country: "UAE",
    department: "Finance",
    status: "Generated",
  },
  {
    id: "RPT-006",
    name: "UAE WPS Output",
    type: "Statutory",
    month: "April",
    year: "2026",
    country: "UAE",
    department: "Payroll",
    status: "Generated",
  },
  {
    id: "RPT-007",
    name: "Cameroon CNPS Return",
    type: "CNPS",
    month: "April",
    year: "2026",
    country: "Cameroon",
    department: "Payroll",
    status: "Pending",
  },
  {
    id: "RPT-008",
    name: "Cameroon Tax Register",
    type: "Tax",
    month: "March",
    year: "2026",
    country: "Cameroon",
    department: "Finance",
    status: "Generated",
  },
];

export const complianceAuditLogs: ComplianceAuditLog[] = [
  {
    id: "AUD-001",
    country: "India",
    action: "Updated PF contribution code",
    module: "Payroll",
    userRole: "Finance",
    timestamp: "Apr 15, 2026, 09:12 AM",
    beforeValue: "PF code: PF-STD-01",
    afterValue: "PF code: PF-STD-02",
    reason: "Re-aligned the contribution code to the latest internal template.",
  },
  {
    id: "AUD-002",
    country: "India",
    action: "Corrected employee tax category",
    module: "Employee",
    userRole: "HR",
    timestamp: "Apr 15, 2026, 08:41 AM",
    beforeValue: "Tax category: Missing",
    afterValue: "Tax category: Resident",
    reason: "Completed onboarding data after employee document review.",
  },
  {
    id: "AUD-003",
    country: "South Africa",
    action: "Adjusted UIF coverage flag",
    module: "Employee",
    userRole: "HR",
    timestamp: "Apr 14, 2026, 04:25 PM",
    beforeValue: "UIF coverage: No",
    afterValue: "UIF coverage: Yes",
    reason: "Corrected employment classification for two transferred staff members.",
  },
  {
    id: "AUD-004",
    country: "UAE",
    action: "Locked payroll compliance pack",
    module: "Payroll",
    userRole: "System",
    timestamp: "Apr 15, 2026, 10:30 AM",
    beforeValue: "Payroll status: Approved",
    afterValue: "Payroll status: Locked",
    reason: "Final compliance package was sealed after finance approval.",
  },
  {
    id: "AUD-005",
    country: "Cameroon",
    action: "Updated CNPS employee category",
    module: "Employee",
    userRole: "Finance",
    timestamp: "Apr 15, 2026, 11:08 AM",
    beforeValue: "CNPS category: Temporary",
    afterValue: "CNPS category: Permanent",
    reason: "Corrected statutory classification before report generation.",
  },
];

export const complianceAlerts: ComplianceAlert[] = [
  {
    id: "ALT-001",
    country: "India",
    severity: "High",
    title: "Missing tax data",
    description:
      "Two employee records are missing tax residency details for the current month.",
    timestamp: "Apr 15, 2026, 11:20 AM",
    reviewed: false,
  },
  {
    id: "ALT-002",
    country: "India",
    severity: "Medium",
    title: "High deductions",
    description:
      "One payroll batch crossed the internal deduction threshold and needs review.",
    timestamp: "Apr 15, 2026, 09:40 AM",
    reviewed: false,
  },
  {
    id: "ALT-003",
    country: "Cameroon",
    severity: "High",
    title: "Country mismatch",
    description:
      "One employee is assigned to Cameroon payroll but has a UAE work location on file.",
    timestamp: "Apr 15, 2026, 10:55 AM",
    reviewed: false,
  },
  {
    id: "ALT-004",
    country: "Cameroon",
    severity: "Medium",
    title: "Missing tax data",
    description:
      "CNPS contribution category is incomplete for one newly added employee.",
    timestamp: "Apr 14, 2026, 05:15 PM",
    reviewed: true,
  },
];
