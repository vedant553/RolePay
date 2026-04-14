"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, Clock, AlertCircle, Zap, ExternalLink, Activity } from "lucide-react";
import { SourceLogModal } from "@/components/attendance/AttendanceModals";
import { AnomalyDrawer } from "@/components/attendance/AttendanceDrawers";

function PipelineStep({ number, title, status }: { number: number; title: string; status: "completed" | "inProgress" | "pending" }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div className={`transition-colors duration-500 rounded-full size-10 flex items-center justify-center font-bold text-[14px] relative ${
        status === "completed" ? "bg-[#10b981]" : status === "inProgress" ? "bg-[#3b82f6]" : "bg-[#e2e8f0]"
      } ${status !== "pending" ? "text-white" : "text-[#90a1b9]"}`}>
        {status === "inProgress" && <div className="absolute inset-0 rounded-full bg-[#3b82f6] animate-ping opacity-30" />}
        <span className="relative z-10 transition-all duration-300">
          {status === "completed" ? <Check className="size-4" strokeWidth={2.5} /> : number}
        </span>
      </div>
      <p className="text-[#62748e] text-[10px] text-center leading-tight transition-colors">{title}</p>
    </div>
  );
}

function SourceStatus({ name, status, onClick }: { name: string; status: "connected" | "delayed" | "error", onClick?: () => void }) {
  const config = {
    connected: { color: "#10b981", bg: "#ecfdf5", text: "Connected" },
    delayed: { color: "#f59e0b", bg: "#fffbeb", text: "Delayed" },
    error: { color: "#dc2626", bg: "#fef2f2", text: "Error" },
  }[status];
  return (
    <div onClick={onClick} className={`flex items-center justify-between p-2 -mx-2 rounded-lg transition-colors ${onClick ? 'cursor-pointer hover:bg-[#f1f5f9]' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="rounded-full size-2" style={{ backgroundColor: config.color }} />
        <p className="text-[#0f172b] text-[12px] font-medium">{name}</p>
      </div>
      <div className="rounded px-2 py-0.5" style={{ backgroundColor: config.bg, color: config.color }}>
        <p className="font-bold text-[10px] uppercase tracking-wider">{config.text}</p>
      </div>
    </div>
  );
}

function AnomalyRow({ anomaly, onReview }: { anomaly: any; onReview: () => void }) {
  const riskConfig = {
    High: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    Medium: { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" },
    Low: { bg: "#ecfdf5", color: "#10b981", border: "#a7f3d0" },
  }[anomaly.risk as "High"|"Medium"|"Low"];
  const isResolved = anomaly.resolvedStatus !== "Action Required";
  
  return (
    <div className="group flex items-center justify-between p-4 bg-white hover:bg-[#f8fafc] transition-colors rounded-lg border border-[#e2e8f0]">
      <div className="flex items-center gap-4 flex-1">
        <div className="rounded px-2.5 py-1 border text-[10px] font-bold uppercase tracking-[0.5px]" style={{ backgroundColor: riskConfig.bg, color: riskConfig.color, borderColor: riskConfig.border }}>
          {anomaly.risk}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#0f172b] text-[12px] mb-0.5">{anomaly.employee}</p>
          <div className="flex gap-2 items-center"><p className="text-[#62748e] text-[11px] truncate max-w-[280px]">{anomaly.issue}</p><span className="text-[10px] text-[#94a3b8]">— {anomaly.region}</span></div>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${anomaly.resolvedStatus === "Auto-Resolved" ? "bg-[#d1fae5] text-[#065f46]" : anomaly.resolvedStatus === "Rejected" ? "bg-red-100 text-red-700" : "bg-[#fef3c7] text-[#92400e]"}`}>
          {anomaly.resolvedStatus}
        </span>
      </div>
      <button onClick={onReview} className="ml-4 bg-white group-hover:bg-[#f8fafc] group-hover:border-[#cbd5e1] border shadow-sm border-[#e2e8f0] rounded-md px-4 py-1.5 text-[#0f172b] text-[11px] font-bold transition-all focus:ring-2 focus:ring-[#3b82f6] outline-none active:scale-95">
        Review Logs
      </button>
    </div>
  );
}

