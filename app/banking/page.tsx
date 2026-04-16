"use client";

import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Download, Database, ShieldAlert, CreditCard, Building2, Search, ArrowRightLeft } from "lucide-react";
import { employees } from "@/lib/data/employees";

// --- MOCK DATA ---
const MOCK_PAYMENTS = employees.slice(0, 10).map((e, index) => ({
  id: `PAY-${Date.now()}-${index}`,
  employee: e.name,
  avatar: e.name.charAt(0),
  amount: parseFloat(e.grossSalary.replace(/[^0-9.]/g, '') || "5000") * 0.8,
  mode: index % 3 === 0 ? "Bank Transfer" : "NEFT",
  txId: index === 3 ? "—" : `TXN982${index}0182X`,
  status: index === 3 ? "Failed" : index === 8 ? "Pending" : "Paid",
  date: "Oct 28, 2026"
}));

const MOCK_BANK_ACCOUNTS = employees.map((e, index) => ({
  id: e.id,
  employee: e.name,
  avatar: e.avatar || e.name.charAt(0),
  account: index === 2 ? "—" : `**** **** ${String(1234 + index)}`,
  ifsc: index === 2 ? "—" : index === 4 ? "INVALID0X92" : "CHAS02931X",
  bankName: index === 2 ? "—" : "Chase Bank NA",
  status: index === 2 ? "Missing" : index === 4 ? "Invalid" : "Valid",
  suggestion: index === 2 ? "Account not provided" : index === 4 ? "IFSC format mismatch" : ""
}));

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

