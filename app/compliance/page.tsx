"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Globe,
  Lock,
  PencilLine,
  Plus,
  Settings2,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  complianceAlerts as initialAlerts,
  complianceAuditLogs as initialAuditLogs,
  complianceCountries as initialCountries,
  complianceReports as initialReports,
  complianceRules as initialRules,
  type ComplianceAlert,
  type ComplianceAuditLog,
  type ComplianceCalculationType,
  type ComplianceModule,
  type ComplianceReport,
  type ComplianceReportType,
  type ComplianceRule,
  type ComplianceRuleScope,
  type ComplianceRuleType,
  type ComplianceSeverity,
  type PayrollComplianceStatus,
} from "@/lib/data/compliance";
import { cn } from "@/lib/utils";

const ALL_COUNTRIES = "All Countries";
const ALL_MONTHS = "All Months";
const ALL_DEPARTMENTS = "All Departments";

type RuleDrivenReport = ComplianceReport & {
  linkedRuleName?: string;
};

type ReportTableRow = RuleDrivenReport & {
  period: string;
};

type RulesTableRow = ComplianceRule & {
  valueLabel: string;
  typeLabel: string;
  effectiveDateLabel: string;
  appliesToLabel: string;
};

type RuleFormState = {
  country: string;
  name: string;
  ruleType: ComplianceRuleType;
  calculationType: ComplianceCalculationType;
  value: string;
  appliesTo: ComplianceRuleScope;
  scopeValue: string;
  effectiveFrom: string;
};

type DisplayIssue = {
  id: string;
  severity: ComplianceSeverity;
  title: string;
  description: string;
};

function formatTimestamp(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  if (!value) return "Not set";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toneClasses(tone: "success" | "warning" | "danger" | "neutral") {
  return {
    success: "border-[#10b981]/20 bg-[#d1fae5] text-[#065f46]",
    warning: "border-[#f59e0b]/20 bg-[#fef3c7] text-[#92400e]",
    danger: "border-[#ef4444]/20 bg-[#fee2e2] text-[#991b1b]",
    neutral: "border-[#e2e8f0] bg-[#f8fafc] text-[#475569]",
  }[tone];
}

function getRuleTypeLabel(ruleType: ComplianceRuleType) {
  return {
    Tax: "Tax Rule",
    Contribution: "Employee Contribution",
    Deduction: "Deduction Rule",
  }[ruleType];
}

function getScopeLabel(rule: Pick<ComplianceRule, "appliesTo" | "scopeValue">) {
  if (rule.appliesTo === "All Employees") {
    return "All Employees";
  }

  const prefix = rule.appliesTo === "Specific Department" ? "Department" : "Role";
  return `${prefix}: ${rule.scopeValue || "Selected group"}`;
}

function formatRuleValue(
  rule: Pick<ComplianceRule, "calculationType" | "value">,
  currencyCode: string
) {
  if (rule.calculationType === "Percentage") {
    return `${rule.value}%`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(rule.value);
}

function describeRule(
  rule: Pick<
    ComplianceRule,
    "ruleType" | "calculationType" | "value" | "appliesTo" | "scopeValue" | "effectiveFrom"
  >,
  currencyCode: string
) {
  return `${getRuleTypeLabel(rule.ruleType)} | ${formatRuleValue(
    rule,
    currencyCode
  )} | ${getScopeLabel(rule)} | Effective ${formatDisplayDate(rule.effectiveFrom)}`;
}

function getReportTypeForRule(rule: ComplianceRule): ComplianceReportType {
  const normalizedName = rule.name.toUpperCase();

  if (normalizedName.includes("PF")) return "PF";
  if (normalizedName.includes("CNPS")) return "CNPS";
  if (rule.ruleType === "Tax") return "Tax";
  return "Statutory";
}

function getReportDepartmentForRule(rule: ComplianceRule) {
  if (rule.appliesTo === "Specific Department") {
    return rule.scopeValue || "Operations";
  }

  if (rule.ruleType === "Tax") return "Finance";
  if (rule.ruleType === "Contribution") return "Payroll";
  if (rule.appliesTo === "Specific Role") return "HR";

  return "Finance";
}

function createRuleForm(country: string): RuleFormState {
  return {
    country,
    name: "",
    ruleType: "Tax",
    calculationType: "Percentage",
    value: "",
    appliesTo: "All Employees",
    scopeValue: "",
    effectiveFrom: formatDateInputValue(new Date()),
  };
}

function mapRuleToForm(rule: ComplianceRule): RuleFormState {
  return {
    country: rule.country,
    name: rule.name,
    ruleType: rule.ruleType,
    calculationType: rule.calculationType,
    value: String(rule.value),
    appliesTo: rule.appliesTo,
    scopeValue: rule.scopeValue || "",
    effectiveFrom: rule.effectiveFrom,
  };
}

function formatRuleForAudit(rule: ComplianceRule, currencyCode: string) {
  return `${rule.name} | ${rule.country} | ${getRuleTypeLabel(
    rule.ruleType
  )} | ${formatRuleValue(rule, currencyCode)} | ${rule.status}`;
}

function ToneBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.45px]",
        toneClasses(tone)
      )}
    >
      {children}
    </Badge>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-5 shadow-sm">
      <p className="text-[10px] font-bold text-[#62748e] uppercase tracking-wider mb-2">
        {title}
      </p>
      <p className="text-[28px] font-bold text-[#0f172b] mb-1">{value}</p>
      <p className="text-[12px] text-[#90a1b9]">{subtitle}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-8 text-center">
      <p className="font-bold text-[#0f172b] text-[14px]">{title}</p>
      <p className="text-[12px] text-[#64748b] mt-1">{description}</p>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.5px] block mb-1.5">
        {label}
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-10 bg-white border border-[#e2e8f0] rounded-xl px-3 text-[14px] text-[#0f172b] focus:outline-none focus:border-[#10b981]/40 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helperText,
  min,
  step,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  helperText?: string;
  min?: string;
  step?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.5px] block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-10 bg-white border border-[#e2e8f0] rounded-xl px-3 text-[14px] text-[#0f172b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#10b981]/40 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
      />
      {helperText && <p className="mt-1.5 text-[11px] text-[#64748b]">{helperText}</p>}
    </div>
  );
}

