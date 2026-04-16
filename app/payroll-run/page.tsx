"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, ChevronRight, Check, X, Bell, Play, Download, Lock } from "lucide-react";
import { employees } from "@/lib/data/employees";

// --- MOCK DATA ---
const MOCK_REVIEW_DATA = employees.slice(0, 5).map((e, i) => ({
  id: e.id,
  name: e.name,
  avatar: e.avatar || e.name.charAt(0),
  gross: parseFloat(e.grossSalary.replace(/[^0-9.]/g, '') || "5000"),
  deductions: i === 2 ? 800 : 450,
  flagged: i === 2,
}));

const MOCK_APPROVERS = [
  { id: 1, name: "Sarah Johnson", role: "VP Engineering", status: "Approved" },
  { id: 2, name: "Marcus Chen", role: "Financial Controller", status: "Pending" },
  { id: 3, name: "Elena Rodriguez", role: "HR Manager", status: "Approved" },
];

function Toast({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-xl font-medium text-white transition-all transform ${
      toast.type === "success" ? "bg-[#10b981]" : toast.type === "error" ? "bg-red-500" : "bg-amber-500"
    }`}>
      {toast.message}
    </div>
  );
}

export default function PayrollRunPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [month, setMonth] = useState("April 2026");
  const [overallStatus, setOverallStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started");
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  // Step 2 State
  const [reviewData, setReviewData] = useState(MOCK_REVIEW_DATA);
  const [isEditingRow, setIsEditingRow] = useState<string | null>(null);

  // Step 3 State
  const [approvers, setApprovers] = useState(MOCK_APPROVERS);

  // Step 4 State
  const [disbursementData, setDisbursementData] = useState(MOCK_REVIEW_DATA.map(d => ({ ...d, paymentStatus: "Pending" })));
  const [payrollLocked, setPayrollLocked] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const steps = [
    { num: 1, label: "Prepare" },
    { num: 2, label: "Review" },
    { num: 3, label: "Approval" },
    { num: 4, label: "Disbursement" }
  ];

  // Logic Handlers
  const handleInitialize = () => {
    setCurrentStep(2);
    setOverallStatus("In Progress");
    triggerToast("Payroll initialized and data locked for review.", "success");
  };

  const handleApproveAll = () => {
    setApprovers(approvers.map(a => ({...a, status: "Approved"})));
    triggerToast("All manual approvals processed.", "success");
  };

  const handleProcessPayments = () => {
    setDisbursementData(disbursementData.map((d, i) => ({
       ...d, 
       paymentStatus: i === 2 ? "Failed" : "Paid"
    })));
    triggerToast("Payments dispatched. 1 process failed.", "warning");
  };

  const handleRetryFailed = () => {
    setDisbursementData(disbursementData.map(d => d.paymentStatus === "Failed" ? { ...d, paymentStatus: "Paid" } : d));
    triggerToast("Retry successful. All payments cleared.", "success");
  };

  const handleLockPayroll = () => {
    setPayrollLocked(true);
    setOverallStatus("Completed");
    setLockModalOpen(false);
    triggerToast("Payroll successfully locked and archived.", "success");
  };

  return (
    <div className="relative pb-10 max-w-6xl mx-auto">
      <Toast toast={toast} />

      {/* Lock Confirmation Modal */}
      {lockModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172b]/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200">
               <div className="size-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="size-6 text-amber-600" />
               </div>
               <h3 className="text-[18px] font-bold text-gray-900 mb-2">Lock Payroll Cycle?</h3>
               <p className="text-[13px] text-gray-500 mb-6 font-medium">This action is irreversible. Editing or rolling back this execution cycle will require manual database overrides. Ensure all payslips are checked.</p>
               <div className="flex gap-3 justify-end.">
                  <button onClick={() => setLockModalOpen(false)} className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[13px] rounded-lg w-1/2 transition-colors">Cancel</button>
                  <button onClick={handleLockPayroll} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-200 text-white font-bold text-[13px] rounded-lg w-1/2 transition-colors">Confirm Lock</button>
               </div>
            </div>
         </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b] tracking-tight">Payroll Run</h1>
           <p className="text-[14px] text-gray-500 font-medium mt-1">Execute salary processing sequentially for the selected cycle.</p>
         </div>
         <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
           <select disabled={overallStatus !== "Not Started"} value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-1.5 text-[14px] font-bold text-gray-800 bg-transparent border-r border-gray-200 outline-none disabled:opacity-50">
             <option>May 2026</option>
             <option>April 2026</option>
             <option>March 2026</option>
           </select>
           <div className="px-3">
              <span className={`inline-flex px-2.5 py-1 rounded text-[12px] font-bold ${
                 overallStatus === "Not Started" ? "bg-gray-100 text-gray-600" : overallStatus === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-[#10b981]/10 text-[#10b981]"
              }`}>
                 {overallStatus === "Completed" && <CheckCircle className="size-3.5 mr-1" />}
                 {overallStatus}
              </span>
           </div>
         </div>
      </div>

      {/* Step Tracker */}
      <div className="mb-10 bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between shadow-sm relative">
         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-10 transform -translate-y-1/2" />
         {steps.map((step, i) => {
            const isCompleted = step.num < currentStep;
            const isActive = step.num === currentStep;
            const isPending = step.num > currentStep;
            
            return (
               <div key={step.num} className="flex flex-col items-center gap-2 bg-white px-4">
                  <div className={`size-10 rounded-full flex items-center justify-center font-bold text-[14px] border-2 transition-all ${
                     isCompleted ? "bg-[#10b981] border-[#10b981] text-white" : isActive ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50" : "bg-white border-gray-300 text-gray-400"
                  }`}>
                     {isCompleted ? <Check className="size-5" strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`text-[13px] font-bold ${isActive ? "text-blue-700" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</span>
               </div>
            );
         })}
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden min-h-[400px]">
         
         {/* STEP 1: PREPARE */}
         {currentStep === 1 && (
            <div className="p-8 max-w-3xl mx-auto flex flex-col items-center pt-12">
               <div className="mb-8 text-center">
                  <p className="text-[14px] text-gray-500 font-bold uppercase tracking-widest mb-2">Target Data Set</p>
                  <p className="text-[48px] font-black text-gray-900 leading-none">248 <span className="text-[20px] text-gray-400">Employees</span></p>
               </div>
               
               <div className="w-full space-y-3 mb-10">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4">
                     <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                     <div>
                        <p className="text-[14px] font-bold text-amber-900">Missing Data Attributes Detected</p>
                        <ul className="text-[13px] text-amber-700 font-medium mt-1 list-disc list-inside">
                           <li>14 employees missing verified bank details.</li>
                           <li>2 active assignments missing base salary structures.</li>
                        </ul>
                     </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                     <Bell className="size-5 text-gray-400 shrink-0" />
                     <p className="text-[13px] font-medium text-gray-600">Attendance variables synced securely. Next manual sync scheduled tomorrow.</p>
                  </div>
               </div>

               <button onClick={handleInitialize} className="bg-blue-600 flex items-center justify-center gap-2 text-white font-bold text-[14px] w-full py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <Play className="size-5" /> Initialize Payroll Batch
               </button>
            </div>
         )}

         {/* STEP 2: REVIEW */}
         {currentStep === 2 && (
            <div className="flex flex-col h-full">
               <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <p className="text-[14px] font-bold text-gray-800">Data Review <span className="text-gray-400 font-medium ml-2">Resolve flags before approval flow.</span></p>
                  <button onClick={() => setCurrentStep(3)} className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2">
                     Submit for Approval <ChevronRight className="size-4" />
                  </button>
               </div>
               <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-200">
                        <tr>
                           {["Employee", "Gross Salary", "Deductions", "Net Salary", "Status", "Actions"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {reviewData.map((row) => (
                           <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${row.flagged ? 'bg-red-50/50' : ''}`}>
                              <td className="py-4 px-6 flex items-center gap-3">
                                 <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-gray-600">{row.avatar}</div>
                                 <span className="font-bold text-[13px] text-gray-900">{row.name}</span>
                              </td>
                              <td className="py-4 px-6 text-[13px] font-medium text-gray-700">${row.gross.toLocaleString()}</td>
                              <td className="py-4 px-6 text-[13px] font-medium text-gray-700">
                                 {isEditingRow === row.id ? (
                                    <input autoFocus onBlur={() => setIsEditingRow(null)} onChange={(e) => setReviewData(prev => prev.map(r => r.id === row.id ? {...r, deductions: Number(e.target.value)} : r))} value={row.deductions} className="w-[80px] p-1 border rounded text-[12px] outline-none" />
                                 ) : (
                                    <span>${row.deductions.toLocaleString()}</span>
                                 )}
                              </td>
                              <td className="py-4 px-6 text-[14px] font-bold text-[#10b981]">${(row.gross - row.deductions).toLocaleString()}</td>
                              <td className="py-4 px-6">
                                 <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${row.flagged ? "bg-red-100 text-red-700" : "bg-[#10b981]/10 text-[#10b981]"}`}>
                                    {row.flagged ? "Issue Flagged" : "OK"}
                                 </span>
                              </td>
                              <td className="py-4 px-6">
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => setIsEditingRow(row.id)} className="text-[12px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => setReviewData(prev => prev.map(r => r.id === row.id ? {...r, flagged: !r.flagged} : r))} className="text-[12px] font-bold text-gray-500 hover:text-gray-900 px-2 py-1">Toggle Flag</button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* STEP 3: APPROVAL */}
         {currentStep === 3 && (
            <div className="flex flex-col h-full">
               <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <p className="text-[14px] font-bold text-gray-800">Sign-Off Matrix <span className="text-gray-400 font-medium ml-2">Requires all managerial overrides.</span></p>
                  <button onClick={() => setCurrentStep(4)} disabled={approvers.some(a => a.status !== "Approved")} className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-blue-700 transition-colors flex items-center gap-2">
                     Submit for Disbursement <ChevronRight className="size-4" />
                  </button>
               </div>
               
               <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                     <p className="text-[13px] font-bold text-gray-600">Pending Authorization: <span className="text-gray-900">{approvers.filter(a => a.status === "Approved").length} of {approvers.length} Complete</span></p>
                     <button onClick={handleApproveAll} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors">Force Approve (Admin)</button>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <table className="w-full text-left">
                        <thead className="bg-[#f8fafc] border-b border-gray-200">
                           <tr>{["Approver Level", "Role", "Status Audit", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[13px]">
                           {approvers.map(a => (
                              <tr key={a.id} className="hover:bg-gray-50">
                                 <td className="py-4 px-6 font-bold text-gray-900">{a.name}</td>
                                 <td className="py-4 px-6 font-medium text-gray-600">{a.role}</td>
                                 <td className="py-4 px-6">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${a.status === "Approved" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-amber-100 text-amber-700"}`}>
                                       {a.status}
                                    </span>
                                 </td>
                                 <td className="py-4 px-6">
                                    <button disabled={a.status === "Approved"} onClick={() => setApprovers(prev => prev.map(p => p.id === a.id ? {...p, status: "Approved"} : p))} className="text-[12px] font-bold disabled:opacity-50 disabled:text-gray-400 text-blue-600 hover:underline">Mark Approved</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         )}

         {/* STEP 4: DISBURSEMENT */}
         {currentStep === 4 && (
            <div className="flex flex-col h-full relative">
               
               {/* Lock overlay if finished */}
               {payrollLocked && (
                  <div className="absolute inset-0 z-30 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                     <div className="bg-white border-2 border-[#10b981] p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                        <div className="size-16 bg-[#10b981]/10 rounded-full flex items-center justify-center mb-4"><CheckCircle className="size-8 text-[#10b981]" /></div>
                        <h2 className="text-[24px] font-black text-gray-900 mb-1">Cycle Locked & Completed</h2>
                        <p className="text-[13px] font-medium text-gray-500 mb-6">Execution phase finished seamlessly. Disbursals are in transit.</p>
                        <div className="flex gap-3 w-full">
                           <button className="flex-1 border text-[13px] font-bold border-gray-300 rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50 text-gray-700"><Download className="size-4" /> Reports</button>
                           <button onClick={() => {setCurrentStep(1); setOverallStatus("Not Started"); setPayrollLocked(false);}} className="flex-1 font-bold text-[13px] bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-2">Start New Run</button>
                        </div>
                     </div>
                  </div>
               )}

               <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <p className="text-[14px] font-bold text-gray-800">Disbursement Ledger</p>
                  <div className="flex gap-2">
                     <button onClick={handleProcessPayments} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-blue-700 transition-colors shadow-sm">
                        Process Payments
                     </button>
                     <button onClick={handleRetryFailed} className="bg-white border border-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-gray-50 transition-colors">
                        Retry Failed
                     </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto flex-1 mb-20 bg-white">
                  <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-200">
                        <tr>{["Target Entity", "Disbursement Matrix", "Current Status"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-[13px]">
                        {disbursementData.map(d => (
                           <tr key={d.id}>
                              <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2"><div className="size-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 shrink-0">{d.avatar}</div> {d.name}</td>
                              <td className="py-4 px-6 font-bold text-[#10b981]">${(d.gross - d.deductions).toLocaleString()}</td>
                              <td className="py-4 px-6">
                                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                    d.paymentStatus === "Pending" ? "bg-amber-100 text-amber-700" : d.paymentStatus === "Paid" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-red-50 border border-red-200 text-red-600"
                                 }`}>
                                    {d.paymentStatus}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <button onClick={() => triggerToast("Generating PDFs...", "success")} className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-2">
                     <Download className="size-4" /> Download All Payslips
                  </button>
                  <button onClick={() => setLockModalOpen(true)} className="bg-gray-900 text-white font-bold px-6 py-2 rounded-lg text-[13px] hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                     <Lock className="size-4 text-gray-400" /> Lock Payroll Cycle
                  </button>
               </div>
            </div>
         )}
      </div>

    </div>
  );
}
