"use client";

import { CheckCircle, Clock, AlertCircle, ChevronRight, Lock, Users, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePayroll } from "@/lib/context/PayrollContext";
import { useState } from "react";

export default function PayrollApprovalPage() {
  const { status, approvers, approveStep, bulkApprove, bulkReject, proceedToDisbursement, currentStep, employees, targetRole, checkGovernanceRules } = usePayroll();
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);

  const allApproved = approvers.every(a => a.status === "approved");
  const anyRejected = approvers.some(a => a.status === "rejected");
  const isLocked = status === "locked" || status === "disbursement" || status === "reconciliation";

  const overriddenCount = employees.filter(e => e.baseOverride !== undefined || e.isExcluded || e.overtimeHours > 0).length;
  const governance = checkGovernanceRules();

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Structural Gate Warnings */}
      {(overriddenCount > 0 && !allApproved && !isLocked) && (
         <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-4">
            <AlertCircle className="size-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
               <p className="text-[14px] font-bold text-amber-800">Non-Standard Node Execution Detected</p>
               <p className="text-[13px] text-amber-700 font-medium">There are {overriddenCount} nodes mapped with active database bypass targets (overrides/exclusions). Authorizers must explicitly accept liability for mutated variables before finalizing signatures.</p>
            </div>
         </div>
      )}

      {/* Global Hierarchy Visual Flow */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden mb-8">
         <div className="bg-[#f8fafc] px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-[#0f172b]">Global Authorization Network Chain</h2>
            <div className="flex gap-2">
               {!isLocked && targetRole === "executive" && (
                 <>
                  <button onClick={bulkReject} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-red-100 transition-colors shadow-sm">Global Halting String</button>
                  <button onClick={()=>setShowOverrideWarning(true)} className="bg-[#0f172b] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm transition-transform active:scale-95">Executive Force Signature</button>
                 </>
               )}
            </div>
         </div>
         
         <div className="p-8">
            <div className="flex items-center justify-between relative">
               {/* Connecting Line */}
               <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e2e8f0] -translate-y-1/2 z-0" />
               
               {approvers.map((approver, idx) => {
                  const Icon = approver.status === "approved" ? CheckCircle : approver.status === "rejected" ? AlertCircle : Clock;
                  
                  return (
                     <div key={approver.id} className="relative z-10 flex flex-col items-center gap-3">
                        <div className={`size-14 rounded-full flex items-center justify-center border-[3px] shadow-sm transition-all ${
                           approver.status === "approved" ? "bg-emerald-50 border-[#10b981] text-[#10b981]" :
                           approver.status === "rejected" ? "bg-red-50 border-red-500 text-red-500" :
                           "bg-white border-[#cbd5e1] text-[#94a3b8]"
                        }`}>
                           <Icon className="size-6" strokeWidth={2.5}/>
                        </div>
                        <div className="text-center bg-white px-3 py-1.5 rounded-lg border border-[#e2e8f0] shadow-sm">
                           <p className="font-bold text-[13px] text-[#0f172b]">{approver.name}</p>
                           <p className="text-[11px] text-[#64748b] font-medium uppercase tracking-wider">{approver.role}</p>
                           {approver.timestamp && <p className="text-[10px] text-[#94a3b8] font-mono mt-1">{approver.timestamp}</p>}
                        </div>
                        {!isLocked && (
                           <div className="flex items-center gap-1 mt-1">
                              <button onClick={() => approveStep(approver.id, "approved")} className="text-[10px] font-bold bg-[#d1fae5] text-[#065f46] px-2 py-0.5 rounded hover:bg-[#a7f3d0] transition-colors uppercase">Sign</button>
                              <button onClick={() => approveStep(approver.id, "rejected")} className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200 transition-colors uppercase">Reject</button>
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>
         
         <div className="bg-[#f8fafc] px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#64748b]"><span className="font-bold">Protocol Bound:</span> Sequencing mathematically halts logic checks natively until signatures match globally.</span>
            <div className="flex items-center gap-3">
               {allApproved && !isLocked && !governance.passed && (
                  <span className="text-[12px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200">Governance Gate Open</span>
               )}
               <button 
                  disabled={!allApproved || isLocked || !governance.passed}
                  onClick={proceedToDisbursement}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-sm ${
                    isLocked ? "bg-slate-100 text-slate-400 border border-slate-200" :
                    allApproved && governance.passed ? "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95" : 
                    "bg-[#f1f5f9] text-[#94a3b8]"
                  }`}
               >
                 {isLocked ? "Sequence Secured" : "Initiate Disbursement Engine"} {(!isLocked && allApproved && governance.passed) && <ChevronRight className="size-4" />}
               </button>
            </div>
         </div>
      </div>

      {showOverrideWarning && (
         <div className="fixed inset-0 bg-[#0f172b]/60 z-[99] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
               <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="size-6 text-red-600" />
               </div>
               <h3 className="text-[18px] font-bold text-[#0f172b] mb-2">Executive Macro Override Signature</h3>
               <p className="text-[14px] text-[#64748b] mb-6 leading-relaxed">You are natively bypassing cryptographic sequence logic globally. This will instantly force approvals for all {approvers.length} nodes regardless of localized verification endpoints passively returning errors.</p>
               <div className="flex justify-end gap-3">
                  <button onClick={()=>setShowOverrideWarning(false)} className="px-4 py-2 rounded-lg font-bold text-[13px] text-[#64748b] hover:bg-[#f1f5f9] transition-colors">Cancel Array Bypass</button>
                  <button onClick={()=>{bulkApprove(); setShowOverrideWarning(false);}} className="bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2 rounded-lg font-bold text-[13px] shadow-md flex items-center gap-2">Execute Override Action</button>
               </div>
            </div>
         </div>
      )}

      {/* Breadcrumb Navigation Return */}
      <Link href="/payroll-run">
        <button className="text-[#64748b] font-bold text-[13px] hover:text-[#0f172b] transition-colors flex items-center gap-1">
           <ChevronRight className="rotate-180 size-4" /> Return to Simulation Array Control
        </button>
      </Link>
    </div>
  );
}
