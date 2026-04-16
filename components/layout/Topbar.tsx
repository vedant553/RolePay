"use client";

import { usePathname } from "next/navigation";
import {
  Globe,
  ChevronDown,
  Search,
  Bell,
  AlertTriangle,
  Plus,
} from "lucide-react";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/salary": "Salary Management",
  "/attendance": "Attendance Sync",
  "/payroll-run": "Payroll Run",
  "/payroll-run/approval": "Approval",
  "/payroll-run/disbursement": "Disbursement",
  "/payroll-run/reconciliation": "Reconciliation",
  "/payroll-run/reporting": "Reporting",
  "/compliance": "Compliance",
  "/compliance/create": "Create Rule",
  "/reports-analytics": "Reports & Analytics",
  "/ai-audit": "AI & Audit",
  "/banking": "Banking & Accounting",
  "/settings": "Settings",
};

function getBreadcrumb(pathname: string): { parent: string; current: string } {
  const label = routeLabels[pathname] || "Page";
  if (pathname === "/") return { parent: "", current: "Dashboard" };
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1) return { parent: "Dashboard", current: label };
  const parentPath = "/" + segments.slice(0, -1).join("/");
  const parent = routeLabels[parentPath] || "Dashboard";
  return { parent, current: label };
}

export default function Topbar() {
  const pathname = usePathname();
  const { parent, current } = getBreadcrumb(pathname);

  return (
    <header className="fixed top-0 left-[264px] right-0 h-16 bg-white border-b border-[#e2e8f0] z-40 flex items-center justify-between px-8 gap-6">
      {/* Left */}
      <div className="flex items-center gap-6 shrink-0">
        {/* Global View Dropdown */}
        <button className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-1.5 hover:bg-slate-50 transition-colors">
          <Globe className="size-[14px] text-[#10b981]" strokeWidth={2} />
          <span className="text-[12px] font-bold text-[#314158]">Global View</span>
          <ChevronDown className="size-[12px] text-[#90a1b9]" strokeWidth={2} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px]">
          {parent && (
            <>
              <span className="text-[#90a1b9]">{parent}</span>
              <span className="text-[#90a1b9]">/</span>
            </>
          )}
          <span className="font-bold text-[#0f172b]">{current}</span>
        </div>
      </div>

      {/* Center Search */}
      <div className="flex items-center gap-3 flex-1 max-w-[380px]">
        {/* Regular Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#90a1b9]" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-9 pr-4 text-[14px] placeholder:text-[#90a1b9] focus:outline-none focus:border-[#10b981]/40 transition-colors"
          />
        </div>
        {/* AI Search */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/40 border border-[rgba(16,185,129,0.15)] rounded px-1 py-0.5">
            <span className="text-[10px] font-bold text-[#10b981] leading-none">AI</span>
          </div>
          <input
            type="text"
            placeholder="Ask Payroll AI..."
            className="w-full h-10 bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.2)] rounded-xl pl-12 pr-4 text-[14px] placeholder:text-[rgba(16,185,129,0.4)] focus:outline-none focus:border-[rgba(16,185,129,0.4)] transition-colors"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Bell */}
        <div className="relative">
          <Bell className="size-5 text-[#90a1b9]" strokeWidth={1.75} />
          <div className="absolute -top-0.5 -right-0.5 size-2 bg-amber-400 rounded-full border border-white" />
        </div>

        {/* Warning */}
        <AlertTriangle className="size-5 text-[#FE9A00]" strokeWidth={1.75} />

        {/* Run Payroll */}
        <button className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl px-4 py-2 text-[14px] font-bold transition-colors shadow-[0px_4px_12px_rgba(16,185,129,0.3)]">
          <Plus className="size-4" strokeWidth={2.5} />
          Run Payroll
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[#e2e8f0]" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[14px] font-bold text-[#0f172b] leading-tight">Alex Sterling</p>
            <p className="text-[10px] text-[#90a1b9] uppercase tracking-[0.25px]">Head of Payroll</p>
          </div>
          <div className="size-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#0891b2] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-white font-bold text-[12px]">AS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