export default function CompliancePage() {
  const [selectedCountry, setSelectedCountry] = useState(initialCountries[0].country);
  const [countries, setCountries] = useState(initialCountries);
  const [rules, setRules] = useState(initialRules);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedAuditLogId, setSelectedAuditLogId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState<RuleFormState>(() =>
    createRuleForm(initialCountries[0].country)
  );
  const [useDefaultRules, setUseDefaultRules] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialCountries.map((country) => [country.country, true]))
  );
  const [reportFilters, setReportFilters] = useState({
    country: ALL_COUNTRIES,
    month: ALL_MONTHS,
    department: ALL_DEPARTMENTS,
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const activeCountry = useMemo(
    () => countries.find((country) => country.country === selectedCountry) ?? countries[0],
    [countries, selectedCountry]
  );
  const targetRuleCountry =
    countries.find((country) => country.country === ruleForm.country) ?? activeCountry;

  const currencyByCountry = useMemo(
    () =>
      Object.fromEntries(
        countries.map((country) => [country.country, country.currencyCode])
      ) as Record<string, string>,
    [countries]
  );

  const editingRule = useMemo(
    () => rules.find((rule) => rule.id === editingRuleId) ?? null,
    [rules, editingRuleId]
  );

  const isDefaultRulesEnabled = useDefaultRules[selectedCountry] ?? true;
  const isRuleApplied = (rule: ComplianceRule) =>
    rule.status === "Active" &&
    (rule.source !== "Default" || (useDefaultRules[rule.country] ?? true));

  const countryRules = useMemo(
    () => rules.filter((rule) => rule.country === selectedCountry),
    [rules, selectedCountry]
  );

  const appliedCountryRules = useMemo(
    () => countryRules.filter((rule) => isRuleApplied(rule)),
    [countryRules]
  );

  const ruleCoverageIssue: DisplayIssue | null =
    appliedCountryRules.length > 0
      ? null
      : {
          id: `ISSUE-${selectedCountry}-RULES`,
          severity: "High",
          title: "No active compliance rules",
          description:
            isDefaultRulesEnabled
              ? "Add at least one active rule so statutory coverage and deductions can be reviewed."
              : "Default rules are turned off for this country. Add a custom rule or re-enable defaults to continue.",
        };

  const countryAlerts = useMemo(
    () => alerts.filter((alert) => alert.country === selectedCountry),
    [alerts, selectedCountry]
  );

  const recentAlerts = useMemo(() => countryAlerts.slice(0, 3), [countryAlerts]);

  const statutoryIssues = useMemo<DisplayIssue[]>(
    () => [
      ...(ruleCoverageIssue ? [ruleCoverageIssue] : []),
      ...countryAlerts.map((alert) => ({
        id: alert.id,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
      })),
    ],
    [countryAlerts, ruleCoverageIssue]
  );

  const countryAuditLogs = useMemo(
    () => auditLogs.filter((log) => log.country === selectedCountry),
    [auditLogs, selectedCountry]
  );

  const generatedRuleReports = useMemo<RuleDrivenReport[]>(
    () =>
      rules
        .filter((rule) => isRuleApplied(rule))
        .map((rule) => {
          const effectiveDate = new Date(`${rule.effectiveFrom}T00:00:00`);
          const isFuture = effectiveDate.getTime() > Date.now();

          return {
            id: `AUTO-${rule.id}`,
            name: `${rule.country} ${rule.name} Rule Report`,
            type: getReportTypeForRule(rule),
            month: effectiveDate.toLocaleDateString("en-US", { month: "long" }),
            year: effectiveDate.toLocaleDateString("en-US", { year: "numeric" }),
            country: rule.country,
            department: getReportDepartmentForRule(rule),
            status: isFuture ? "Pending" : "Generated",
            linkedRuleName: rule.name,
          };
        }),
    [rules, useDefaultRules]
  );

  const allReports = useMemo<RuleDrivenReport[]>(
    () => [...generatedRuleReports, ...initialReports],
    [generatedRuleReports]
  );

  const reportsGeneratedCount = useMemo(
    () =>
      allReports.filter(
        (report) => report.country === selectedCountry && report.status === "Generated"
      ).length,
    [allReports, selectedCountry]
  );

  const overallComplianceStatus =
    statutoryIssues.length === 0 ? "All Good" : "Issues Found";
  const isLocked = activeCountry.payrollStatus === "Locked";
  const isTargetRuleCountryLocked = targetRuleCountry.payrollStatus === "Locked";

  const countryOptions = useMemo(() => countries.map((country) => country.country), [countries]);
  const reportCountryOptions = useMemo(
    () => [ALL_COUNTRIES, ...countryOptions],
    [countryOptions]
  );
  const reportMonthOptions = useMemo(
    () => [ALL_MONTHS, ...Array.from(new Set(allReports.map((report) => report.month)))],
    [allReports]
  );
  const reportDepartmentOptions = useMemo(
    () => [
      ALL_DEPARTMENTS,
      ...Array.from(new Set(allReports.map((report) => report.department))),
    ],
    [allReports]
  );

  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      if (reportFilters.country !== ALL_COUNTRIES && report.country !== reportFilters.country) {
        return false;
      }
      if (reportFilters.month !== ALL_MONTHS && report.month !== reportFilters.month) {
        return false;
      }
      if (
        reportFilters.department !== ALL_DEPARTMENTS &&
        report.department !== reportFilters.department
      ) {
        return false;
      }
      return true;
    });
  }, [allReports, reportFilters]);

  const selectedAuditLog = useMemo(
    () => auditLogs.find((log) => log.id === selectedAuditLogId) ?? null,
    [auditLogs, selectedAuditLogId]
  );

  const deductionRows = useMemo(
    () =>
      appliedCountryRules.map((rule) => ({
        id: rule.id,
        label: rule.name,
        note: `${getRuleTypeLabel(rule.ruleType)} | ${getScopeLabel(rule)}`,
        amount: formatRuleValue(rule, activeCountry.currencyCode),
      })),
    [activeCountry.currencyCode, appliedCountryRules]
  );

  const rulesTableRows = useMemo<RulesTableRow[]>(
    () =>
      [...countryRules]
        .sort((left, right) => {
          if (left.status !== right.status) {
            return left.status === "Active" ? -1 : 1;
          }
          if (left.source !== right.source) {
            return left.source === "Default" ? -1 : 1;
          }
          return left.name.localeCompare(right.name);
        })
        .map((rule) => ({
          ...rule,
          valueLabel: formatRuleValue(
            rule,
            currencyByCountry[rule.country] || activeCountry.currencyCode
          ),
          typeLabel: getRuleTypeLabel(rule.ruleType),
          effectiveDateLabel: formatDisplayDate(rule.effectiveFrom),
          appliesToLabel: getScopeLabel(rule),
        })),
    [activeCountry.currencyCode, countryRules, currencyByCountry]
  );

  const addAuditLog = (entry: Omit<ComplianceAuditLog, "id">) => {
    setAuditLogs((current) => [{ id: `AUD-${Date.now()}`, ...entry }, ...current]);
  };

  const pushToast = (message: string) => {
    setToastMessage(message);
  };

  const resetRuleDialog = () => {
    setIsRuleDialogOpen(false);
    setEditingRuleId(null);
    setRuleForm(createRuleForm(selectedCountry));
  };

  const openAddRuleDialog = () => {
    setEditingRuleId(null);
    setRuleForm(createRuleForm(selectedCountry));
    setIsRuleDialogOpen(true);
  };

  const openEditRuleDialog = (rule: ComplianceRule) => {
    setEditingRuleId(rule.id);
    setRuleForm(mapRuleToForm(rule));
    setIsRuleDialogOpen(true);
  };

  const handleToggleDefaultRules = (enabled: boolean) => {
    setUseDefaultRules((current) => ({
      ...current,
      [selectedCountry]: enabled,
    }));

    addAuditLog({
      country: selectedCountry,
      action: enabled ? "Enabled default country rules" : "Disabled default country rules",
      module: "Payroll",
      userRole: "HR",
      timestamp: formatTimestamp(new Date()),
      beforeValue: `Default rules: ${enabled ? "Off" : "On"}`,
      afterValue: `Default rules: ${enabled ? "On" : "Off"}`,
      reason: "Rule application mode was updated from the Compliance Setup panel.",
    });

    pushToast(
      enabled
        ? `Default rules enabled for ${selectedCountry}.`
        : `Default rules turned off for ${selectedCountry}.`
    );
  };

  const handleSaveRule = () => {
    const trimmedName = ruleForm.name.trim();
    const trimmedScopeValue = ruleForm.scopeValue.trim();
    const numericValue = Number(ruleForm.value);

    if (isTargetRuleCountryLocked) {
      pushToast(`Editing is locked for ${ruleForm.country}.`);
      return;
    }

    if (!trimmedName || !ruleForm.effectiveFrom || Number.isNaN(numericValue) || numericValue <= 0) {
      pushToast("Complete the rule form before saving.");
      return;
    }

    if (ruleForm.appliesTo !== "All Employees" && !trimmedScopeValue) {
      pushToast("Add the department or role this rule applies to.");
      return;
    }

    const nextCurrencyCode = currencyByCountry[ruleForm.country] || activeCountry.currencyCode;

    if (editingRule) {
      const previousCurrencyCode =
        currencyByCountry[editingRule.country] || activeCountry.currencyCode;
      const updatedRule: ComplianceRule = {
        ...editingRule,
        country: ruleForm.country,
        name: trimmedName,
        ruleType: ruleForm.ruleType,
        calculationType: ruleForm.calculationType,
        value: numericValue,
        appliesTo: ruleForm.appliesTo,
        scopeValue: ruleForm.appliesTo === "All Employees" ? undefined : trimmedScopeValue,
        effectiveFrom: ruleForm.effectiveFrom,
      };

      setRules((current) =>
        current.map((rule) => (rule.id === editingRule.id ? updatedRule : rule))
      );

      addAuditLog({
        country: updatedRule.country,
        action: `Updated ${updatedRule.name} rule`,
        module: "Payroll",
        userRole: "HR",
        timestamp: formatTimestamp(new Date()),
        beforeValue: formatRuleForAudit(editingRule, previousCurrencyCode),
        afterValue: formatRuleForAudit(updatedRule, nextCurrencyCode),
        reason: "Compliance rule settings were updated from Compliance Setup.",
      });

      pushToast(`${updatedRule.name} updated successfully.`);
    } else {
      const newRule: ComplianceRule = {
        id: `RULE-${Date.now()}`,
        country: ruleForm.country,
        name: trimmedName,
        ruleType: ruleForm.ruleType,
        calculationType: ruleForm.calculationType,
        value: numericValue,
        appliesTo: ruleForm.appliesTo,
        scopeValue: ruleForm.appliesTo === "All Employees" ? undefined : trimmedScopeValue,
        effectiveFrom: ruleForm.effectiveFrom,
        status: "Active",
        source: "Custom",
      };

      setRules((current) => [newRule, ...current]);

      addAuditLog({
        country: newRule.country,
        action: `Added ${newRule.name} rule`,
        module: "Payroll",
        userRole: "HR",
        timestamp: formatTimestamp(new Date()),
        beforeValue: "Rule status: Not configured",
        afterValue: formatRuleForAudit(newRule, nextCurrencyCode),
        reason: "New compliance rule was added from Compliance Setup.",
      });

      pushToast(`${newRule.name} added to ${newRule.country}.`);
    }

    resetRuleDialog();
  };

  const handleRuleStatusChange = (rule: ComplianceRule) => {
    const nextStatus = rule.status === "Active" ? "Inactive" : "Active";
    const currencyCode = currencyByCountry[rule.country] || activeCountry.currencyCode;
    const updatedRule: ComplianceRule = {
      ...rule,
      status: nextStatus,
    };

    setRules((current) =>
      current.map((currentRule) => (currentRule.id === rule.id ? updatedRule : currentRule))
    );

    addAuditLog({
      country: rule.country,
      action:
        nextStatus === "Inactive"
          ? `Disabled ${rule.name} rule`
          : `Activated ${rule.name} rule`,
      module: "Payroll",
      userRole: "HR",
      timestamp: formatTimestamp(new Date()),
      beforeValue: formatRuleForAudit(rule, currencyCode),
      afterValue: formatRuleForAudit(updatedRule, currencyCode),
      reason:
        nextStatus === "Inactive"
          ? "Rule was disabled from the Compliance Setup table."
          : "Rule was reactivated from the Compliance Setup table.",
    });

    pushToast(
      nextStatus === "Inactive"
        ? `${rule.name} disabled for ${rule.country}.`
        : `${rule.name} activated for ${rule.country}.`
    );
  };

  const updatePayrollStatus = (nextStatus: PayrollComplianceStatus) => {
    const previousStatus = activeCountry.payrollStatus;
    const nextTimestamp = nextStatus === "Locked" ? formatTimestamp(new Date()) : undefined;

    setCountries((current) =>
      current.map((country) =>
        country.country === selectedCountry
          ? { ...country, payrollStatus: nextStatus, lockedAt: nextTimestamp }
          : country
      )
    );

    addAuditLog({
      country: selectedCountry,
      action:
        nextStatus === "Approved"
          ? "Approved payroll compliance pack"
          : "Locked payroll compliance pack",
      module: "Payroll",
      userRole: "Finance",
      timestamp: formatTimestamp(new Date()),
      beforeValue: `Payroll status: ${previousStatus}`,
      afterValue: `Payroll status: ${nextStatus}`,
      reason:
        nextStatus === "Approved"
          ? "Compliance checks were reviewed and the payroll pack is ready for lock."
          : "Payroll compliance was finalized and editing was disabled.",
    });

    pushToast(
      nextStatus === "Approved"
        ? `${selectedCountry} payroll marked as approved.`
        : `${selectedCountry} payroll is now locked.`
    );
  };

  const handleReviewAlert = (alert: ComplianceAlert) => {
    if (isLocked || alert.reviewed) return;

    setAlerts((current) =>
      current.map((currentAlert) =>
        currentAlert.id === alert.id ? { ...currentAlert, reviewed: true } : currentAlert
      )
    );

    const module: ComplianceModule =
      alert.title === "High deductions" ? "Payroll" : "Employee";

    addAuditLog({
      country: alert.country,
      action: `Reviewed alert: ${alert.title}`,
      module,
      userRole: "HR",
      timestamp: formatTimestamp(new Date()),
      beforeValue: "Alert status: Open",
      afterValue: "Alert status: Reviewed",
      reason: "Compliance alert was acknowledged from the dashboard review action.",
    });

    pushToast(`${alert.title} reviewed for ${alert.country}.`);
  };

  const handleDownloadReport = (report: ComplianceReport) => {
    pushToast(`Download started for ${report.name}.`);
  };

  const handleExport = (format: string) => {
    pushToast(`Reports prepared for ${format} export.`);
  };

  const reportRows: ReportTableRow[] = filteredReports.map((report) => ({
    ...report,
    period: `${report.month} ${report.year}`,
  }));

  const reportColumns = [
    {
      key: "name",
      label: "Report Name",
      render: (value: unknown, row: ReportTableRow) => (
        <div>
          <p className="font-bold text-[13px] text-[#0f172b]">{String(value)}</p>
          <p className="text-[11px] text-[#90a1b9]">
            {row.country} | {row.department}
          </p>
          {row.linkedRuleName && (
            <p className="mt-1 text-[11px] font-medium text-[#10b981]">
              Linked to {row.linkedRuleName}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: unknown) => (
        <ToneBadge tone="neutral">{String(value)}</ToneBadge>
      ),
    },
    {
      key: "period",
      label: "Period",
      render: (value: unknown) => (
        <span className="text-[13px] text-[#475569]">{String(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <ToneBadge tone={value === "Generated" ? "success" : "warning"}>
          {String(value)}
        </ToneBadge>
      ),
    },
    {
      key: "download",
      label: "Download",
      render: (_value: unknown, row: ReportTableRow) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadReport(row)}
          className="border-[#10b981]/30 text-[#10b981] hover:bg-[#ecfdf5]"
        >
          <Download className="size-3.5" />
          Download
        </Button>
      ),
    },
  ];

  const rulesColumns = [
    {
      key: "name",
      label: "Rule Name",
      render: (value: unknown, row: RulesTableRow) => (
        <div>
          <p className="font-bold text-[13px] text-[#0f172b]">{String(value)}</p>
          <p className="text-[11px] text-[#90a1b9]">
            {row.appliesToLabel} | {row.source}
          </p>
        </div>
      ),
    },
    {
      key: "country",
      label: "Country",
      render: (value: unknown) => (
        <span className="text-[13px] text-[#475569]">{String(value)}</span>
      ),
    },
    {
      key: "typeLabel",
      label: "Type",
      render: (value: unknown) => <ToneBadge tone="neutral">{String(value)}</ToneBadge>,
    },
    {
      key: "valueLabel",
      label: "Value",
      render: (value: unknown, row: RulesTableRow) => (
        <div>
          <p className="font-bold text-[13px] text-[#0f172b]">{String(value)}</p>
          <p className="text-[11px] text-[#90a1b9]">{row.calculationType}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <ToneBadge tone={value === "Active" ? "success" : "warning"}>
          {String(value)}
        </ToneBadge>
      ),
    },
    {
      key: "effectiveDateLabel",
      label: "Effective Date",
      render: (value: unknown) => (
        <span className="text-[13px] text-[#475569]">{String(value)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value: unknown, row: RulesTableRow) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditRuleDialog(row)}
            disabled={isLocked}
            className="border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#eff6ff]"
          >
            <PencilLine className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRuleStatusChange(row)}
            disabled={isLocked}
            className="border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
          >
            {row.status === "Active" ? "Disable" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  const auditColumns = [
    {
      key: "action",
      label: "Action Performed",
      render: (value: unknown, row: ComplianceAuditLog) => (
        <div>
          <p className="font-bold text-[13px] text-[#0f172b]">{String(value)}</p>
          <p className="text-[11px] text-[#90a1b9]">{row.country}</p>
        </div>
      ),
    },
    {
      key: "module",
      label: "Module",
      render: (value: unknown) => (
        <span className="text-[13px] text-[#475569]">{String(value)}</span>
      ),
    },
    {
      key: "userRole",
      label: "User Role",
      render: (value: unknown) => (
        <ToneBadge tone="neutral">{String(value)}</ToneBadge>
      ),
    },
    {
      key: "timestamp",
      label: "Timestamp",
      render: (value: unknown) => (
        <span className="text-[13px] text-[#475569]">{String(value)}</span>
      ),
    },
    {
      key: "details",
      label: "Details",
      render: (_value: unknown, row: ComplianceAuditLog) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedAuditLogId(row.id)}
          className="border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#eff6ff]"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="pb-20">
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-[#0f172b] px-4 py-3 text-[13px] font-bold text-white shadow-xl">
          {toastMessage}
        </div>
      )}

      <Dialog
        open={Boolean(selectedAuditLog)}
        onOpenChange={(open) => {
          if (!open) setSelectedAuditLogId(null);
        }}
      >
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader className="mb-5">
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                Review the before and after values for the selected compliance change.
              </DialogDescription>
            </DialogHeader>

            {selectedAuditLog && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#64748b] mb-1.5">
                    Action
                  </p>
                  <p className="font-bold text-[#0f172b] text-[14px]">
                    {selectedAuditLog.action}
                  </p>
                  <p className="text-[12px] text-[#64748b] mt-1">
                    {selectedAuditLog.module} | {selectedAuditLog.userRole} |{" "}
                    {selectedAuditLog.timestamp}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#e2e8f0] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#64748b] mb-1.5">
                      Before Value
                    </p>
                    <p className="text-[13px] text-[#0f172b] leading-6">
                      {selectedAuditLog.beforeValue}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e2e8f0] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#64748b] mb-1.5">
                      After Value
                    </p>
                    <p className="text-[13px] text-[#0f172b] leading-6">
                      {selectedAuditLog.afterValue}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e8f0] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#64748b] mb-1.5">
                    Change Reason
                  </p>
                  <p className="text-[13px] text-[#0f172b] leading-6">
                    {selectedAuditLog.reason}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAuditLogId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRuleDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetRuleDialog();
        }}
      >
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader className="mb-5">
              <DialogTitle>
                {editingRule ? "Edit Compliance Rule" : "Add Compliance Rule"}
              </DialogTitle>
              <DialogDescription>
                This rule will apply during payroll calculation. Keep the setup short and focused on the business rule.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Country"
                value={ruleForm.country}
                options={countryOptions}
                onChange={(value) =>
                  setRuleForm((current) => ({ ...current, country: value }))
                }
                disabled={isLocked}
              />
              <InputField
                label="Rule Name"
                value={ruleForm.name}
                placeholder="PF, TDS, VAT"
                onChange={(value) =>
                  setRuleForm((current) => ({ ...current, name: value }))
                }
                disabled={isTargetRuleCountryLocked}
              />
              <SelectField
                label="Rule Type"
                value={ruleForm.ruleType}
                options={["Tax", "Contribution", "Deduction"]}
                onChange={(value) =>
                  setRuleForm((current) => ({
                    ...current,
                    ruleType: value as ComplianceRuleType,
                  }))
                }
                disabled={isTargetRuleCountryLocked}
              />
              <SelectField
                label="Calculation Type"
                value={ruleForm.calculationType}
                options={["Percentage", "Fixed Amount"]}
                onChange={(value) =>
                  setRuleForm((current) => ({
                    ...current,
                    calculationType: value as ComplianceCalculationType,
                  }))
                }
                disabled={isTargetRuleCountryLocked}
              />
              <InputField
                label="Value"
                type="number"
                min="0"
                step={ruleForm.calculationType === "Percentage" ? "0.01" : "1"}
                value={ruleForm.value}
                placeholder={ruleForm.calculationType === "Percentage" ? "12" : "1500"}
                onChange={(value) =>
                  setRuleForm((current) => ({ ...current, value }))
                }
                helperText={
                  ruleForm.calculationType === "Percentage"
                    ? "Enter the percentage to be applied."
                    : "Enter the fixed amount to be applied."
                }
                disabled={isTargetRuleCountryLocked}
              />
              <SelectField
                label="Applies To"
                value={ruleForm.appliesTo}
                options={[
                  "All Employees",
                  "Specific Department",
                  "Specific Role",
                ]}
                onChange={(value) =>
                  setRuleForm((current) => ({
                    ...current,
                    appliesTo: value as ComplianceRuleScope,
                    scopeValue: value === "All Employees" ? "" : current.scopeValue,
                  }))
                }
                disabled={isTargetRuleCountryLocked}
              />
              {ruleForm.appliesTo !== "All Employees" && (
                <InputField
                  label={
                    ruleForm.appliesTo === "Specific Department"
                      ? "Department"
                      : "Role"
                  }
                  value={ruleForm.scopeValue}
                  placeholder={
                    ruleForm.appliesTo === "Specific Department"
                      ? "Finance"
                      : "Managers"
                  }
                  onChange={(value) =>
                    setRuleForm((current) => ({ ...current, scopeValue: value }))
                  }
                  disabled={isTargetRuleCountryLocked}
                />
              )}
              <InputField
                label="Effective From"
                type="date"
                value={ruleForm.effectiveFrom}
                onChange={(value) =>
                  setRuleForm((current) => ({ ...current, effectiveFrom: value }))
                }
                disabled={isTargetRuleCountryLocked}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetRuleDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRule}
              disabled={isTargetRuleCountryLocked}
              className="bg-[#10b981] text-white hover:bg-[#059669]"
            >
              {editingRule ? "Save Changes" : "Add Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-[24px] font-bold text-[#0f172b]">Compliance Dashboard</h1>
            <ToneBadge tone={overallComplianceStatus === "All Good" ? "success" : "danger"}>
              {overallComplianceStatus}
            </ToneBadge>
          </div>
          <p className="text-[#62748e] text-[14px]">
            Track statutory coverage, reports, audit visibility, and payroll finalization in one place.
          </p>
        </div>

        <div className="w-full max-w-[240px]">
          <SelectField
            label="Country"
            value={selectedCountry}
            options={countryOptions}
            onChange={setSelectedCountry}
          />
        </div>
      </div>

      {isLocked && (
        <div className="bg-[#fff7ed] border border-[#fdba74] rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-[#f97316] rounded-xl size-10 flex items-center justify-center shrink-0">
              <Lock className="size-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-bold text-[#9a3412] text-[14px] mb-1">Payroll is locked</p>
              <p className="text-[13px] text-[#9a3412]/80">
                Editing actions are disabled for {selectedCountry}. Locked on{" "}
                {activeCountry.lockedAt ?? "the latest finalized run"}.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 mb-6 md:grid-cols-3">
        <SummaryCard
          title="Total Employees Covered"
          value={activeCountry.employeesCovered.toLocaleString("en-US")}
          subtitle={`Current statutory coverage for ${selectedCountry}`}
        />
        <SummaryCard
          title="Compliance Issues Count"
          value={statutoryIssues.length.toString()}
          subtitle={
            statutoryIssues.length === 0
              ? "No active issues found"
              : "Items requiring review"
          }
        />
        <SummaryCard
          title="Reports Generated"
          value={reportsGeneratedCount.toString()}
          subtitle="Generated reports available for download"
        />
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="size-4 text-[#3b82f6]" strokeWidth={1.9} />
              <h2 className="font-bold text-[#0f172b] text-[16px]">Compliance Setup</h2>
            </div>
            <p className="text-[13px] text-[#64748b]">
              Configure country rules once, then let the statutory view, deductions summary, and reports reflect the latest setup automatically.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
              <span
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  isDefaultRulesEnabled ? "bg-[#10b981]/20" : "bg-[#cbd5e1]"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    isDefaultRulesEnabled && "translate-x-4 bg-[#10b981]"
                  )}
                />
              </span>
              <div>
                <p className="text-[12px] font-bold text-[#0f172b]">Use Default Country Rules</p>
                <p className="text-[11px] text-[#64748b]">
                  Keep the built-in statutory rule set active.
                </p>
              </div>
              <input
                className="sr-only"
                type="checkbox"
                checked={isDefaultRulesEnabled}
                disabled={isLocked}
                onChange={(event) => handleToggleDefaultRules(event.target.checked)}
              />
            </label>

            <Button
              onClick={openAddRuleDialog}
              disabled={isLocked}
              className="bg-[#10b981] text-white hover:bg-[#059669]"
            >
              <Plus className="size-4" />
              Add Compliance Rule
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 mb-5">
          <p className="text-[13px] font-medium text-[#0f172b]">
            This rule will apply during payroll calculation.
          </p>
          <p className="mt-1 text-[12px] text-[#64748b]">
            Keep setup simple with country, rule type, value, who it applies to, and an effective date.
          </p>
        </div>

        {rulesTableRows.length === 0 ? (
          <EmptyState
            title="No rules configured for this country"
            description="Add a compliance rule to start driving statutory coverage and report generation."
          />
        ) : (
          <DataTable<RulesTableRow>
            columns={rulesColumns}
            data={rulesTableRows}
            footer={
              <p className="text-[12px] text-[#64748b]">
                Showing <span className="font-bold text-[#0f172b]">{rulesTableRows.length}</span>{" "}
                configured rule{rulesTableRows.length === 1 ? "" : "s"} for {selectedCountry}.
              </p>
            }
          />
        )}
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="size-4 text-[#10b981]" strokeWidth={1.9} />
              <h2 className="font-bold text-[#0f172b] text-[16px]">Payroll Lock & Finalization</h2>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <ToneBadge
                tone={
                  activeCountry.payrollStatus === "Locked"
                    ? "danger"
                    : activeCountry.payrollStatus === "Approved"
                    ? "success"
                    : "warning"
                }
              >
                {activeCountry.payrollStatus}
              </ToneBadge>
              {activeCountry.lockedAt && (
                <span className="text-[12px] text-[#64748b]">
                  Locked on {activeCountry.lockedAt}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#64748b] max-w-2xl">
              Approve the payroll compliance pack when checks are complete, then lock it to disable editing.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => updatePayrollStatus("Approved")}
              disabled={activeCountry.payrollStatus !== "Draft" || isLocked}
              className="border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
            >
              Approve Payroll
            </Button>
            <Button
              onClick={() => updatePayrollStatus("Locked")}
              disabled={activeCountry.payrollStatus !== "Approved" || isLocked}
              className="bg-[#10b981] hover:bg-[#059669] text-white"
            >
              Lock Payroll
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mb-6 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="size-4 text-[#3b82f6]" strokeWidth={1.9} />
            <h2 className="font-bold text-[#0f172b] text-[16px]">
              Statutory Compliance View - {selectedCountry}
            </h2>
          </div>

          <div className="grid gap-6 mb-6 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.5px] mb-3">
                Applicable Rules
              </p>
              {appliedCountryRules.length === 0 ? (
                <EmptyState
                  title="No active rules in use"
                  description="Add a custom rule or enable default rules to populate the statutory view."
                />
              ) : (
                <div className="space-y-3">
                  {appliedCountryRules.map((rule) => (
                    <div key={rule.id} className="rounded-xl border border-[#e2e8f0] p-4">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <p className="font-bold text-[#0f172b] text-[13px]">{rule.name}</p>
                        <ToneBadge tone={rule.source === "Custom" ? "success" : "neutral"}>
                          {rule.source}
                        </ToneBadge>
                      </div>
                      <p className="text-[12px] text-[#64748b] leading-5">
                        {describeRule(rule, activeCountry.currencyCode)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.5px]">
                  Deductions Summary
                </p>
                <ToneBadge tone="neutral">Read Only</ToneBadge>
              </div>
              {deductionRows.length === 0 ? (
                <EmptyState
                  title="No deductions to display"
                  description="Active rules will appear here as a read-only summary for payroll review."
                />
              ) : (
                <div className="space-y-3">
                  {deductionRows.map((deduction) => (
                    <div
                      key={deduction.id}
                      className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4"
                    >
                      <p className="text-[13px] font-bold text-[#0f172b] mb-1">
                        {deduction.label}
                      </p>
                      <p className="text-[12px] text-[#64748b]">{deduction.note}</p>
                      <p className="text-[15px] font-bold text-[#0f172b] mt-2">
                        {deduction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-5">
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.5px] mb-3">
              Compliance Issues
            </p>
            {statutoryIssues.length === 0 ? (
              <div className="rounded-xl border border-[#10b981]/20 bg-[#ecfdf5] p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#10b981]" strokeWidth={2} />
                  <p className="font-bold text-[#065f46] text-[13px]">
                    No compliance issues highlighted for {selectedCountry}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {statutoryIssues.map((issue) => (
                  <div key={issue.id} className="rounded-xl border border-[#e2e8f0] p-4">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <p className="font-bold text-[#0f172b] text-[13px]">{issue.title}</p>
                      <ToneBadge
                        tone={
                          issue.severity === "High"
                            ? "danger"
                            : issue.severity === "Medium"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {issue.severity}
                      </ToneBadge>
                    </div>
                    <p className="text-[12px] text-[#64748b] leading-5">{issue.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-4 text-[#f59e0b]" strokeWidth={1.9} />
            <h2 className="font-bold text-[#0f172b] text-[16px]">Recent Compliance Alerts</h2>
          </div>

          {recentAlerts.length === 0 ? (
            <EmptyState
              title="No recent alerts"
              description="This country currently has no new compliance warnings."
            />
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-[#e2e8f0] p-4">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <p className="font-bold text-[#0f172b] text-[13px]">{alert.title}</p>
                    <ToneBadge
                      tone={
                        alert.severity === "High"
                          ? "danger"
                          : alert.severity === "Medium"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {alert.severity}
                    </ToneBadge>
                  </div>
                  <p className="text-[12px] text-[#64748b] leading-5">{alert.description}</p>
                  <p className="text-[11px] text-[#94a3b8] mt-2">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="size-4 text-[#10b981]" strokeWidth={1.9} />
              <h2 className="font-bold text-[#0f172b] text-[16px]">Compliance Reports</h2>
            </div>
            <p className="text-[13px] text-[#64748b]">
              Filter reports by country, month, and department, then download the generated outputs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {["CSV", "XML", "API-ready"].map((format) => (
              <Button
                key={format}
                variant="outline"
                size="sm"
                onClick={() => handleExport(format)}
                className="border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
              >
                {format}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 mb-5 md:grid-cols-3">
          <SelectField
            label="Country"
            value={reportFilters.country}
            options={reportCountryOptions}
            onChange={(value) =>
              setReportFilters((current) => ({ ...current, country: value }))
            }
          />
          <SelectField
            label="Month"
            value={reportFilters.month}
            options={reportMonthOptions}
            onChange={(value) =>
              setReportFilters((current) => ({ ...current, month: value }))
            }
          />
          <SelectField
            label="Department"
            value={reportFilters.department}
            options={reportDepartmentOptions}
            onChange={(value) =>
              setReportFilters((current) => ({ ...current, department: value }))
            }
          />
        </div>

        {reportRows.length === 0 ? (
          <EmptyState
            title="No reports match the current filters"
            description="Adjust the report filters to view generated or pending compliance outputs."
          />
        ) : (
          <DataTable<ReportTableRow>
            columns={reportColumns}
            data={reportRows}
            footer={
              <p className="text-[12px] text-[#64748b]">
                Showing <span className="font-bold text-[#0f172b]">{reportRows.length}</span>{" "}
                report{reportRows.length === 1 ? "" : "s"}.
              </p>
            }
          />
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="size-4 text-[#3b82f6]" strokeWidth={1.9} />
            <h2 className="font-bold text-[#0f172b] text-[16px]">Audit Logs</h2>
          </div>

          {countryAuditLogs.length === 0 ? (
            <EmptyState
              title="No audit logs for this country"
              description="Audit entries will appear here when payroll or employee compliance changes are made."
            />
          ) : (
            <DataTable<ComplianceAuditLog> columns={auditColumns} data={countryAuditLogs} />
          )}
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-4 text-[#ef4444]" strokeWidth={1.9} />
            <h2 className="font-bold text-[#0f172b] text-[16px]">Compliance Alerts</h2>
          </div>

          {countryAlerts.length === 0 ? (
            <EmptyState
              title="No compliance alerts"
              description="This country does not have any active compliance issues."
            />
          ) : (
            <div className="space-y-3">
              {countryAlerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-[#e2e8f0] p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <ToneBadge
                      tone={
                        alert.severity === "High"
                          ? "danger"
                          : alert.severity === "Medium"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {alert.severity}
                    </ToneBadge>
                    {alert.reviewed && <ToneBadge tone="success">Reviewed</ToneBadge>}
                  </div>

                  <p className="font-bold text-[#0f172b] text-[13px] mb-1">{alert.title}</p>
                  <p className="text-[12px] text-[#64748b] leading-5 mb-3">
                    {alert.description}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewAlert(alert)}
                    disabled={isLocked || alert.reviewed}
                    className="border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
