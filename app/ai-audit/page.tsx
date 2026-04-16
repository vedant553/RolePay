"use client";

import { useState } from "react";
import { Search, AlertTriangle, ShieldCheck, FileKey, X, FilterX, Clock, MapPin, Download, CheckCircle, ArrowRightLeft, Database, AlertCircle } from "lucide-react";

// --- MOCK DATA ---
const MOCK_AUDIT_LOGS = [
  { id: "LOG-01", timestamp: "Oct 28 09:12 AM", user: "HR Admin", action: "Updated", module: "Employees", desc: "Modified structure for John Doe", risk: "Medium", before: "Basic: $4000", after: "Basic: $4500" },
  { id: "LOG-02", timestamp: "Oct 28 08:30 AM", user: "System", action: "Generated", module: "Attendance", desc: "Automated daily biometric sync", risk: "Low", before: "Sync: Pending", after: "Sync: Complete" },
  { id: "LOG-03", timestamp: "Oct 27 05:45 PM", user: "Finance Lead", action: "Approved", module: "Payroll Run", desc: "Locked cycle for Region: USA", risk: "High", before: "Status: Pending", after: "Status: Locked" },
  { id: "LOG-04", timestamp: "Oct 27 02:10 PM", user: "HR Admin", action: "Deleted", module: "Employees", desc: "Purged contract worker record", risk: "High", before: "Active Record", after: "Nullified" },
  { id: "LOG-05", timestamp: "Oct 26 11:22 AM", user: "System", action: "Updated", module: "Banking", desc: "API response for Tally Sync", risk: "Low", before: "Ping", after: "Pong" },
];

const MOCK_FLAGGED_ISSUES = [
  { id: "FLAG-1", type: "Data mismatch", area: "Payroll", desc: "Calculated Net Salary deviates from rigid template structure by 8%.", severity: "High", status: "Open" },
  { id: "FLAG-2", type: "Missing info", area: "Compliance", desc: "Tax identifiers missing for 3 new global contractors.", severity: "Medium", status: "Open" },
  { id: "FLAG-3", type: "Failed transaction", area: "Banking", desc: "Batch payment rejected. Invalid IFSC code.", severity: "High", status: "Resolved" },
];

