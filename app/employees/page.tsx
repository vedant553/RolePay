"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  Download,
  Plus,
  Upload,
  MoreHorizontal,
  Users,
  Globe,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { employees, employeeStats } from "@/lib/data/employees";

function ComplianceBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Compliant: "bg-[#d1fae5] text-[#065f46]",
    "Review Needed": "bg-[#fef3c7] text-[#92400e]",
    Pending: "bg-[#fee2e2] text-[#991b1b]",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-semibold ${styles[status] || "bg-[#f1f5f9] text-[#475569]"}`}>
      {status}
    </span>
  );
}

function RiskScore({ score }: { score: number }) {
  const color = score < 20 ? "#10b981" : score < 50 ? "#f59e0b" : "#ef4444";
  const bg = score < 20 ? "#d1fae5" : score < 50 ? "#fef3c7" : "#fee2e2";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 max-w-[80px] h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="px-2 py-0.5 rounded text-[12px] font-bold min-w-[36px] text-center" style={{ backgroundColor: bg, color }}>
        {score}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-[#d1fae5] text-[#065f46]",
    "On Leave": "bg-[#e0e7ff] text-[#3730a3]",
    Inactive: "bg-[#f1f5f9] text-[#475569]",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-semibold ${styles[status] || "bg-[#f1f5f9] text-[#475569]"}`}>
      {status}
    </span>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="bg-white border border-[#e2e8f0] text-[#0f172b] h-10 px-4 rounded-lg flex items-center gap-2 text-[14px] hover:bg-[#f8fafc] transition-colors">
      {label}
      <ChevronDown className="size-3.5 text-[#64748b]" strokeWidth={2} />
    </button>
  );
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0f172b] mb-2">Employees – Payroll Profiles</h1>
        <p className="text-[14px] text-[#64748b]">Manage employee payroll data, salary templates, and compliance status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: employeeStats.total.toLocaleString(), icon: Users, color: "bg-[#10b981]", sub: "Active workforce" },
          { label: "Active", value: employeeStats.active.toString(), icon: TrendingUp, color: "bg-[#3b82f6]", sub: `${employeeStats.onLeave} on leave` },
          { label: "Total Payroll", value: employeeStats.totalPayroll, icon: Globe, color: "bg-[#8b5cf6]", sub: "This month" },
          { label: "Compliant", value: `${Math.round((employeeStats.compliantCount / employeeStats.total) * 100)}%`, icon: AlertTriangle, color: "bg-[#f59e0b]", sub: `${employeeStats.compliantCount} employees` },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${card.color} rounded-lg size-9 flex items-center justify-center`}>
                <card.icon className="size-4 text-white" strokeWidth={1.75} />
              </div>
              <span className="text-[13px] text-[#64748b] font-medium">{card.label}</span>
            </div>
            <p className="text-[28px] font-bold text-[#0f172b] mb-1">{card.value}</p>
            <p className="text-[12px] text-[#94a3b8]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <button className="bg-[#10b981] text-white h-10 px-5 rounded-lg flex items-center gap-2 font-bold text-[14px] hover:bg-[#0ea370] transition-colors shadow-sm">
          <Plus className="size-4" strokeWidth={2.5} />
          Add Employee
        </button>
        <button className="bg-white border border-[#e2e8f0] text-[#0f172b] h-10 px-5 rounded-lg flex items-center gap-2 font-medium text-[14px] hover:bg-[#f8fafc] transition-colors">
          <Upload className="size-4" strokeWidth={2} />
          Import Payroll Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown label="Country" />
          <FilterDropdown label="Department" />
          <FilterDropdown label="Salary Template" />
          <FilterDropdown label="Risk Level" />
          <FilterDropdown label="Status" />
          <FilterDropdown label="Payroll Inclusion" />
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
              className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-10 pr-4 text-[14px] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#10b981]/40"
            />
          </div>
          <button className="bg-white border border-[#e2e8f0] text-[#0f172b] h-10 px-4 rounded-lg flex items-center gap-2 font-medium text-[14px] hover:bg-[#f8fafc] transition-colors">
            <Download className="size-4" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {["Employee", "Country", "Salary Template", "Gross Salary", "Variable %", "Compliance", "Risk Score", "Last Payroll", "Overrides", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-4 px-5 text-[12px] font-bold text-[#64748b] uppercase tracking-[0.5px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-[11px]">{employee.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-[#0f172b]">{employee.name}</p>
                        <p className="text-[12px] text-[#64748b]">{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#0f172b]">{employee.countryCode} {employee.country}</td>
                  <td className="py-4 px-5 text-[14px] text-[#0f172b]">{employee.salaryTemplate}</td>
                  <td className="py-4 px-5 font-bold text-[14px] text-[#0f172b]">{employee.grossSalary}</td>
                  <td className="py-4 px-5 text-[14px] text-[#0f172b]">{employee.variablePercent}%</td>
                  <td className="py-4 px-5"><ComplianceBadge status={employee.complianceStatus} /></td>
                  <td className="py-4 px-5"><RiskScore score={employee.riskScore} /></td>
                  <td className="py-4 px-5 text-[14px] text-[#0f172b]">{employee.lastPayrollMonth}</td>
                  <td className="py-4 px-5">
                    {employee.overrides > 0 ? (
                      <span className="bg-[#fef3c7] text-[#92400e] px-2 py-1 rounded text-[12px] font-bold">{employee.overrides}</span>
                    ) : (
                      <span className="text-[14px] text-[#94a3b8]">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5"><StatusBadge status={employee.status} /></td>
                  <td className="py-4 px-5">
                    <button className="text-[#64748b] hover:text-[#0f172b] transition-colors">
                      <MoreHorizontal className="size-[18px]" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#e2e8f0] px-5 py-4 flex items-center justify-between">
          <p className="text-[14px] text-[#64748b]">
            Showing <span className="font-bold text-[#0f172b]">{filtered.length}</span> of <span className="font-bold text-[#0f172b]">248</span> employees
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-[#e2e8f0] rounded-md text-[14px] text-[#64748b] hover:bg-[#f8fafc]">Previous</button>
            <button className="px-3 py-2 bg-[#10b981] text-white rounded-md text-[14px] font-bold">1</button>
            {[2, 3].map((n) => (
              <button key={n} className="px-3 py-2 border border-[#e2e8f0] rounded-md text-[14px] text-[#64748b] hover:bg-[#f8fafc]">{n}</button>
            ))}
            <button className="px-3 py-2 border border-[#e2e8f0] rounded-md text-[14px] text-[#64748b] hover:bg-[#f8fafc]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
