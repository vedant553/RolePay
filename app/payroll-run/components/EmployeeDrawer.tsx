"use client";

import { X, Save, AlertTriangle, Shield, CheckCircle, Calculator, Ban, Activity, HelpCircle, AlertCircle, FileText, LockIcon, Search } from "lucide-react";
import { usePayroll } from "@/lib/context/PayrollContext";
import { useState, useEffect } from "react";

function TaxBreakdownSim({ currency, gross }: { currency: string, gross: number }) {
  if (gross === 0) return <div className="text-[12px] text-slate-500 font-medium">Exempt</div>;

  if (currency === "USD") {
     const fed = gross * 0.15; const state = gross * 0.05; const fica = gross * 0.02;
     return (
        <div className="pl-4 mt-2 space-y-1.5 border-l-2 border-slate-200">
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> Federal Tax (15%)</span><span>{fed.toLocaleString('en-US',{style:'currency',currency})}</span></div>
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> State Output (Sim) (5%)</span><span>{state.toLocaleString('en-US',{style:'currency',currency})}</span></div>
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> FICA/Medicare (2%)</span><span>{fica.toLocaleString('en-US',{style:'currency',currency})}</span></div>
        </div>
     );
  }
  if (currency === "EUR") {
     const vat = gross * 0.10; const local = gross * 0.15;
     return (
        <div className="pl-4 mt-2 space-y-1.5 border-l-2 border-slate-200">
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> EU VAT Layering (10%)</span><span>{vat.toLocaleString('en-US',{style:'currency',currency})}</span></div>
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> Regional Stat (15%)</span><span>{local.toLocaleString('en-US',{style:'currency',currency})}</span></div>
        </div>
     );
  }
  if (currency === "INR") {
     const tds = gross * 0.10; const cess = gross * 0.02; const surcharge = gross * 0.03;
     return (
        <div className="pl-4 mt-2 space-y-1.5 border-l-2 border-slate-200">
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> Section 192 TDS (10%)</span><span>{tds.toLocaleString('en-US',{style:'currency',currency})}</span></div>
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> HE Cess Array (2%)</span><span>{cess.toLocaleString('en-US',{style:'currency',currency})}</span></div>
           <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> Surcharge Index (3%)</span><span>{surcharge.toLocaleString('en-US',{style:'currency',currency})}</span></div>
        </div>
     );
  }
  return (
     <div className="pl-4 mt-2 space-y-1.5 border-l-2 border-slate-200">
        <div className="flex justify-between text-[11px] text-slate-600"><span className="flex items-center gap-1"><span className="bg-slate-200 size-1 rounded-full"/> Flat Unified Tax (20%)</span><span>{(gross*0.2).toLocaleString('en-US',{style:'currency',currency})}</span></div>
     </div>
  );
}

