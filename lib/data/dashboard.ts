export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  color: string;
}

export interface EntityData {
  country: string;
  riskLevel: string;
  riskPercentage: number;
  compliancePercentage: number;
  aiConfidence: number;
  statusColor: "green" | "yellow" | "orange" | "red";
}

export interface ActivityItem {
  time: string;
  description: string;
  type: "completed" | "alert" | "sync" | "critical";
}

export interface AutomationItem {
  label: string;
  status: "active" | "enabled" | "on" | "connected";
}

export interface FinancialItem {
  label: string;
  value: string;
  color: string;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "payroll-cycle",
    title: "Active Payroll Cycle",
    value: "March 2026",
    subtitle: "Audit in Progress",
    color: "bg-[#3b82f6]",
  },
  {
    id: "total-payroll",
    title: "Total Global Payroll This Month",
    value: "$565,240",
    trend: "+12.5%",
    trendDirection: "up",
    subtitle: "vs Last Month",
    color: "bg-[#10b981]",
  },
  {
    id: "compliance",
    title: "Compliance Status",
    value: "98%",
    subtitle: "2 filings pending",
    color: "bg-[#10b981]",
  },
  {
    id: "risk-alerts",
    title: "Risk Alerts",
    value: "3 Medium",
    subtitle: "1 Critical",
    color: "bg-[#f59e0b]",
  },
];

export const globalEntities: EntityData[] = [
  {
    country: "USA",
    riskLevel: "Low Risk",
    riskPercentage: 12,
    compliancePercentage: 98,
    aiConfidence: 96,
    statusColor: "green",
  },
  {
    country: "India",
    riskLevel: "Medium Risk",
    riskPercentage: 45,
    compliancePercentage: 94,
    aiConfidence: 92,
    statusColor: "yellow",
  },
  {
    country: "Germany",
    riskLevel: "Watchlist",
    riskPercentage: 62,
    compliancePercentage: 89,
    aiConfidence: 88,
    statusColor: "orange",
  },
  {
    country: "Singapore",
    riskLevel: "Healthy",
    riskPercentage: 8,
    compliancePercentage: 100,
    aiConfidence: 98,
    statusColor: "green",
  },
];

export const activityTimeline: ActivityItem[] = [
  { time: "09:12 AM", description: "Payroll Audit Completed (USA)", type: "completed" },
  { time: "10:45 AM", description: "TDS Filing Validated", type: "completed" },
  { time: "11:30 AM", description: "AI Flagged Overtime Spike", type: "alert" },
  { time: "12:15 PM", description: "Banking Reconciliation Complete", type: "completed" },
  { time: "01:30 PM", description: "Multi-Entity Sync Completed", type: "sync" },
  { time: "02:45 PM", description: "Compliance Report Generated", type: "completed" },
];

export const automationSnapshot: AutomationItem[] = [
  { label: "Attendance Auto Sync", status: "active" },
  { label: "Compliance Auto Filing", status: "enabled" },
  { label: "Fraud Monitoring", status: "active" },
  { label: "Multi-Entity Sync", status: "on" },
  { label: "ERP Integration", status: "connected" },
];

export const financialOverview: FinancialItem[] = [
  { label: "Gross Payroll", value: "$565,240", color: "#10b981" },
  { label: "Deductions", value: "$42,350", color: "#ef4444" },
  { label: "Net Disbursement", value: "$522,890", color: "#3b82f6" },
  { label: "Statutory Payments", value: "$68,120", color: "#f59e0b" },
];

export const payrollTrendData: ChartDataPoint[] = [
  { month: "Sep", value: 480 },
  { month: "Oct", value: 520 },
  { month: "Nov", value: 495 },
  { month: "Dec", value: 540 },
  { month: "Jan", value: 530 },
  { month: "Feb", value: 565 },
];

export const aiInsights = [
  { text: "Overtime spike detected in Ireland (+14%)", type: "warning" as const },
  { text: "2 compliance filings due in 5 days", type: "alert" as const },
  { text: "Fraud probability low (6%)", type: "success" as const },
  { text: "₹48,000 potential penalty avoided", type: "success" as const },
  { text: "Banking sync healthy (QuickBooks connected)", type: "success" as const },
];

export const payrollHealthScore = 94;
