"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { DollarSign, Users, Shield, AlertTriangle, Play, ChevronRight, Loader2, Search, Filter, Cpu, Lightbulb, GitBranch, Target, CheckSquare, ShieldCheck, PieChart, Activity, LockIcon, TrendingUp } from "lucide-react";
import StepTracker from "@/components/ui/StepTracker";
import Link from "next/link";
import { usePayroll } from "@/lib/context/PayrollContext";

export default function PayrollRunPage() {
  const { 
    status, currentStep, isProcessing, metrics, employees, setActiveEmployeeId, auditLogs,
    activeScenarioId, setActiveScenarioId, scenarios, createScenario, computeScenarioMetrics, globalBudget,
    targetRole, setTargetRole, checkGovernanceRules, runPayrollSimulation
  } = usePayroll();

  // Reset tab to overview when role changes to ensure views align
  const [activeTab, setActiveTab] = useState<"overview" | "scenarios" | "insights" | "comparison" | "employees" | "audit">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [newScenarioName, setNewScenarioName] = useState("");
  
  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dynamicSteps = [
    { label: "Data Collection", time: "Mar 01", status: "done" as const },
    { label: "Calculation Validation", time: "Mar 08", status: currentStep >= 1 ? "done" as const : (status === "processing" ? "active" as const : "pending" as const) },
    { label: "Compliance Gateway", time: "Mar 15", status: currentStep >= 2 ? "done" as const : (status === "processing" ? "pending" as const : "pending" as const) },
    { label: "Disbursement Execution", time: "Mar 28", status: status === "approval" ? "active" as const : (status === "disbursement" || status === "reconciliation" || status === "locked" ? "done" as const : "pending" as const) },
  ];

  const financialBreakdownData = [
    { label: "Gross Payroll Arrays", value: `$${metrics.totalGross.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, color: "#10b981" },
    { label: "Tax Liability Deductions", value: `$${metrics.totalTax.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, color: "#3b82f6" },
    { label: "Internal Benefits Vectors", value: `$${metrics.totalBenefits.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, color: "#8b5cf6" },
  ];

  const baselineMetrics = computeScenarioMetrics("baseline");
  const varianceFromBaseline = metrics.totalGross - baselineMetrics.totalGross;

  const flaggedCount = employees.filter(e=>e.isFlagged).length;
  const highRiskCount = employees.filter(e=>e.riskLabel === "High").length;
  const excludedCount = employees.filter(e=>e.isExcluded).length;

  const handleCreateScenario = (type: "clone" | "optimize_overtime" | "mass_increment") => {
     if(!newScenarioName) return;
     createScenario(newScenarioName, type);
     setNewScenarioName("");
  };

  const governance = checkGovernanceRules();

  // Find best scenario recommendation
  const bestScenario = scenarios.reduce((best, s) => {
      const sm = computeScenarioMetrics(s.id);
      if(sm.totalGross <= globalBudget && sm.confidenceScore >= best.score) return { id: s.id, score: sm.confidenceScore };
      return best;
  }, { id: "baseline", score: 0 });

  return (
    <div className="pb-20">
      {/* Role Toggle & Header */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] -mx-[40px] px-[40px] py-3 mb-8 flex justify-between items-center shadow-sm">
         <span className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider">Simulated View Mode:</span>
         <div className="flex gap-2">
            {(["hr", "finance", "executive"] as const).map(role => (
               <button 
                  key={role} 
                  onClick={() => { setTargetRole(role); setActiveTab("overview"); }}
                  className={`px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase transition-all border ${targetRole === role ? 'bg-[#0f172b] text-white border-[#0f172b]' : 'bg-white text-[#64748b] hover:bg-[#e2e8f0] border-[#e2e8f0]'}`}
               >
                  {role} Platform
               </button>
            ))}
         </div>
      </div>

      {/* Executive Command Alerts */}
      {targetRole === "executive" && (
         <div className="space-y-3 mb-8">
            {!governance.passed && governance.failures.map((f, i) => (
                <div key={i} className="bg-red-900 border border-red-700 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <AlertTriangle className="size-6 text-red-500 shrink-0" />
                      <div>
                         <p className="text-[14px] font-bold tracking-tight uppercase text-red-400">Governance Gateway Blocked</p>
                         <p className="text-[15px] font-medium leading-snug">{f}</p>
                      </div>
                   </div>
                   <ShieldCheck className="size-8 text-red-800 opacity-50" />
                </div>
            ))}
            <div className="bg-[#1e293b] border border-[#334155] text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between group cursor-pointer hover:bg-[#0f172b] transition-colors">
               <div className="flex items-start gap-4">
                  <PieChart className="size-6 text-[#3b82f6] shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[12px] font-bold tracking-widest uppercase text-blue-400 mb-1">Chief Executive Story Synthesis</p>
                     <p className="text-[15px] font-medium leading-relaxed max-w-4xl text-slate-300">
                        "The active computational cycle increased gross throughput by <span className="text-white font-bold tracking-tight px-1 bg-slate-800 rounded">{varianceFromBaseline > 0 ? "+" : ""}{(varianceFromBaseline/baselineMetrics.totalGross*100).toFixed(1)}%</span> against the baseline due to targeted interventions. Current risk velocity remains <span className="text-white font-bold px-1 bg-slate-800 rounded">Stably Low</span> mapping <span className="text-white font-bold">{metrics.confidenceScore}% Model Confidence</span>. It is recommended to lock arrays before standard logic deviations accrue further."
                     </p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Standard Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[26px] font-bold text-[#0f172b] tracking-tight">{targetRole === "executive" ? "Executive Governance & Decision Hub" : targetRole === "finance" ? "Financial Strategic Simulator" : "Operational Payroll Control"}</h1>
            <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
              status === "draft" ? "bg-slate-400" : status === "locked" ? "bg-[#10b981]" : "bg-[#0f172b]"
            }`}>
               {status === "draft" ? "DRAFT MODE" : status === "processing" ? "COMPUTING" : status === "locked" ? "SECURED" : "LIVE MATH"}
            </span>
          </div>
          <p className="text-[#62748e] text-[15px]">
             {status === "draft" ? "Financial vectors successfully synchronized. Select processing path." : 
              status === "locked" ? "Current computation ledger structurally locked. No further intervention allowed." : 
              "Active operational matrix engaged globally."}
          </p>
        </div>
        
        {/* Contextual Tabs Based on Role */}
        <div className="flex bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-1 shadow-sm overflow-hidden">
          {(
             targetRole === "executive" ? ["overview", "audit"] : 
             targetRole === "finance" ? ["overview", "scenarios", "comparison", "insights", "audit"] : 
             ["overview", "employees", "audit"]
          ).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all uppercase tracking-wider whitespace-nowrap ${activeTab === tab ? "bg-white text-[#0f172b] shadow border border-[#e2e8f0]" : "text-[#64748b] hover:text-[#0f172b]"}`}>
              {tab === "overview" ? "Executive Board" : tab === "scenarios" ? "Simulations" : tab === "insights" ? "Intelligence" : tab === "comparison" ? "Delta Maps" : tab === "employees" ? "Node Roster" : "Immutable Audit"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Executive & Finance View specific High-Level Cards */}
          {(targetRole === "executive" || targetRole === "finance") && (
             <div className="grid grid-cols-3 gap-6 mb-8">
               <div className="bg-gradient-to-br from-[#0f172b] to-[#1e293b] p-8 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
                  <DollarSign className="absolute -right-5 -bottom-5 size-32 text-white/5" />
                  <p className="text-[13px] uppercase text-emerald-400 font-bold tracking-widest mb-2 relative z-10">Total Payroll Execution</p>
                  <p className="text-[44px] font-bold text-white font-mono tracking-tight relative z-10">${metrics.totalGross.toLocaleString("en-US", {maximumFractionDigits:0})}</p>
                  <p className="text-[13px] text-slate-400 font-medium mt-1 relative z-10">{((metrics.totalGross/globalBudget)*100).toFixed(1)}% of Global Allocated Sandbox</p>
               </div>
               
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e2e8f0] flex flex-col justify-center">
                  <p className="text-[12px] uppercase text-[#64748b] font-bold tracking-widest mb-1.5 flex items-center gap-2"><Target className="size-4"/> Budget Alignment</p>
                  <p className="text-[32px] font-bold text-[#0f172b] font-mono tracking-tight">${(globalBudget - metrics.totalGross).toLocaleString("en-US", {maximumFractionDigits:0})}</p>
                  <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${metrics.totalGross>globalBudget?'bg-red-500':'bg-[#10b981]'}`} style={{width: `${Math.min((metrics.totalGross/globalBudget)*100, 100)}%`}} />
                  </div>
                  <p className={`text-[12px] font-bold mt-2 ${metrics.totalGross>globalBudget?'text-red-500':'text-[#10b981]'}`}>{metrics.totalGross>globalBudget?"BUDGET EXCEEDED":"Budget Safely Intact"}</p>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e2e8f0] flex flex-col justify-center">
                  <p className="text-[12px] uppercase text-[#64748b] font-bold tracking-widest mb-1.5 flex items-center gap-2"><Activity className="size-4"/> Mathematical Confidence Score</p>
                  <div className="flex items-center gap-4">
                     <p className="text-[48px] font-bold text-[#0f172b] font-mono tracking-tight leading-none">{metrics.confidenceScore}%</p>
                     <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${metrics.confidenceScore>80?'bg-emerald-50 text-emerald-700 border-emerald-200':metrics.confidenceScore>50?'bg-amber-50 text-amber-700 border-amber-200':'bg-red-50 text-red-700 border-red-200'}`}>
                        {metrics.confidenceScore>80?'Secure':'Moderate Risk'}
                     </span>
                  </div>
                  <p className="text-[13px] text-[#64748b] font-medium mt-2">Driven by {highRiskCount} explicitly dangerous matrix nodes globally.</p>
               </div>
             </div>
          )}

          {/* Operational View specific Cards (HR) */}
          {targetRole === "hr" && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { title: "Processed Headcount", value: metrics.totalEmployees.toLocaleString("en-US"), sub: "Global Active Target Bounds", icon: Users, color: "bg-[#10b981]" },
                { title: "Net Thread Transfer", value: `$${metrics.totalNet.toLocaleString("en-US", {maximumFractionDigits:0})}`, sub: "Actual Bank Return Vectors", icon: TrendingUp, color: "bg-[#3b82f6]" },
                { title: "Flagged Target Matrix", value: flaggedCount.toString(), sub: "Missing Human Review Hooks", icon: AlertTriangle, color: "bg-[#f59e0b]" },
                { title: "Manual Exclusions", value: excludedCount.toString(), sub: "Nodes Pushed from Run", icon: Shield, color: "bg-[#ef4444]" },
              ].map((card, i) => (
                <div key={i} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                  <div className={`${card.color} rounded-xl size-9 flex items-center justify-center mb-4`}>
                    <card.icon className="size-4 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">{card.title}</p>
                  <p className="text-[26px] font-bold text-[#0f172b] tracking-tight mb-1">{card.value}</p>
                  <p className="text-[11px] text-[#90a1b9] font-medium">{card.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Core Pipeline Navigation */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-[#0f172b] text-[18px] mb-6 flex items-center justify-between border-b pb-4">
                 Structural Node Architecture
                 <Link href="/payroll-run/reporting"><button className="text-[12px] text-[#3b82f6] font-bold uppercase tracking-wider">Inspect Spread</button></Link>
              </h3>
              <div className="space-y-6">
                {financialBreakdownData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[14px] text-[#475569] font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-[#0f172b] text-[16px] font-mono tracking-tight">{status === "draft" ? "$0.00" : item.value}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-dashed border-[#e2e8f0]">
                   <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#0f172b]">Active Logical Network Status</span>
                      <span className="text-[13px] font-bold bg-[#f1f5f9] text-[#64748b] px-3 py-1 rounded-lg uppercase">{status}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-[#0f172b] text-[18px] mb-6 border-b pb-4">Executive Pipeline Execution</h3>
              <div className="space-y-4">
                {status === "draft" ? (
                   <div onClick={runPayrollSimulation} className="flex items-center gap-5 p-6 bg-gradient-to-r from-[#ecfdf5] to-[#f8fafc] rounded-xl border border-[#10b981]/40 hover:border-[#10b981] shadow-sm transition-all cursor-pointer group">
                     <div className={`bg-[#10b981] rounded-xl size-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                       <Play className="size-6 text-white fill-white ml-1" />
                     </div>
                     <div className="flex-1">
                       <p className="font-bold text-[#0f172b] text-[16px]">Trigger Global Array Start Protocol</p>
                       <p className="text-[#64748b] text-[13px] mt-0.5">Locks baseline & initiates predictive validation checks.</p>
                     </div>
                     <ChevronRight className="size-6 text-[#10b981]" strokeWidth={2.5} />
                   </div>
                ) : (
                  [
                    { label: "Decentralized Approvals Array", desc: status === "approval" ? "Action Blocked Target" : "Cleared", href: "/payroll-run/approval", color: "bg-[#3b82f6]", icon: Shield },
                    { label: "Matrix Disbursement Push", desc: "Execute banking operations", href: "/payroll-run/disbursement", color: "bg-[#8b5cf6]", icon: DollarSign },
                    { label: "Reconciliation Ledger Match", desc: "Bank float resolution system", href: "/payroll-run/reconciliation", color: "bg-[#f59e0b]", icon: AlertTriangle },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}>
                      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc] transition-all cursor-pointer group">
                        <div className={`${action.color} rounded-lg size-10 flex items-center justify-center shrink-0 text-white shadow-sm transition-transform`}>
                          <action.icon className="size-5" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0f172b] text-[14px] leading-tight mb-0.5">{action.label}</p>
                          <p className="text-[#64748b] text-[12px]">{action.desc}</p>
                        </div>
                        <ChevronRight className="size-4 text-[#94a3b8] group-hover:text-[#0f172b] transition-colors" strokeWidth={2} />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Decision Snapshot Sheet (One-Click Summary) */}
          {targetRole === "executive" && status !== "locked" && (
             <div className="bg-[#0f172b] p-8 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700 mt-8 mb-6">
                <div>
                   <p className="text-[16px] font-bold text-white mb-2 tracking-tight">Final Authorization Lock Protocol</p>
                   <p className="text-slate-400 text-[13px] max-w-xl leading-relaxed">
                      This action will cryptographically seal the current ledger state array permanently. Acknowledging forces execution of ${metrics.totalNet.toLocaleString("en-US")} net transfers and closes the simulation cycle actively globally.
                   </p>
                </div>
                {!governance.passed ? (
                   <button disabled className="bg-red-500/20 text-red-400 border border-red-500/50 cursor-not-allowed font-bold text-[14px] px-8 py-3.5 rounded-xl flex items-center gap-3">
                      <LockIcon className="size-5" /> Governance Checks Failed
                   </button>
                ) : (
                   <Link href="/payroll-run/reporting"><button className="bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600 font-bold text-[14px] px-8 py-3.5 rounded-xl transition-[transform,colors] active:scale-95 flex items-center gap-3">
                      <LockIcon className="size-5" /> Secure Final LEDGER Output
                   </button></Link>
                )}
             </div>
          )}

        </div>
      )}

      {/* Scenarios / Simulator for Finance */}
      {activeTab === "scenarios" && targetRole === "finance" && (
         <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 gap-4">
                 <div>
                    <h2 className="text-[22px] font-bold text-[#0f172b] tracking-tight">Financial Scenario Modeling Architecture</h2>
                    <p className="text-[#64748b] text-[14px] mt-1">Simulate parallel economic conditions seamlessly without mutating operational core.</p>
                 </div>
                 <div className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-3 shadow-sm">
                     <p className="text-[12px] uppercase tracking-wider text-[#64748b] font-bold mb-1"><Lightbulb className="size-3.5 inline mr-1 text-amber-500"/> System Strategy Recommendation</p>
                     <p className="text-[13px] font-bold text-[#0f172b]">
                         {bestScenario.id === activeScenarioId ? "Optimal Strategy Selected (Highest Confidence Node)" : `Switch to sequence "${scenarios.find(s=>s.id===bestScenario.id)?.name}" for optimized output.`}
                     </p>
                 </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Scenario List */}
                 <div className="col-span-1 space-y-4">
                     <p className="font-bold text-[13px] text-[#64748b] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">Active Mathematical Branches</p>
                     <div className="space-y-4">
                         {scenarios.map(scen => {
                             const isActive = scen.id === activeScenarioId;
                             const sm = computeScenarioMetrics(scen.id);
                             const percentageOfBudget = (sm.totalGross / globalBudget) * 100;

                             return (
                                 <div 
                                     key={scen.id} 
                                     onClick={() => setActiveScenarioId(scen.id)}
                                     className={`p-5 rounded-xl border transition-all cursor-pointer ${isActive ? 'bg-[#f8fafc] border-[#3b82f6] shadow-md' : 'bg-white border-[#e2e8f0] hover:border-[#94a3b8]'}`}
                                 >
                                     <div className="flex items-center justify-between mb-3">
                                         <p className="font-bold text-[15px] text-[#0f172b] flex items-center gap-2">
                                             <GitBranch className={`size-4 ${isActive?'text-[#3b82f6]':'text-[#94a3b8]'}`}/> {scen.name}
                                         </p>
                                         {isActive && <span className="text-[#3b82f6] text-[10px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>}
                                     </div>
                                     <div className="flex justify-between items-center text-[13px] mb-2">
                                         <span className="text-[#64748b] font-medium">Predicted Matrix Run:</span>
                                         <span className={`font-mono font-bold ${sm.totalGross > globalBudget ? 'text-red-600' : 'text-[#0f172b]'}`}>${sm.totalGross.toLocaleString("en-US")}</span>
                                     </div>
                                     <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${percentageOfBudget > 100 ? 'bg-red-500' : 'bg-[#10b981]'}`} style={{width: `${Math.min(percentageOfBudget, 100)}%`}} />
                                     </div>
                                 </div>
                             );
                         })}
                     </div>

                     <div className="mt-8 pt-6 border-t border-dashed border-[#e2e8f0]">
                         <p className="font-bold text-[13px] text-[#0f172b] mb-3">Synthesize New Computational Model</p>
                         <input 
                            type="text" 
                            placeholder="Enter branch node string..."
                            value={newScenarioName}
                            onChange={(e)=>setNewScenarioName(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[13px] font-medium focus:outline-none focus:border-[#3b82f6] mb-3"
                         />
                         <div className="space-y-2.5">
                            <button onClick={()=>handleCreateScenario("clone")} className="w-full bg-white border border-[#e2e8f0] text-[#0f172b] font-bold text-[13px] py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Clone Pure Base Matrix</button>
                            <button onClick={()=>handleCreateScenario("optimize_overtime")} className="w-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[13px] py-2.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm">Simulate 0% Overtime Variance</button>
                            <button onClick={()=>handleCreateScenario("mass_increment")} className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[13px] py-2.5 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm">Apply +5% Universal Increment Limit</button>
                         </div>
                     </div>
                 </div>

                 {/* Focus View */}
                 <div className="col-span-2 bg-[#f8fafc] p-8 rounded-2xl border border-[#e2e8f0]">
                     <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4 mb-6">
                        <p className="font-bold text-[16px] text-[#0f172b] tracking-tight">Active Matrix Diagnostics Layer: {scenarios.find(s=>s.id===activeScenarioId)?.name}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                           <p className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold mb-2">Cost Projection Matrix</p>
                           <p className="text-[36px] font-bold text-[#0f172b] font-mono tracking-tight leading-none">${metrics.totalGross.toLocaleString("en-US")}</p>
                           <p className={`text-[13px] font-bold mt-2 ${varianceFromBaseline > 0 ? 'text-amber-600' : varianceFromBaseline < 0 ? 'text-emerald-600' : 'text-[#64748b]'}`}>
                               {varianceFromBaseline === 0 ? "Tracking parallel to base load." : varianceFromBaseline > 0 ? `Net Growth: +$${varianceFromBaseline.toLocaleString("en-US")} vs Base` : `Net Savings: -$${Math.abs(varianceFromBaseline).toLocaleString("en-US")} vs Base`}
                           </p>
                        </div>
                        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                           <p className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold mb-2">Budget Target Delta</p>
                           <p className="text-[36px] font-bold text-[#0f172b] font-mono tracking-tight leading-none">${(globalBudget - metrics.totalGross).toLocaleString("en-US")}</p>
                           <p className={`text-[13px] font-bold mt-2 ${metrics.totalGross > globalBudget ? 'text-red-500' : 'text-emerald-600'}`}>
                               {metrics.totalGross > globalBudget ? "CRITICAL: MAXIMUM BUDGET EXCEEDED" : "Buffer intact completely."}
                           </p>
                        </div>
                     </div>
                 </div>
             </div>
         </div>
      )}

      {/* Employees Node Roster */}
      {activeTab === "employees" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
              <div className="flex items-center gap-3 w-full max-w-md">
                 <div className="relative flex-1">
                    <Search className="size-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Locate array vectors across subsets..."
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl pl-9 pr-4 py-2.5 text-[14px] font-medium focus:outline-none focus:border-[#3b82f6] shadow-sm transition-colors"
                    />
                 </div>
              </div>
           </div>
           {filteredEmployees.length === 0 ? (
              <div className="p-10 text-center text-[#64748b] font-medium">Zero targets actively mapping matching algorithms natively securely accurately.</div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#f1f5f9] border-b border-[#e2e8f0]">
                      <tr>
                         <th className="px-6 py-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Global Target Entity Hash</th>
                         <th className="px-6 py-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Algorithmic Risk Score Limit</th>
                         <th className="px-6 py-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Financial Vector Thread Float</th>
                         <th className="px-6 py-4 w-[120px]"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#e2e8f0]">
                      {filteredEmployees.map(emp => (
                         <tr key={emp.id} className="hover:bg-[#f8fafc] transition-colors group">
                            <td className="px-6 py-4">
                               <p className="font-bold text-[#0f172b] text-[15px] group-hover:text-[#3b82f6] transition-colors">{emp.name}</p>
                               <div className="flex gap-3 items-center mt-1">
                                  <span className="text-[11px] font-mono text-[#94a3b8] font-bold">[{emp.id}]</span>
                                  <span className="text-[12px] text-[#64748b]">{emp.role} @ {emp.entity}</span>
                                  {emp.isFlagged && <span className="bg-amber-100 text-amber-700 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">FLAGGED</span>}
                                  {emp.isExcluded && <span className="bg-red-100 text-red-700 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">EXCLUDED</span>}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border tracking-wider uppercase ${
                                  emp.riskLabel==="High"?"bg-red-50 text-red-700 border-red-200":emp.riskLabel==="Medium"?"bg-amber-50 text-amber-700 border-amber-200":"bg-[#d1fae5] text-[#065f46] border-emerald-200"
                               }`}>
                                  {emp.riskScore} {emp.riskLabel}
                               </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-[14px] font-bold text-[#10b981]">{emp.net.toLocaleString('en-US', {style:'currency', currency:emp.currency})}</td>
                            <td className="px-6 py-4 text-right">
                               <button 
                                 onClick={() => setActiveEmployeeId(emp.id)}
                                 className="text-[#3b82f6] border border-[#3b82f6] hover:bg-[#3b82f6] hover:text-white px-4 py-1.5 rounded-lg font-bold text-[12px] opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                 Inspect Parameters
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      )}

      {/* Immutable Compliance & Audit Hub */}
      {activeTab === "audit" && (
         <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc] flex justify-between items-center">
               <div>
                  <h2 className="font-bold text-[#0f172b] text-[18px]">Cryptographic Compliance Vault Directory</h2>
                  <p className="text-[13px] text-[#64748b] mt-1 font-medium">Read-only immutable sequence log tracking structurally sensitive operations cross-system.</p>
               </div>
               <button className="bg-white border border-[#e2e8f0] text-[#0f172b] font-bold text-[13px] shadow-sm px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">Export SEC Array</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#f1f5f9] border-b border-[#e2e8f0]">
                     <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Node Signature Action Ledger Return Logic</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                     {auditLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                           <td className="px-6 py-5">
                              <div className="flex items-start gap-5">
                                 <div className={`mt-1 w-2 h-10 rounded-full flex-shrink-0 ${
                                    log.impactLevel === "critical" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" :
                                    log.impactLevel === "medium" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "bg-emerald-500"
                                 }`} />
                                 <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1.5">
                                       <span className="font-bold text-[15px] text-[#0f172b]">{log.action}</span>
                                       <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border block w-fit shadow-sm ${
                                          log.impactLevel === "critical" ? "bg-red-50 text-red-600 border-red-200" :
                                          log.impactLevel === "medium" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                          "bg-emerald-50 text-emerald-600 border-emerald-200"
                                       }`}>
                                          [{log.impactLevel}] Security Rating Vector
                                       </span>
                                    </div>
                                    <p className="text-[13px] text-[#475569] font-medium max-w-3xl mb-2 leading-relaxed">{log.detail}</p>
                                    <div className="text-[11px] text-[#94a3b8] font-bold font-mono tracking-tight bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">
                                       {log.timestamp} | NODE_ID: [{log.id}] | ORIGIN_ACTUAL_SIG: {log.user.toUpperCase()}
                                    </div>
                                 </div>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}
    </div>
  );
}
