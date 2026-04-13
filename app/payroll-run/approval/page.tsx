"use client";

import { CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { approvalWorkflow } from "@/lib/data/payroll";
import Link from "next/link";

function ApproverCard({ approver }: { approver: typeof approvalWorkflow[0] }) {
  const statusConfig = {
    approved: { icon: CheckCircle, color: "text-[#10b981]", bg: "bg-[#d1fae5]", label: "Approved" },
    pending: { icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#fef3c7]", label: "Pending" },
    rejected: { icon: AlertCircle, color: "text-[#ef4444]", bg: "bg-[#fee2e2]", label: "Rejected" },
  }[approver.status];

  const StatusIcon = statusConfig.icon;
  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl border-2 ${approver.status === "approved" ? "border-[#10b981]/30 bg-[#ecfdf5]/30" : "border-[#e2e8f0] bg-white"}`}>
      <div className={`${statusConfig.bg} rounded-full p-2.5`}>
        <StatusIcon className={`size-5 ${statusConfig.color}`} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <p className="font-bold text-[#0f172b] text-[15px]">{approver.name}</p>
        <p className="text-[#62748e] text-[13px]">{approver.role}</p>
        {approver.timestamp && <p className="text-[#90a1b9] text-[11px] mt-0.5">{approver.timestamp}</p>}
      </div>
      <span className={`${statusConfig.bg} ${statusConfig.color} text-[12px] font-bold px-3 py-1 rounded-lg`}>
        {statusConfig.label}
      </span>
    </div>
  );
}

export default function ApprovalPage() {
  const approvedCount = approvalWorkflow.filter((a) => a.status === "approved").length;
  const totalCount = approvalWorkflow.length;

  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/payroll-run" className="hover:text-[#10b981]">Payroll Run</Link>
        <ChevronRight className="size-3" strokeWidth={2} />
        <span className="text-[#0f172b] font-bold">Approval</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Payroll Approval – March 2026</h1>
          <p className="text-[14px] text-[#62748e]">Multi-level authorization workflow for payroll disbursement</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#fef3c7] rounded-xl px-4 py-2">
            <p className="font-bold text-[#92400e] text-[14px]">{totalCount - approvedCount} Pending</p>
          </div>
          <button className="bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] px-6 py-2.5 rounded-xl transition-colors shadow-sm">
            Approve & Proceed
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#0f172b] text-[16px]">Approval Progress</h2>
          <span className="text-[14px] font-bold text-[#10b981]">{approvedCount}/{totalCount} Approved</span>
        </div>
        <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full transition-all" style={{ width: `${(approvedCount / totalCount) * 100}%` }} />
        </div>
        <p className="text-[12px] text-[#90a1b9]">{Math.round((approvedCount / totalCount) * 100)}% complete — awaiting {totalCount - approvedCount} more approvals</p>
      </div>

      {/* Payroll Summary Card */}
      <div className="bg-gradient-to-br from-[#0f172b] to-[#1e293b] text-white rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/50 text-[12px] uppercase tracking-wider mb-1">Payroll Summary for Approval</p>
            <p className="text-[32px] font-bold tracking-tight">$565,240.00</p>
            <p className="text-[#10b981] text-[13px] font-bold mt-1">▲ 12.5% vs February 2026</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-1">March 2026</p>
            <p className="text-white font-bold text-[13px]">1,248 employees</p>
            <p className="text-white/50 text-[11px]">4 entities</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Gross Payroll", value: "$565,240" },
            { label: "Tax Withholdings", value: "$84,786" },
            { label: "Net Disbursement", value: "$480,454" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-[11px] mb-1">{item.label}</p>
              <p className="font-bold text-[16px]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approvers List */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0f172b] text-[16px] mb-5">Approval Chain</h2>
        <div className="space-y-3">
          {approvalWorkflow.map((approver, i) => (
            <div key={i} className="relative">
              <ApproverCard approver={approver} />
              {i < approvalWorkflow.length - 1 && (
                <div className="absolute left-[30px] bottom-0 translate-y-full h-3 w-0.5 bg-[#e2e8f0]" />
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] pt-5 mt-5 flex items-center justify-between">
          <p className="text-[14px] text-[#62748e]">
            After all approvals, payroll will be automatically queued for disbursement
          </p>
          <Link href="/payroll-run/disbursement">
            <button className="flex items-center gap-2 text-[#10b981] font-bold text-[14px] hover:opacity-80">
              View Disbursement <ChevronRight className="size-4" strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