const MOCK_COMPLIANCE = [
  { id: "COMP-1", type: "Tax Code Updates", region: "USA", status: "Pending", lastUpdated: "Today" },
  { id: "COMP-2", type: "PF Contributions", region: "India", status: "Compliant", lastUpdated: "Yesterday" },
  { id: "COMP-3", type: "CNPS Security Rate", region: "UK", status: "Issue", lastUpdated: "Oct 20" },
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

export default function AIAuditPage() {
  const [activeTab, setActiveTab] = useState("logs");
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);
  
  // Data States
  const [flagged, setFlagged] = useState(MOCK_FLAGGED_ISSUES);
  
  // Modal / Drawer Target
  const [focusedLog, setFocusedLog] = useState<any>(null);

  // Filter States
  const [dateRange, setDateRange] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterRisk, setFilterRisk] = useState("");

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleResolveFlag = (id: string) => {
     setFlagged(prev => prev.map(f => f.id === id ? {...f, status: "Resolved"} : f));
     triggerToast("Issue marked as resolved and flagged for archive.");
  };

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />

      {/* Log Detail Modal */}
      {focusedLog && (
         <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="absolute inset-0 bg-[#0f172b]/40 backdrop-blur-sm" onClick={() => setFocusedLog(null)}></div>
            <div className="bg-white relative z-10 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[85vh]">
               <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
                  <div>
                     <h3 className="text-[18px] font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Audit Trace Block</h3>
                     <p className="text-[13px] font-medium text-gray-500 mt-1 pl-3">ID Sequence: <span className="font-mono">{focusedLog.id}-X9</span></p>
                  </div>
                  <button onClick={() => setFocusedLog(null)} className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"><X className="size-4" /></button>
               </div>
               <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">Time Route</span>
                        <span className="text-[13px] font-bold text-gray-900">{focusedLog.timestamp}</span>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">Actor</span>
                        <span className="text-[13px] font-bold text-gray-900">{focusedLog.user}</span>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">Module</span>
                        <span className="text-[13px] font-bold text-gray-900">{focusedLog.module}</span>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">Risk Weight</span>
                        <span className={`text-[13px] font-bold ${focusedLog.risk === "High" ? "text-red-600" : focusedLog.risk === "Medium" ? "text-amber-600" : "text-[#10b981]"}`}>{focusedLog.risk}</span>
                     </div>
                  </div>

                  <div>
                     <span className="block text-[13px] font-bold text-gray-800 mb-2">Base Description</span>
                     <p className="text-[14px] font-medium text-gray-600 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">{focusedLog.desc}</p>
                  </div>

                  <div>
                     <span className="block text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-2"><ArrowRightLeft className="size-4 text-blue-500" /> Vector Comparison (Before/After)</span>
                     <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden font-mono text-[13px]">
                        <div className="bg-red-50/50 p-4">
                           <span className="block text-[11px] font-bold text-red-500 mb-2 uppercase tracking-widest bg-red-100 w-max px-2 py-0.5 rounded">Prior State</span>
                           <span className="text-red-900 font-medium break-words">{focusedLog.before}</span>
                        </div>
                        <div className="bg-[#10b981]/5 p-4">
                           <span className="block text-[11px] font-bold text-[#10b981] mb-2 uppercase tracking-widest bg-[#10b981]/20 w-max px-2 py-0.5 rounded">New State</span>
                           <span className="text-emerald-900 font-medium break-words">{focusedLog.after}</span>
                        </div>
                     </div>
                  </div>

               </div>
               <div className="p-4 border-t border-gray-200 bg-gray-50 text-right shrink-0">
                  <button onClick={() => triggerToast("Audit Node isolated and downloaded.", "success")} className="px-5 py-2 bg-gray-900 text-white text-[13px] font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm inline-flex items-center gap-2">
                     <Download className="size-4" /> Save Local Trace
                  </button>
               </div>
            </div>
         </div>
      )}


      {/* Header Area */}
      <div className="flex items-end justify-between mb-8">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b]">AI Flags & Auditing</h1>
           <p className="text-[14px] text-[#64748b]">Track structural modifications, identify strict compliance limits, and trace anomalies.</p>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[13px] text-gray-500 font-bold">Total Audit Nodes</span>
               <FileKey className="size-4 text-blue-500" />
            </div>
            <p className="text-[28px] font-black text-gray-900 leading-none">1,248</p>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[13px] text-gray-500 font-bold">Recent Changes (7D)</span>
               <Clock className="size-4 text-amber-500" />
            </div>
            <p className="text-[28px] font-black text-gray-900 leading-none">14</p>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[13px] text-gray-500 font-bold">AI Flagged Anomalies</span>
               <AlertTriangle className="size-4 text-red-500" />
            </div>
            <p className="text-[28px] font-black text-gray-900 leading-none">{flagged.filter(f => f.status === "Open").length}</p>
         </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl mb-6 p-4 flex items-center flex-wrap gap-4">
         <div className="flex items-center gap-2">
            <Search className="size-4 text-gray-400" />
            <span className="text-[13px] font-bold text-gray-700">Filter Trace:</span>
         </div>
         
         <input type="month" value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-[140px] px-3 py-1.5 text-[12px] border border-gray-300 rounded focus:ring-2 focus:ring-gray-300 outline-none text-gray-700" />
         
         <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="w-[140px] px-3 py-1.5 text-[12px] border border-gray-300 rounded outline-none font-medium text-gray-600">
            <option value="">All Modules</option>
            <option value="Employees">Employees</option>
            <option value="Payroll">Payroll</option>
            <option value="Attendance">Attendance</option>
         </select>

         <select value={filterUser} onChange={e => setFilterUser(e.target.value)} className="w-[140px] px-3 py-1.5 text-[12px] border border-gray-300 rounded outline-none font-medium text-gray-600">
            <option value="">All Actors</option>
            <option value="HR">HR Admin</option>
            <option value="Finance">Finance Lead</option>
            <option value="System">System Bot</option>
         </select>
         
         <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="w-[140px] px-3 py-1.5 text-[12px] border border-gray-300 rounded outline-none font-medium text-gray-600">
            <option value="">Any Risk Level</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
         </select>
         
         <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => { setDateRange(""); setFilterModule(""); setFilterUser(""); setFilterRisk(""); }} className="px-3 py-1.5 border border-gray-300 rounded text-gray-500 font-bold text-[12px] hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
               <FilterX className="size-3.5" /> Clear
            </button>
         </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden min-h-[500px] flex flex-col">
         
         {/* Top Tabs */}
         <div className="flex border-b border-gray-200 bg-gray-50/50 px-6 pt-2 gap-8">
            <button onClick={() => setActiveTab("logs")} className={`pb-3 pt-2 text-[13px] font-bold tracking-wide border-b-2 transition-colors ${activeTab === "logs" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               System Audit Logs
            </button>
            <button onClick={() => setActiveTab("flags")} className={`pb-3 pt-2 text-[13px] font-bold tracking-wide border-b-2 transition-colors ${activeTab === "flags" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               AI Flagged Issues
            </button>
            <button onClick={() => setActiveTab("compliance")} className={`pb-3 pt-2 text-[13px] font-bold tracking-wide border-b-2 transition-colors ${activeTab === "compliance" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               Compliance Vectors
            </button>
         </div>

         {/* TAB 1: AUDIT LOGS */}
         {activeTab === "logs" && (
            <div className="flex-1 overflow-x-auto flex flex-col">
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>{["Timestamp", "Actor", "Context Module", "Operation Description", "Risk Threshold", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {MOCK_AUDIT_LOGS.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                           <td className="py-4 px-6 text-[12px] font-bold text-gray-600 whitespace-nowrap">{log.timestamp}</td>
                           <td className="py-4 px-6 text-[13px] font-bold text-gray-900 border-l border-gray-100">
                              <span className={`inline-flex items-center gap-1.5 ${log.user === "System" ? "text-blue-600" : "text-gray-900"}`}>
                                 {log.user === "System" && <Database className="size-3" />}
                                 {log.user}
                              </span>
                           </td>
                           <td className="py-4 px-6 text-[13px] font-medium text-gray-600">{log.module}</td>
                           <td className="py-4 px-6">
                              <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border mr-2 bg-gray-50 text-gray-600">{log.action}</span>
                              <span className="text-[13px] text-gray-800 font-medium">{log.desc}</span>
                           </td>
                           <td className="py-4 px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                 log.risk === "High" ? "bg-red-50 text-red-600 border border-red-100" : log.risk === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-[#10b981]/10 text-[#10b981]"
                              }`}>{log.risk}</span>
                           </td>
                           <td className="py-4 px-6 text-left">
                              <button onClick={() => setFocusedLog(log)} className="text-[12px] font-bold text-blue-600 hover:text-blue-800 hover:underline">View Trace</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {/* TAB 2: FLAGGED ISSUES */}
         {activeTab === "flags" && (
            <div className="flex-1 overflow-x-auto flex flex-col">
               <div className="px-6 py-3 border-b border-rose-100 flex items-center gap-3 bg-rose-50 text-rose-800 text-[12px] font-bold shrink-0">
                  <AlertTriangle className="size-4" /> AI passive anomaly detection limits activated. Investigation mandatory.
               </div>
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>{["Identified Breach Protocol", "System Chain", "Detailed Description", "Calculated Severity", "Status", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {flagged.map(flag => (
                        <tr key={flag.id} className="hover:bg-gray-50 transition-colors">
                           <td className="py-4 px-6 font-bold text-[13px] text-gray-900 border-l-[3px] border-transparent hover:border-red-400">{flag.type}</td>
                           <td className="py-4 px-6 font-medium text-[13px] text-gray-600 bg-gray-50/50">{flag.area}</td>
                           <td className="py-4 px-6 text-[13px] text-gray-800 max-w-sm">{flag.desc}</td>
                           <td className="py-4 px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${flag.severity === "High" ? "bg-red-100 text-red-700" : flag.severity === "Medium" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                                 {flag.severity}
                              </span>
                           </td>
                           <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 font-bold text-[12px] ${flag.status === "Open" ? "text-red-500" : "text-[#10b981]"}`}>
                                 {flag.status === "Open" ? <AlertCircle className="size-3.5" /> : <CheckCircle className="size-3.5" />} {flag.status}
                              </span>
                           </td>
                           <td className="py-4 px-6">
                              <button disabled={flag.status === "Resolved"} onClick={() => handleResolveFlag(flag.id)} className="text-[12px] font-bold border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors">
                                 Resolve Flag
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
         
         {/* TAB 3: COMPLIANCE */}
         {activeTab === "compliance" && (
            <div className="flex-1 overflow-x-auto flex flex-col">
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>{["Compliance Protocol Segment", "Operating Region", "Validation State", "Last Registry Pin", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {MOCK_COMPLIANCE.map(comp => (
                        <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                           <td className="py-4 px-6 font-bold text-[13px] text-gray-900 flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-600" /> {comp.type}</td>
                           <td className="py-4 px-6 font-medium text-[13px] text-gray-600"><span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[11px]"><MapPin className="size-3" /> {comp.region}</span></td>
                           <td className="py-4 px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                 comp.status === "Compliant" ? "bg-[#10b981]/10 text-[#10b981]" : comp.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-red-50 text-red-600 border border-red-200"
                              }`}>{comp.status}</span>
                           </td>
                           <td className="py-4 px-6 font-medium text-[12px] text-gray-500">{comp.lastUpdated}</td>
                           <td className="py-4 px-6 text-left flex gap-3">
                              <button onClick={() => triggerToast("Compiling registry output to secure storage.", "success")} className="text-[12px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded">View Frame</button>
                              <button onClick={() => triggerToast("Downloading base standard framework.", "success")} className="text-[12px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"><Download className="size-3" /> Extract File</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

    </div>
  );
}