const mockAnomaliesInitial = [
  { id: 1, region: "US-West", employee: "Sarah Chen", issue: "Consecutive overtime exceeding 20hrs/week limits", risk: "High", resolvedStatus: "Action Required" },
  { id: 2, region: "APAC", employee: "Marcus Johnson", issue: "Clock-in pattern deviation detected natively", risk: "Medium", resolvedStatus: "Auto-Resolved" },
  { id: 3, region: "EU-Region", employee: "Elena Rodriguez", issue: "Missing timesheet bounds for exactly 2 days", risk: "High", resolvedStatus: "Action Required" },
  { id: 4, region: "Global View", employee: "David Park", issue: "Unusual leave overlap logic mapped with holiday vectors", risk: "Low", resolvedStatus: "Auto-Resolved" },
  { id: 5, region: "US-West", employee: "Lisa Anderson", issue: "Hard Overtime logic flagged without prior approvals", risk: "Medium", resolvedStatus: "Action Required" },
  { id: 6, region: "EU-Region", employee: "Stefan Muller", issue: "Geolocation anomaly - checking in from blocked IP", risk: "High", resolvedStatus: "Action Required" },
];

export default function AttendancePage() {
  const [activeRegion, setActiveRegion] = useState("Global View");
  const [autoSync, setAutoSync] = useState(true);
  
  // Pipeline Engine Simulation
  const [pipelinePhase, setPipelinePhase] = useState(2); // 0=Ingest, 1=Pattern, 2=Policy, 3=Payroll, 4=Done
  const [lastSyncText, setLastSyncText] = useState("2 minutes ago");
  
  useEffect(() => {
     if (!autoSync) return;
     const interval = setInterval(() => {
        setPipelinePhase(p => {
           if(p >= 4) { setLastSyncText("Just now"); return 0; }
           return p + 1; 
        });
     }, 4000); // 4 seconds per phase logic
     return () => clearInterval(interval);
  }, [autoSync]);

  // Modals & States
  const [anomalies, setAnomalies] = useState(mockAnomaliesInitial);
  const [targetLogSource, setTargetLogSource] = useState<string | null>(null);
  const [reviewAnomaly, setReviewAnomaly] = useState<any>(null);
  const [kpiFilter, setKpiFilter] = useState<string | null>(null); // "Overtime", "Anomalies", etc.

  // Dynamic Metrics mapped safely via useMemo against active actions
  const filteredAnomalies = useMemo(() => {
     return anomalies.filter(a => {
        if(activeRegion !== "Global View" && a.region !== activeRegion && a.region !== "Global View") return false;
        if(kpiFilter === "Anomalies" && a.resolvedStatus !== "Action Required") return false;
        return true;
     });
  }, [anomalies, activeRegion, kpiFilter]);

  const stats = useMemo(() => {
     const baseEmp = activeRegion === "Global View" ? 1248 : activeRegion === "US-West" ? 450 : activeRegion === "EU-Region" ? 520 : 278;
     const pending = filteredAnomalies.filter(x=>x.resolvedStatus==="Action Required").length;
     const costBase = 142350 - (anomalies.filter(x=>x.resolvedStatus==="Rejected").length * 4500); // Reduce cost dynamic if rejected
     
     return {
        emp: baseEmp.toLocaleString("en-US"),
        pending,
        totalA: filteredAnomalies.length,
        cost: `$${Math.max(costBase, 0).toLocaleString("en-US")}`
     };
  }, [activeRegion, filteredAnomalies, anomalies]);

  const handleResolve = (id: number, decision: string) => {
     setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolvedStatus: decision } : a));
  };

  return (
    <div className="pb-20">
      <SourceLogModal open={!!targetLogSource} onClose={()=>setTargetLogSource(null)} sourceName={targetLogSource} onRetry={()=>setTargetLogSource(null)} />
      <AnomalyDrawer open={!!reviewAnomaly} onClose={()=>setReviewAnomaly(null)} anomaly={reviewAnomaly} onResolve={handleResolve} />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-[24px] font-bold text-[#0f172b]">Attendance Intelligence – March 2026</h1>
        <div className={`border rounded px-2 py-1 flex items-center gap-1.5 transition-colors ${autoSync ? 'bg-[#ecfdf5] border-[#10b981]' : 'bg-[#f1f5f9] border-[#cbd5e1]'}`}>
          <div className={`rounded-full size-1.5 ${autoSync ? 'bg-[#10b981] animate-pulse' : 'bg-[#94a3b8]'}`} />
          <p className={`font-bold text-[10px] uppercase tracking-[0.5px] transition-colors ${autoSync ? 'text-[#10b981]' : 'text-[#64748b]'}`}>{autoSync ? 'AI Engine Active' : 'System Dormant'}</p>
        </div>
      </div>
      <p className="text-[#62748e] text-[14px] mb-5">AI-powered centralized attendance data ingestion & payroll impact control mapping.</p>

      {/* Region Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {["Global View", "US-West", "EU-Region", "APAC"].map((tab) => (
          <button onClick={()=>setActiveRegion(tab)} key={tab} className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all focus:outline-none active:scale-95 ${activeRegion === tab ? "bg-[#0f172b] border-[#0f172b] text-white shadow-md transform -translate-y-[1px]" : "bg-white border text-[#64748b] hover:border-[#10b981] hover:text-[#0f172b]"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Summation Network - Interactive Data Filters */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Entities Tracked", value: stats.emp, badge: "LIVE", badgeStyle: "bg-[#ecfdf5] text-[#10b981]", sub: "Active nodes", color: "#10b981", act: "All" },
          { title: "Attendance Records", value: (activeRegion==="Global View"?28352:8421).toLocaleString("en-US"), badge: "Mar 1-31", badgeStyle: "bg-[#eff6ff] text-[#3b82f6]", sub: "Working Days", color: "#3b82f6", act: null },
          { title: "AI Anomalies Handled", value: stats.totalA.toString(), badge: `${stats.pending} Pending Review`, badgeStyle: "bg-[#fffbeb] text-[#f59e0b]", sub: "Critical Flags", color: "#f59e0b", act: "Anomalies" },
          { title: "Overtime Meta Limits", value: (activeRegion==="Global View"?2847:942).toLocaleString("en-US"), badge: "▲ 8.4%", badgeStyle: "bg-[#f3e8ff] text-[#8b5cf6]", sub: "vs Last Iteration", color: "#8b5cf6", act: null },
        ].map((card, i) => (
          <div key={i} onClick={card.act ? ()=>setKpiFilter(kpiFilter === card.act ? null : card.act) : undefined} className={`bg-white border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all ${card.act ? 'cursor-pointer hover:border-['+card.color+'] hover:ring-2 ring-['+card.color+']/20' : ''} ${kpiFilter === card.act ? 'ring-2 border-['+card.color+']' : 'border-[rgba(226,232,240,0.6)]'}`}>
            <div className="absolute right-4 top-4 opacity-5 transition-transform duration-500 ease-out hover:scale-110">
              <div className="size-24 rounded-full border-8" style={{ borderColor: card.color }} />
            </div>
            <div className="size-9 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: card.color }}>
              <Zap className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] font-bold text-[#62748e] uppercase tracking-[0.55px] mb-1">{card.title}</p>
            <p className="text-[30px] font-bold text-[#0f172b] tracking-tight mb-2">{card.value}</p>
            <div className="flex items-center gap-1.5">
              <span className={`${card.badgeStyle} rounded px-1.5 py-0.5 text-[10px] font-bold`}>{card.badge}</span>
              <span className="text-[10px] text-[#90a1b9] font-medium">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Structural Layout Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        
        {/* ML Engine Status Node */}
        <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#0f172b] text-[16px] mb-1">Algorithmic Processing Block</h3>
              <p className="text-[#62748e] text-[12px]">Automated lifecycle event parsing & injection</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#0f172b] transition-colors">Auto-Sync Pulse</span>
              <div className="relative inline-block w-11 h-6">
                <input className="sr-only peer" type="checkbox" checked={autoSync} onChange={(e)=>setAutoSync(e.target.checked)} />
                <div className={`w-full h-full rounded-full transition-colors ${autoSync ? 'bg-[#10b981]' : 'bg-[#cbd5e1]'}`} />
                <div className={`absolute left-[2px] top-[2px] bg-white size-5 rounded-full transition-transform shadow-sm ${autoSync ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
          
          <div className="flex items-center justify-between mb-8 px-2 flex-1">
            <PipelineStep number={1} title="Data Ingest" status={pipelinePhase>0?"completed":pipelinePhase===0?"inProgress":"pending"} />
            <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${pipelinePhase>0?'bg-[#10b981]':'bg-[#e2e8f0]'}`} />
            <PipelineStep number={2} title="Pattern Logic" status={pipelinePhase>1?"completed":pipelinePhase===1?"inProgress":"pending"} />
            <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${pipelinePhase>1?'bg-[#10b981]':'bg-[#e2e8f0]'}`} />
            <PipelineStep number={3} title="Validations" status={pipelinePhase>2?"completed":pipelinePhase===2?"inProgress":"pending"} />
            <div className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${pipelinePhase>2?'bg-[#10b981]':'bg-[#e2e8f0]'}`} />
            <PipelineStep number={4} title="Map Ledgers" status={pipelinePhase>3?"completed":pipelinePhase===3?"inProgress":"pending"} />
          </div>
          
          <div className="border-t border-[#f1f5f9] pt-4">
            <div className="flex items-center justify-between mb-4 bg-[#f8fafc] px-3 py-2 rounded-lg">
              <p className="text-[#64748b] text-[11px] uppercase tracking-[0.55px] font-bold flex items-center gap-1.5"><Activity className="size-3.5" /> Latest Node Propagation</p>
              <p className="text-[#0f172b] text-[12px] font-bold font-mono">{autoSync ? lastSyncText : "Halted by Admin"}</p>
            </div>
            <p className="text-[#94a3b8] text-[11px] uppercase tracking-[0.55px] font-bold mb-3 px-1">Network Socket Sources</p>
            <div className="space-y-1">
              <SourceStatus name="BambooHR Master" status={autoSync ? "connected" : "delayed"} />
              <SourceStatus name="Workday Integrator" status="connected" />
              <SourceStatus name="Azure AD Sync" status="delayed" />
              <SourceStatus onClick={()=>setTargetLogSource('Custom SFTP')} name="Custom SFTP Drop" status="error" />
            </div>
          </div>
        </div>

        {/* Dynamic Payroll Constraints */}
        <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#0f172b] text-[16px] mb-1">Ledger Meta Impact (Live)</h3>
              <p className="text-[#62748e] text-[12px]">Mathematical financial load calculations based on anomaly resolution states.</p>
            </div>
            <div className={`size-3 rounded-full ${autoSync?'bg-[#10b981] animate-pulse':'bg-[#f59e0b]'}`} />
          </div>
          <div className="space-y-6 mb-6">
            {[
              { label: "Estimated Overtime Logic Costing", value: stats.cost, change: "+8.4%", type: "increase" as const },
              { label: "Calculated Leave Subtractions", value: "$28,450", change: "-2.1%", type: "decrease" as const },
              { label: "Net Ledger Deviation Percentile", value: "+2.8%", change: "Within Meta Threshold", type: "neutral" as const },
            ].map((metric) => (
              <div key={metric.label}>
                <p className="text-[#64748b] font-bold uppercase tracking-wider text-[10px] mb-1.5">{metric.label}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#0f172b] text-[24px] tracking-tight">{metric.value}</p>
                  <p className={`font-bold text-[12px] px-2 py-0.5 rounded ${metric.type === "increase" ? "bg-red-50 text-red-600" : metric.type === "decrease" ? "bg-emerald-50 text-[#10b981]" : "bg-slate-50 text-[#62748e]"}`}>{metric.change}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#f1f5f9] pt-5">
             <div className="bg-[#f8fafc] rounded-xl p-3 flex justify-between items-center border border-[#e2e8f0]">
                <div className="text-[#0f172b] text-[12px] font-bold flex items-center gap-2"><div className="size-2 bg-emerald-500 rounded-full" /> System Meta Risk Factor</div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-4 rounded-sm bg-[#10b981]" />
                  <div className="w-2 h-4 rounded-sm bg-[#10b981]" />
                  <div className="w-2 h-4 rounded-sm bg-[#e2e8f0]" />
                  <div className="w-2 h-4 rounded-sm bg-[#e2e8f0]" />
                  <div className="w-2 h-4 rounded-sm bg-[#e2e8f0]" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Logic Overrides List */}
      <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#0f172b] text-[16px] mb-1">Algorithmic Irregularities Flagged</h3>
            <p className="text-[#62748e] text-[12px]">
              {stats.totalA} total nodes tracked • {anomalies.filter(x=>x.resolvedStatus==="Auto-Resolved").length} natively locked • {stats.pending} await manual override bounds.
            </p>
          </div>
          <button onClick={()=>{setActiveRegion('Global View'); setKpiFilter(null);}} className="text-[#3b82f6] font-bold text-[12px] flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            Reset Drill-down Frame <ExternalLink className="size-3" strokeWidth={2} />
          </button>
        </div>
        
        <div className="space-y-3">
          {filteredAnomalies.length === 0 ? (
             <div className="py-12 bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center text-center">
                <AlertCircle className="size-10 text-[#94a3b8] mb-3" />
                <p className="font-bold text-[#0f172b] text-[14px]">Zero active flags parsed within current bounds</p>
                <p className="text-[12px] text-[#64748b]">Engine reports logic integrity maintained for {activeRegion}.</p>
             </div>
          ) : filteredAnomalies.map((anomaly) => (
             <AnomalyRow key={anomaly.id} anomaly={anomaly} onReview={() => setReviewAnomaly(anomaly)} />
          ))}
        </div>
      </div>
    </div>
  );
}