export default function EmployeeDrawer() {
  const { activeEmployeeId, setActiveEmployeeId, employees, updateEmployee, status, simulateOverrideImpact } = usePayroll();
  const [baseOverride, setBaseOverride] = useState<string>("");
  const [activeTraceTarget, setActiveTraceTarget] = useState<string | null>(null);

  const emp = employees.find(e => e.id === activeEmployeeId);

  useEffect(() => {
    if (emp) {
      setBaseOverride(emp.baseSalary.toString());
      setActiveTraceTarget(null);
    }
  }, [emp, activeEmployeeId]);

  if (!activeEmployeeId || !emp) return null;

  const handleSaveOverride = () => {
    const val = parseFloat(baseOverride);
    if (!isNaN(val)) {
      updateEmployee(emp.id, { baseOverride: val });
    }
  };

  const isLocked = status === "locked" || status === "disbursement" || status === "reconciliation";
  const showOverrideImpact = !isLocked && !isNaN(parseFloat(baseOverride)) && parseFloat(baseOverride) !== emp.baseSalary;

  // Compliance Logic
  let complianceFlags: string[] = [];
  if(emp.currency === "EUR" && emp.entity === "SAASA GmbH" && emp.riskFactors.includes("Tax bracket missing in EU ledger")) complianceFlags.push("EU Directive 2006/112/EC Warning: VAT indexing logic missing mapping parameter locally.");
  if((emp.benefitsDeduction / (emp.baseSalary||1)) > 0.15) complianceFlags.push("Regulatory Limit Warning: Total deduction exceeds standard 15% regional net tolerance.");
  if(emp.baseOverride !== undefined) complianceFlags.push("Audit Attention: Financial origin sequence overridden dynamically. Audit signature required immediately.");

  return (
    <>
      <div 
         className="fixed inset-0 bg-[#0f172b]/60 z-[99] backdrop-blur-sm"
         onClick={() => setActiveEmployeeId(null)}
      />
      <div className={`fixed top-0 right-0 h-full w-[650px] bg-white z-[100] shadow-2xl transition-transform transform ${activeEmployeeId ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <h2 className="text-[20px] font-bold text-[#0f172b]">{emp.name}</h2>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    emp.riskLabel === "High" ? "bg-red-100 text-red-700" :
                    emp.riskLabel === "Medium" ? "bg-amber-100 text-amber-700" :
                    "bg-[#d1fae5] text-[#065f46]"
                 }`}>
                   {emp.riskLabel} Risk Logic
                 </span>
                 {isLocked && <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><LockIcon className="size-3"/> LEDGER LOCKED</span>}
              </div>
              <p className="text-[13px] text-[#64748b]">HASH_ID: {emp.id} • {emp.role} • {emp.entity}</p>
           </div>
           <button onClick={() => setActiveEmployeeId(null)} className="p-2 hover:bg-[#e2e8f0] rounded-full transition-colors group">
              <X className="size-5 text-[#64748b] group-hover:text-[#0f172b]" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">

           {/* Audit Trace Overlay Sandbox */}
           {activeTraceTarget && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur z-50 p-6 animate-in fade-in zoom-in-95 duration-200">
                 <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <div>
                       <h3 className="font-bold text-[#0f172b] text-[18px]">Cryptographic Object Trace</h3>
                       <p className="text-[13px] text-[#64748b]">Inspecting mapping parameter ruleset logic sequentially.</p>
                    </div>
                    <button onClick={()=>setActiveTraceTarget(null)} className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X className="size-4 text-slate-600"/></button>
                 </div>
                 
                 <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 shadow-sm space-y-5">
                    {activeTraceTarget === "base" && (
                       <>
                          <div className="flex justify-between items-center bg-white p-3 border rounded-lg">
                             <span className="text-[12px] font-bold text-slate-500 uppercase">Original DB Hook Origin</span>
                             <span className="font-mono text-[14px] text-slate-500 line-through">${emp.baseOverride ? 12000 : emp.baseSalary}</span>
                          </div>
                          {emp.baseOverride && (
                            <div className="flex justify-items-center gap-4 animate-in fade-in">
                               <div className="w-1 bg-[#3b82f6] rounded-full my-1 ml-5"></div>
                               <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex-1">
                                  <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase block mb-1">Administrative Node Mutator Detected</span>
                                  <span className="text-[13px] text-blue-900 leading-tight">HR_Leader scaled property dynamically utilizing Strategic Sandbox simulation engine structurally overriding global payload.</span>
                               </div>
                            </div>
                          )}
                          <div className="flex justify-between items-center bg-[#0f172b] text-white p-4 border rounded-lg shadow-sm">
                             <span className="text-[13px] font-bold uppercase tracking-wider">Active Final Param Validated</span>
                             <span className="font-mono font-bold text-[18px] text-emerald-400">${emp.baseSalary}</span>
                          </div>
                       </>
                    )}
                 </div>
              </div>
           )}

           {/* Compliance Warning Array */}
           {complianceFlags.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 shadow-sm">
                 <h3 className="text-[13px] font-bold text-amber-900 mb-2 uppercase tracking-wider flex items-center gap-2"><AlertCircle className="size-4" /> SEC Compliance Flags Raised</h3>
                 <ul className="space-y-1.5">
                    {complianceFlags.map((flag, i) => (
                       <li key={i} className="text-[12px] text-amber-800 flex gap-2"><span className="text-amber-500 shrink-0">•</span> {flag}</li>
                    ))}
                 </ul>
              </div>
           )}

           {/* Financial Traceability Engine */}
           <div>
              <h3 className="text-[14px] font-bold text-[#0f172b] mb-4 flex items-center gap-2"><FileText className="size-4 text-[#3b82f6]"/> Fully Auditable Payslip Trace Sequence</h3>
              <div className="border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm selection-transparent">
                 
                 <div className="bg-[#f8fafc] px-4 py-3 flex justify-between border-b border-[#e2e8f0] group hover:bg-[#e2e8f0]/40 transition-colors cursor-pointer" onClick={()=>setActiveTraceTarget("base")}>
                    <span className="text-[13px] font-bold text-[#64748b] flex items-center gap-2">Registered Base Matrix <Search className="size-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" /></span>
                    <div className="flex items-center gap-2">
                       {emp.baseOverride && <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 rounded uppercase">Mutated</span>}
                       <span className="text-[14px] font-bold text-[#0f172b]">{emp.baseSalary.toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                    </div>
                 </div>

                 <div className="bg-white px-4 py-3 flex justify-between border-b border-[#e2e8f0]">
                    <span className="text-[13px] font-bold text-[#64748b]">Structural Allowances</span>
                    <span className="text-[13px] font-bold text-[#10b981]">+{emp.allowances.toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                 </div>
                 
                 <div className="bg-white px-4 py-3 flex justify-between border-b border-[#e2e8f0]">
                    <div>
                       <span className="text-[13px] font-bold text-[#64748b] block">Computed Logic Overtime</span>
                       <span className="text-[10px] text-slate-400 font-medium">({emp.overtimeHours} hrs mapped * {((emp.baseSalary/160)*1.5).toLocaleString('en-US', {style:'currency', currency: emp.currency})} rate natively)</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#10b981]">+{(((emp.baseSalary/160)*1.5)*emp.overtimeHours).toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                 </div>

                 <div className="bg-[#f1f5f9] px-4 py-2 flex justify-between border-b border-[#e2e8f0] border-t border-[#cbd5e1]">
                    <span className="text-[11px] font-bold text-[#0f172b] uppercase tracking-wider">Gross Pre-Tax Origin Object</span>
                    <span className="text-[14px] font-bold font-mono text-[#0f172b]">{emp.gross.toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                 </div>
                 
                 <div className="bg-white px-4 py-4 flex flex-col border-b border-[#e2e8f0]">
                    <div className="flex justify-between items-center text-red-600">
                       <span className="text-[13px] font-bold text-[#64748b]">Simulated Tax Ledger Logic</span>
                       <span className="text-[13px] font-bold">-{emp.tax.toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                    </div>
                    <TaxBreakdownSim currency={emp.currency} gross={emp.gross} />
                 </div>

                 <div className="bg-white px-4 py-3 flex justify-between border-b border-[#e2e8f0] text-red-600">
                    <span className="text-[13px] font-bold text-[#64748b]">Private Benefits Extraction</span>
                    <span className="text-[13px] font-bold">-{emp.benefitsDeduction.toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                 </div>
                 
                 <div className="bg-[#0f172b] px-4 py-4 flex flex-col justify-between text-white relative overflow-hidden">
                    {isLocked && <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-30"><LockIcon className="size-20" /></div>}
                    <div className="flex justify-between items-center relative z-10 w-full">
                       <span className="text-[14px] font-bold uppercase tracking-wider text-emerald-400">Final Disbursement Net Packet</span>
                       <span className="text-[20px] font-mono font-bold text-white">{emp.net.toLocaleString('en-US', {style:'currency', currency: emp.currency})}</span>
                    </div>
                    {isLocked && <span className="text-[10px] text-slate-400 mt-2 font-mono uppercase z-10">Signature Locked & Encrypted: {new Date().getTime().toString(16)}</span>}
                 </div>
              </div>
           </div>

           {/* Logic Control Layer - Hidden if Locked */}
           {!isLocked && (
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                 <h3 className="text-[14px] font-bold text-[#0f172b] mb-4 flex items-center gap-2"><Shield className="size-4 text-[#10b981]"/> Secure Override Command Vector</h3>
                 <div className="space-y-4">
                    <div>
                       <label className="text-[12px] font-bold text-[#64748b] block mb-1">Scale Local Base ({emp.currency})</label>
                       <div className="flex gap-2">
                          <input type="number" value={baseOverride} onChange={(e)=>setBaseOverride(e.target.value)} 
                            className="flex-1 border border-[#e2e8f0] rounded-lg px-3 py-2 text-[14px] font-mono focus:outline-none focus:border-[#3b82f6] shadow-inner" 
                          />
                          <button onClick={handleSaveOverride} disabled={!showOverrideWarning} className="bg-[#0f172b] disabled:opacity-50 text-white px-4 py-2 font-bold text-[13px] rounded-lg shadow-sm transition-colors">
                             Map
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </>
  );
}
