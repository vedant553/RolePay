"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw, AlertCircle, FileText, FileSpreadsheet, Code, CheckCircle, Search, FilterX } from "lucide-react";

// --- MOCK DATA ---
const INITIAL_REPORTS = [
  { id: "REP-1", name: "Salary Summary", type: "Payroll", period: "April 2026", status: "Ready", lastGenerated: "Today, 09:15 AM" },
  { id: "REP-2", name: "Tax Reports", type: "Tax", period: "April 2026", status: "Ready", lastGenerated: "Yesterday, 04:30 PM" },
  { id: "REP-3", name: "Compliance Reports", type: "Compliance", period: "April 2026", status: "Generating", lastGenerated: "—" },
  { id: "REP-4", name: "Attendance Impact", type: "Attendance", period: "April 2026", status: "Ready", lastGenerated: "Oct 28, 2026, 11:00 AM" },
  { id: "REP-5", name: "Performance Bonus Report", type: "Performance", period: "April 2026", status: "Failed", lastGenerated: "Failed on Process" },
];

function Toast({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-xl font-medium text-white transition-all transform ${
      toast.type === "success" ? "bg-[#10b981]" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
    }`}>
      {toast.message}
    </div>
  );
}

// Custom Action Component
function DownloadDropdown({ report, onDownload, onRetry }: { report: any, onDownload: (type: string, f: string) => void, onRetry: (type: string) => void }) {
  const [open, setOpen] = useState(false);

  if (report.status === "Generating") {
     return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-bold text-blue-600 bg-blue-50 rounded-md">
           <RefreshCw className="size-3.5 animate-spin" /> Processing
        </span>
     );
  }

  if (report.status === "Failed") {
     return (
        <button onClick={() => onRetry(report.type)} className="inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md transition-colors">
           <RefreshCw className="size-3.5" /> Retry Flow
        </button>
     );
  }

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none transition-colors">
        <Download className="size-4" /> Download
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-gray-100">
             <div className="py-1">
                <button onClick={() => { setOpen(false); onDownload(report.type, "CSV"); }} className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50"><FileSpreadsheet className="size-3.5 mr-2 text-gray-400" /> CSV</button>
             </div>
             <div className="py-1">
                <button onClick={() => { setOpen(false); onDownload(report.type, "PDF"); }} className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50"><FileText className="size-3.5 mr-2 text-gray-400" /> PDF</button>
             </div>
             <div className="py-1">
                <button onClick={() => { setOpen(false); onDownload(report.type, "XML"); }} className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50"><Code className="size-3.5 mr-2 text-gray-400" /> XML</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  // Filters State
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState("");
  const [department, setDepartment] = useState("");

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Simulate resolution of "Generating"
  useEffect(() => {
     const timer = setTimeout(() => {
        setReports(prev => prev.map(r => r.status === "Generating" ? { ...r, status: "Ready", lastGenerated: "Just now" } : r));
     }, 4000);
     return () => clearTimeout(timer);
  }, []);

  const handleApplyFilters = () => {
     triggerToast("Filters bound to data query. Target logs modified.");
     // We don't actually filter the mock data down because they are standard templates, 
     // but in a real app this would refresh the report statuses or generated files.
  };

  const handleResetFilters = () => {
     setCountry("");
     setMonth("");
     setDepartment("");
  };

  const handleGenerateCustom = () => {
     triggerToast("Compilation pushed to queue. Documents will generate shortly.", "success");
     const newReport = { id: `REP-${Date.now()}`, name: "Custom Execution Log", type: "Custom", period: month || "All Time", status: "Generating", lastGenerated: "—" };
     setReports([newReport, ...reports]);
     
     // Simulate it resolving
     setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: "Ready", lastGenerated: "Just now" } : r));
        triggerToast("Custom Execution Log is ready for download.");
     }, 3000);
  };

  const handleDownload = (type: string, format: string) => {
     triggerToast(`Pulling secure stream of ${type} in ${format} encoding.`, "success");
  };

  const handleRetry = (type: string) => {
     triggerToast(`Triggering rebuild logic for ${type}.`, "warning");
     setReports(prev => prev.map(r => r.type === type ? { ...r, status: "Generating", lastGenerated: "—" } : r));
     
     // Simulate resolve
     setTimeout(() => {
        setReports(prev => prev.map(r => r.type === type ? { ...r, status: "Ready", lastGenerated: "Just now" } : r));
     }, 3000);
  };

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />

      {/* Header Area */}
      <div className="flex items-end justify-between mb-8">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b]">Reports & Extractions</h1>
           <p className="text-[14px] text-[#64748b]">Filter, assemble, and safely extract compliant documents for audit review.</p>
         </div>
         <button onClick={handleGenerateCustom} className="bg-[#10b981] text-white h-[38px] px-5 rounded-lg flex items-center gap-2 font-bold text-[13px] hover:bg-[#0ea370] transition-colors shadow-sm">
            <RefreshCw className="size-4" strokeWidth={2.5} /> Generate New Report
         </button>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl mb-6 p-4 flex items-center flex-wrap gap-4">
         <div className="flex items-center gap-2">
            <Search className="size-4 text-gray-400" />
            <span className="text-[13px] font-bold text-gray-700">Filter Base:</span>
         </div>
         
         <select value={country} onChange={e => setCountry(e.target.value)} className="w-[160px] px-3 py-2 text-[13px] border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none">
            <option value="">All Regions</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="UK">UK</option>
         </select>
         
         <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="w-[160px] px-3 py-2 text-[13px] border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none text-gray-700" />
         
         <select value={department} onChange={e => setDepartment(e.target.value)} className="w-[160px] px-3 py-2 text-[13px] border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none">
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
         </select>
         
         <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleResetFilters} className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-bold text-[13px] hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
               <FilterX className="size-3.5" /> Reset
            </button>
            <button onClick={handleApplyFilters} className="px-5 py-2 bg-[#0f172b] text-white rounded font-bold text-[13px] hover:bg-[#1a2642] transition-colors shadow-sm">
               Lock Constraints
            </button>
         </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden min-h-[400px]">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-[#f8fafc] border-b border-gray-200">
                  <tr>
                     {["Structured Asset Name", "Domain Segment", "Time Sequence", "Evaluation State", "Last Crystallized", "Asset Route"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-[13px]">
                  {reports.map((report) => (
                     <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                              <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><FileText className="size-4 text-gray-600" /></div>
                              <span className="font-bold text-gray-900 leading-tight">{report.name}</span>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{report.type}</td>
                        <td className="py-4 px-6 font-medium text-gray-800">{report.period}</td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-1.5">
                              {report.status === "Ready" && <CheckCircle className="size-4 text-[#10b981]" />}
                              {report.status === "Generating" && <RefreshCw className="size-4 text-blue-500 animate-spin" />}
                              {report.status === "Failed" && <AlertCircle className="size-4 text-red-500" />}
                              <span className={`font-bold ${report.status === "Ready" ? "text-gray-900" : report.status === "Generating" ? "text-blue-600" : "text-red-600"}`}>
                                 {report.status}
                              </span>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{report.lastGenerated}</td>
                        <td className="py-4 px-6 text-left">
                           <DownloadDropdown report={report} onDownload={handleDownload} onRetry={handleRetry} />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