export default function BankingPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  const [paymentData, setPaymentData] = useState(MOCK_PAYMENTS);
  const [bankData, setBankData] = useState(MOCK_BANK_ACCOUNTS);
  
  // Connectors State
  const [tallySync, setTallySync] = useState({ connected: true, lastSynced: "Today, 08:30 AM", syncing: false });
  const [sapSync, setSapSync] = useState({ connected: false, lastSynced: "Never", error: "Authentication Failed", syncing: false });

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRetryPayment = (id: string) => {
    setPaymentData(prev => prev.map(p => p.id === id ? { ...p, status: "Pending", txId: "TXN-RETRY-PEND" } : p));
    triggerToast("Payment queued for retry.", "warning");
  };

  const handleSyncSystems = (system: "all" | "tally" | "sap") => {
    if (system === "tally" || system === "all") {
       setTallySync(prev => ({...prev, syncing: true}));
       setTimeout(() => {
          setTallySync({ connected: true, lastSynced: "Just now", syncing: false });
          triggerToast("Tally ledger synchronized securely.");
       }, 1500);
    }
    if (system === "sap" || system === "all") {
       setSapSync(prev => ({...prev, syncing: true}));
       setTimeout(() => {
          setSapSync({ connected: false, lastSynced: "Failed", error: "Connection Timeout", syncing: false });
          triggerToast("SAP sync failed due to proxy timeout.", "error");
       }, 2000);
    }
  };

  // KPIs Calculations
  const validCount = bankData.filter(b => b.status === "Valid").length;
  const validPercentage = Math.round((validCount / bankData.length) * 100);
  const failedPayments = paymentData.filter(p => p.status === "Failed").length;

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />

      {/* Header Area */}
      <div className="flex items-end justify-between mb-8">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b]">Banking & Accounting</h1>
           <p className="text-[14px] text-[#64748b]">Ensure payments, validate banks, and sync with financial systems natively.</p>
         </div>
         <div className="flex items-center gap-3">
           <button onClick={() => triggerToast("XML Package downloading...", "success")} className="bg-white border border-gray-300 text-gray-700 h-[38px] px-4 rounded-lg flex items-center gap-2 font-medium text-[13px] hover:bg-gray-50 transition-colors shadow-sm">
             <Download className="size-4" /> Export XML/JSON
           </button>
           <button onClick={() => handleSyncSystems("all")} className="bg-[#0f172b] text-white h-[38px] px-4 rounded-lg flex items-center gap-2 font-medium text-[13px] hover:bg-[#1a2642] transition-colors shadow-sm">
             <ArrowRightLeft className="size-4" /> Sync All Systems
           </button>
         </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[13px] text-gray-500 font-bold">Bank Verification</span>
               <ShieldAlert className="size-4 text-blue-500" />
            </div>
            <div className="flex items-end justify-between">
               <p className="text-[28px] font-black text-gray-900 leading-none">{validPercentage}% <span className="text-[14px] text-gray-400 font-medium">Valid</span></p>
               {validPercentage < 100 && <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">{bankData.length - validCount} Issues</span>}
            </div>
         </div>

         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[13px] text-gray-500 font-bold">Failed Payouts</span>
               <AlertCircle className={`size-4 ${failedPayments > 0 ? "text-red-500" : "text-gray-400"}`} />
            </div>
            <div className="flex items-end justify-between">
               <p className="text-[28px] font-black text-gray-900 leading-none">{failedPayments}</p>
               {failedPayments > 0 && <span className="text-[12px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md cursor-pointer hover:underline" onClick={() => setActiveTab("payments")}>Action Required</span>}
            </div>
         </div>

         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[13px] text-gray-500 font-bold">Tally / Accounting Sync</span>
               <Database className="size-4 text-[#10b981]" />
            </div>
            <div className="flex items-end justify-between">
               <p className="text-[16px] font-bold text-gray-900 leading-tight">Ledger Active</p>
               <span className="text-[12px] font-medium text-gray-500">Last: {tallySync.lastSynced}</span>
            </div>
         </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden min-h-[500px] flex flex-col">
         
         {/* Top Tabs */}
         <div className="flex border-b border-gray-200 bg-gray-50/50 px-6 pt-2 gap-8">
            <button onClick={() => setActiveTab("payments")} className={`pb-3 pt-2 text-[13px] font-bold tracking-wide border-b-2 transition-colors ${activeTab === "payments" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               Payment Processing Logs
            </button>
            <button onClick={() => setActiveTab("banks")} className={`pb-3 pt-2 text-[13px] font-bold tracking-wide border-b-2 transition-colors ${activeTab === "banks" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               Bank Automations
            </button>
            <button onClick={() => setActiveTab("integrations")} className={`pb-3 pt-2 text-[13px] font-bold tracking-wide border-b-2 transition-colors ${activeTab === "integrations" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               Accounting Integrations
            </button>
         </div>

         {/* TAB CONTENTS */}

         {/* TAB 1: PAYMENTS */}
         {activeTab === "payments" && (
            <div className="flex-1 overflow-x-auto flex flex-col">
               <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                     <input type="text" placeholder="Search parameters..." className="w-[200px] pl-8 pr-3 py-1.5 text-[12px] border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none" />
                  </div>
                  <button onClick={() => setPaymentData(MOCK_PAYMENTS)} className="text-[12px] font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1.5"><RefreshCw className="size-3.5" /> Reload Logs</button>
               </div>
               <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-200">
                        <tr>{["Target Entity", "Disbursement", "Transmit Mode", "TxID Network", "Date Executed", "Status", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {paymentData.map(log => (
                           <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-6 flex items-center gap-2">
                                 <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-600">{log.avatar}</div>
                                 <span className="font-bold text-[13px] text-gray-900">{log.employee}</span>
                              </td>
                              <td className="py-3 px-6 text-[13px] font-bold text-gray-800">${log.amount.toLocaleString()}</td>
                              <td className="py-3 px-6 text-[13px] text-gray-600">{log.mode}</td>
                              <td className="py-3 px-6 text-[13px] font-mono text-gray-500">{log.txId}</td>
                              <td className="py-3 px-6 text-[13px] text-gray-600">{log.date}</td>
                              <td className="py-3 px-6">
                                 <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border ${
                                    log.status === "Paid" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20" : log.status === "Failed" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                 }`}>
                                    {log.status}
                                 </span>
                              </td>
                              <td className="py-3 px-6 text-left">
                                 <button onClick={() => handleRetryPayment(log.id)} disabled={log.status !== "Failed"} className={`text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors ${
                                    log.status === "Failed" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                 }`}>
                                    Retry Ping
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* TAB 2: BANK VALIDATION */}
         {activeTab === "banks" && (
            <div className="flex-1 overflow-x-auto flex flex-col">
               <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3 bg-red-50 text-red-700 text-[12px] font-bold shrink-0">
                  <AlertCircle className="size-4" /> Resolve Invalid constraints before executing disbursements.
               </div>
               <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-200">
                        <tr>{["Employee Link", "Bank Entity", "Masked Account", "IFSC / SWIFT", "State", "AI Helper"].map((h, i) => <th key={i} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-[13px]">
                        {bankData.map(b => (
                           <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2"><CreditCard className="size-4 text-gray-400" /> {b.employee}</td>
                              <td className="py-4 px-6 font-medium text-gray-700">{b.bankName}</td>
                              <td className="py-4 px-6 font-mono font-medium text-gray-600">{b.account}</td>
                              <td className="py-4 px-6 font-mono text-gray-500">{b.ifsc}</td>
                              <td className="py-4 px-6">
                                 <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                    b.status === "Valid" ? "bg-[#10b981]/10 text-[#10b981]" : b.status === "Missing" ? "bg-amber-100 text-amber-700" : "bg-red-50 border border-red-200 text-red-600"
                                 }`}>
                                    {b.status}
                                 </span>
                              </td>
                              <td className="py-4 px-6">
                                 {b.suggestion ? (
                                    <span className={`text-[12px] font-bold ${b.status === "Missing" ? "text-amber-600" : "text-red-500"}`}>{b.suggestion}</span>
                                 ) : <span className="text-gray-400 text-[12px] font-medium">— Evaluated OK —</span>}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         
         {/* TAB 3: INTEGRATIONS */}
         {activeTab === "integrations" && (
            <div className="flex-1 bg-gray-50/50 p-6 flex flex-col lg:flex-row gap-6">
               
               {/* Tally Box */}
               <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="size-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                           <Database className="size-6 text-emerald-600" />
                        </div>
                        <div>
                           <h3 className="text-[18px] font-bold text-gray-900 leading-tight">Tally ERP</h3>
                           <p className="text-[13px] text-gray-500 font-medium mt-0.5">Automated Ledger Synchronization</p>
                        </div>
                     </div>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${tallySync.connected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        <span className={`size-1.5 rounded-full ${tallySync.connected ? "bg-emerald-500" : "bg-gray-400"}`}></span> Connected
                     </span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
                     <div className="flex justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Last Transaction Sync</span>
                        <span className="text-[13px] font-bold text-gray-900">{tallySync.lastSynced}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Socket Mapping</span>
                        <span className="text-[13px] font-bold text-gray-900">api.internal-erp.local:8080</span>
                     </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                     <button onClick={() => triggerToast("Tally XML Generated for localized routing.", "success")} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 rounded-lg text-[13px] transition-colors flex items-center justify-center gap-2">
                        Export XML
                     </button>
                     <button disabled={tallySync.syncing} onClick={() => handleSyncSystems("tally")} className="flex-1 bg-[#0f172b] hover:bg-[#1f2d4e] text-white font-bold py-2 rounded-lg text-[13px] transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2">
                        {tallySync.syncing ? <RefreshCw className="size-4 animate-spin" /> : "Sync Ledger"}
                     </button>
                  </div>
               </div>

               {/* SAP Box */}
               <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="size-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                           <Building2 className="size-6 text-blue-600" />
                        </div>
                        <div>
                           <h3 className="text-[18px] font-bold text-gray-900 leading-tight">SAP Enterprise</h3>
                           <p className="text-[13px] text-gray-500 font-medium mt-0.5">Cloud API Direct Link</p>
                        </div>
                     </div>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${sapSync.connected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                        <span className={`size-1.5 rounded-full ${sapSync.connected ? "bg-emerald-500" : "bg-red-500"}`}></span> {sapSync.connected ? "Connected" : "Error"}
                     </span>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 mb-6">
                     <div className="flex justify-between mb-2">
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Last Success</span>
                        <span className="text-[13px] font-bold text-gray-900">{sapSync.lastSynced}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Fatal Error Tree</span>
                        <span className="text-[13px] font-bold text-red-600 truncate max-w-[200px] text-right" title={sapSync.error}>{sapSync.error}</span>
                     </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                     <button onClick={() => triggerToast("SAP Payroll mapping block bypassed mapping verification.", "warning")} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 rounded-lg text-[13px] transition-colors flex items-center justify-center gap-2">
                        Push Data Node
                     </button>
                     <button disabled={sapSync.syncing} onClick={() => handleSyncSystems("sap")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-[13px] transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2">
                        {sapSync.syncing ? <RefreshCw className="size-4 animate-spin" /> : "Authenticate Sync"}
                     </button>
                  </div>
               </div>

            </div>
         )}
      </div>
    </div>
  );
}
