"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical, Download, Edit2, Trash2, Plus, ArrowLeft, Sparkles, Filter, ArrowDownUp, Check, Copy, AlertCircle, PlayCircle, EyeOff, Search, Users, PieChart } from "lucide-react";

import { TemplateDrawer } from "@/components/salary/SalaryDrawers";
import { ExportModal, ImportModal, DeleteConfirmModal, AssignedEmployeesModal, AssignPersonnelModal } from "@/components/salary/SalaryModals";

export interface Template {
  id: number;
  name: string;
  country: string;
  grade: string;
  baseStructure: string;
  variableRule: string;
  employeesAssigned: number;
  lastModified: string;
  status: "active" | "draft" | "inactive";
}

const mockTemplates: Template[] = [
  { id: 1, name: "Senior Tech - India", country: "India", grade: "L5-L7", baseStructure: "$45,000 - $85,000", variableRule: "15% Performance", employeesAssigned: 124, lastModified: "2 days ago", status: "active" },
  { id: 2, name: "Mid-Level Engineering", country: "United States", grade: "L3-L4", baseStructure: "$95,000 - $145,000", variableRule: "12% + RSU", employeesAssigned: 89, lastModified: "5 days ago", status: "active" },
  { id: 3, name: "Junior Sales - UK", country: "United Kingdom", grade: "S1-S2", baseStructure: "$35,000 - $55,000", variableRule: "20% Commission", employeesAssigned: 56, lastModified: "1 week ago", status: "active" },
  { id: 4, name: "Marketing Lead - APAC", country: "Singapore", grade: "M4-M5", baseStructure: "$110,000 - $160,000", variableRule: "10% Target-based", employeesAssigned: 32, lastModified: "3 days ago", status: "draft" },
  { id: 5, name: "Product Manager - EU", country: "Germany", grade: "P3-P4", baseStructure: "$75,000 - $105,000", variableRule: "8% Performance", employeesAssigned: 41, lastModified: "1 day ago", status: "active" },
  { id: 6, name: "Finance Analyst - UAE", country: "UAE", grade: "F2-F3", baseStructure: "$180,000 - $260,000", variableRule: "5% Annual Bonus", employeesAssigned: 18, lastModified: "2 weeks ago", status: "inactive" },
  { id: 7, name: "DevOps Engineer - Canada", country: "Canada", grade: "E4-E5", baseStructure: "$90,000 - $130,000", variableRule: "10% + Options", employeesAssigned: 28, lastModified: "4 days ago", status: "active" },
  { id: 8, name: "HR Operations - Australia", country: "Australia", grade: "H2-H3", baseStructure: "$70,000 - $95,000", variableRule: "No Variable", employeesAssigned: 15, lastModified: "6 days ago", status: "active" },
];

function StatusBadge({ status }: { status: "active" | "draft" | "inactive" }) {
  const styles = {
    active: "bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]",
    draft: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
    inactive: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
  };
  const dots = { active: "bg-[#10b981]", draft: "bg-[#f59e0b]", inactive: "bg-[#94a3b8]" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dots[status]}`} />
      {{ active: "Active", draft: "Draft", inactive: "Inactive" }[status]}
    </span>
  );
}

function Toast({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-xl font-bold text-white transition-all transform ${
      toast.type === "success" ? "bg-[#10b981]" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
    }`}>
      {toast.message}
    </div>
  );
}

type View = "list" | "builder";

export default function SalaryPage() {
  const [view, setView] = useState<View>("list");
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [toast, setToast] = useState<{message: string, type: any} | null>(null);
  const triggerToast = (msg: string, type: any = "success") => { setToast({message: msg, type}); setTimeout(()=>setToast(null), 3000); };

  // Modals & Drawers
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAssigned, setOpenAssigned] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  // Deep linking logic for Drawer
  useEffect(() => {
    if(openDrawer && selectedTemplate) {
      window.history.replaceState(null, '', `?template_id=${selectedTemplate.id}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [openDrawer, selectedTemplate]);

  // States for Builder
  const [builderMode, setBuilderMode] = useState<"ai" | "manual">("ai");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [builderForm, setBuilderForm] = useState({ 
    id: null as number | null, title: "", country: "", grade: "", type: "Performance-linked", exp: "", size: "",
    manualMin: 50000, manualMax: 100000, manualVarPct: 10
  });

  // Filtering & Sorting
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("modified");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Pagination
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Data Sync Simulation
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(()=>setLoading(false), 800) }, []);

  // Filter Computation
  const processedData = useMemo(() => {
    let res = templates.filter(t => {
      // Search
      const sq = search.toLowerCase();
      if(sq && !(t.name.toLowerCase().includes(sq) || t.country.toLowerCase().includes(sq))) return false;
      // Multi-Filters
      if(filters.country?.length && !filters.country.includes(t.country)) return false;
      if(filters.status?.length && !filters.status.includes(t.status)) return false;
      if(filters.hasVariable?.length && t.variableRule === "No Variable") return false;
      
      return true;
    });

    // Sort
    res.sort((a,b) => {
       if(sortBy === "assigned") return b.employeesAssigned - a.employeesAssigned;
       if(sortBy === "alphabetical") return a.name.localeCompare(b.name);
       if(sortBy === "modified") return b.id - a.id; 
       return 0;
    });

    return res;
  }, [search, filters, sortBy, templates]);

  const paginated = processedData.slice((currentPage-1)*perPage, currentPage*perPage);
  const maxPages = Math.ceil(processedData.length / perPage) || 1;

  useEffect(() => {setCurrentPage(1)}, [search, filters, perPage]);

  // Actions
  const handleDuplicate = (t: Template) => {
    const fresh = {...t, id: Date.now(), name: `${t.name} (Copy)`, status: "draft" as const};
    setTemplates([fresh, ...templates]);
    triggerToast(`Duplicated successfully: ${fresh.name}`);
  };

  const handleDelete = () => {
     setTemplates(templates.filter(x => x.id !== selectedTemplate?.id));
     triggerToast('Template irrevocably removed.', 'success');
  };

  const handleEdit = (t: Template) => {
     // Hydration logic
     setBuilderForm({
        id: t.id,
        title: t.name,
        country: t.country,
        grade: t.grade,
        type: t.variableRule.includes("No") ? "None" : "Performance-linked",
        exp: "", size: "",
        manualMin: parseInt(t.baseStructure.replace(/[^0-9-]/g, '').split('-')[0]) || 50000,
        manualMax: parseInt(t.baseStructure.replace(/[^0-9-]/g, '').split('-')[1]) || 100000,
        manualVarPct: parseInt(t.variableRule.replace(/[^0-9]/g, '')) || 10
     });
     setBuilderMode("manual");
     setAiResult(null);
     setView("builder");
     triggerToast('Loaded existing parameters into editor', 'success');
  };

  const handleGenerateAI = () => {
    if(!builderForm.title || !builderForm.grade) return triggerToast('Role Title and Grade referentials required.', 'error');
    setAiGenerating(true);
    
    setTimeout(() => { 
       setAiGenerating(false); 
       // Simulated dynamic math based on inputs
       const base = 50000 + (builderForm.title.length * 2000);
       setAiResult({
         p25: base,
         p50: base * 1.3,
         p90: base * 2.0
       });
       triggerToast('Intelligence Matrix computed successfully', 'success'); 
    }, 2000);
  };

  const handleSaveTemplate = (status: "active" | "draft") => {
     if(!builderForm.title) return triggerToast('Title is missing', 'error');
     setSaveLoading(true);
     
     setTimeout(() => {
         const generatedBase = builderMode === "ai" && aiResult 
            ? `$${Math.round(aiResult.p25).toLocaleString("en-US")} - $${Math.round(aiResult.p90).toLocaleString("en-US")}`
            : `$${builderForm.manualMin.toLocaleString("en-US")} - $${builderForm.manualMax.toLocaleString("en-US")}`;
            
         const varRule = builderForm.type !== "None" ? `${builderForm.manualVarPct}% ${builderForm.type}` : "No Variable";

         if(builderForm.id) {
            // Update
            setTemplates(templates.map(t => t.id === builderForm.id ? {
               ...t, name: builderForm.title, country: builderForm.country, grade: builderForm.grade,
               baseStructure: generatedBase, variableRule: varRule, status, lastModified: "Just now"
            } : t));
         } else {
            // Create
            const newT: Template = {
               id: Date.now(), name: builderForm.title, country: builderForm.country || "Global", grade: builderForm.grade || "L1",
               baseStructure: generatedBase, variableRule: varRule,
               employeesAssigned: 0, lastModified: "Just now", status
            };
            setTemplates([newT, ...templates]);
         }
         
         setSaveLoading(false);
         setView("list");
         triggerToast(`Template saved and marked as ${status}`);
         setBuilderForm({id: null, title: "", country: "", grade: "", type: "Performance-linked", exp: "", size: "", manualMin: 50000, manualMax: 100000, manualVarPct: 10});
         setAiResult(null);
     }, 1500);
  };

  const handleImportSuccess = (parsedData: any[]) => {
      // Formally map the parsed JSON into system state
      const mapped = parsedData.map((p, i) => ({
         id: Date.now() + i,
         name: p.name,
         country: p.country,
         grade: "TBD",
         baseStructure: p.baseStructure,
         variableRule: "TBD",
         employeesAssigned: 0,
         lastModified: "Just now",
         status: "draft" as const
      }));
      setTemplates([...mapped, ...templates]);
      triggerToast(`Successfully ingested ${mapped.length} operational constraints.`, 'success');
  };

  const handleAssignSuccess = (count: number) => {
     if(selectedTemplate) {
        setTemplates(templates.map(t => t.id === selectedTemplate.id ? {...t, employeesAssigned: t.employeesAssigned + count} : t));
        triggerToast(`Successfully bound ${count} nodes to ${selectedTemplate.name}!`);
     }
  }

  // 3-dot Component
  const ActionMenu = ({ t }: { t: Template }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative isolate text-left">
        <button onClick={(e) => {e.stopPropagation(); setOpen(!open);}} className="p-1.5 hover:bg-[#f1f5f9] rounded-md"><MoreVertical className="size-4" /></button>
        {open && (
           <>
             <div className="fixed inset-0 z-40" onClick={(e)=>{e.stopPropagation(); setOpen(false)}} />
             <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] shadow-xl rounded-xl z-50 overflow-hidden text-[12px] font-medium divide-y divide-[#f1f5f9]">
               <div className="p-1">
                 <button className="flex items-center w-full px-3 py-2 hover:bg-slate-50 gap-2" onClick={(e)=>{e.stopPropagation(); setOpen(false); handleDuplicate(t);}}><Copy className="size-3.5"/> Duplicate Form</button>
                 <button className="flex items-center w-full px-3 py-2 hover:bg-slate-50 gap-2" onClick={(e)=>{e.stopPropagation(); setOpen(false); setSelectedTemplate(t); setOpenAssignModal(true);}}><Users className="size-3.5"/> Assign Personnel</button>
               </div>
               <div className="p-1">
                 <button className="flex items-center w-full px-3 py-2 hover:bg-slate-50 gap-2" onClick={(e)=>{e.stopPropagation(); setOpen(false); setSelectedTemplate(t); setOpenDelete(true)}}><Trash2 className="size-3.5 text-red-500"/> <span className="text-red-500">Destroy Record</span></button>
               </div>
             </div>
           </>
        )}
      </div>
    )
  };

  if (view === "builder") {
    return (
      <div className="pb-10 max-w-6xl mx-auto">
        <Toast toast={toast}/>
        <div className="flex justify-between items-center mb-6">
           <button onClick={() => setView("list")} className="flex items-center gap-2 text-[#10b981] font-bold text-[14px] hover:bg-[#10b981]/10 px-3 py-1.5 rounded-lg transition-colors">
             <ArrowLeft className="size-4" strokeWidth={2.5} /> Abort Module
           </button>
           <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
              <button onClick={() => setBuilderMode("ai")} className={`px-4 py-1.5 text-[13px] font-bold rounded-md transition-colors ${builderMode==="ai" ? "bg-white shadow-sm text-[#0f172b]" : "text-[#64748b]"}`}>AI Guided</button>
              <button onClick={() => setBuilderMode("manual")} className={`px-4 py-1.5 text-[13px] font-bold rounded-md transition-colors ${builderMode==="manual" ? "bg-white shadow-sm text-[#0f172b]" : "text-[#64748b]"}`}>Manual Override</button>
           </div>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#10b981] rounded-xl p-2.5">
            {builderMode==="ai" ? <Sparkles className="size-5 text-white" strokeWidth={1.75} /> : <Edit2 className="size-5 text-white" strokeWidth={1.75} />}
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#0f172b]">{builderMode==="ai" ? "AI Neural Template Builder" : "Manual Structural Definition"}</h1>
            <p className="text-[14px] text-[#64748b]">{builderMode==="ai" ? "Leverage localized market indices to synthesize optimal band paths natively." : "Configure internal boundaries manually with sliders and specific validation targets."}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h2 className="font-bold text-[16px] text-[#0f172b] mb-4">Input Parameters</h2>
            <div className="space-y-4 flex-1">
               <div><label className="text-[11px] font-bold text-[#475569] uppercase tracking-[0.5px]">Master Role ID *</label><input type="text" value={builderForm.title} onChange={e=>setBuilderForm({...builderForm, title:e.target.value})} className="w-full h-10 mt-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[13px] focus:outline-none focus:border-[#10b981]"/></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[11px] font-bold text-[#475569] uppercase tracking-[0.5px]">Jurisdiction *</label><input type="text" value={builderForm.country} onChange={e=>setBuilderForm({...builderForm, country:e.target.value})} className="w-full h-10 mt-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[13px]"/></div>
                 <div><label className="text-[11px] font-bold text-[#475569] uppercase tracking-[0.5px]">Band / Grade</label><input type="text" value={builderForm.grade} onChange={e=>setBuilderForm({...builderForm, grade:e.target.value})} className="w-full h-10 mt-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[13px]"/></div>
               </div>
               <div>
                  <label className="text-[11px] font-bold text-[#475569] uppercase tracking-[0.5px]">Variable Dispersal Array</label>
                  <select value={builderForm.type} onChange={e=>setBuilderForm({...builderForm, type:e.target.value})} className="w-full h-10 mt-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[13px]">
                     <option value="Performance-linked">Performance-linked</option><option value="Hard Commission">Hard Commission Array</option><option value="RSU / Options">RSU / Options Base</option><option value="None">None</option>
                  </select>
               </div>
               
               {builderMode === "ai" && (
                 <>
                   <hr className="border-[#f1f5f9]" />
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-[11px] font-bold text-[#475569] uppercase">Experience Target</label><input placeholder="e.g. 5-7 years" className="w-full h-10 mt-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[13px]"/></div>
                     <div><label className="text-[11px] font-bold text-[#475569] uppercase">Company Size Constraint</label><input placeholder="e.g. 1000+ FTE" className="w-full h-10 mt-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[13px]"/></div>
                   </div>
                   <button onClick={handleGenerateAI} disabled={aiGenerating} className="w-full mt-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] h-11 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                     {aiGenerating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles className="size-4" />}
                     {aiGenerating ? "Synthesizing AI Engine..." : "Compute Intelligence Matrix"}
                   </button>
                 </>
               )}

               {builderMode === "manual" && (
                  <div className="space-y-4 pt-2 border-t mt-4 border-[#f1f5f9]">
                     <div>
                        <div className="flex justify-between items-center mb-1"><label className="text-[11px] font-bold text-[#3b82f6] uppercase tracking-[0.5px]">Salary Band Floor</label><span className="font-bold text-[13px]">${builderForm.manualMin.toLocaleString("en-US")}</span></div>
                        <input type="range" min="30000" max="300000" step="5000" value={builderForm.manualMin} onChange={e=>setBuilderForm({...builderForm, manualMin: parseInt(e.target.value)})} className="w-full accent-[#3b82f6]"/>
                     </div>
                     <div>
                        <div className="flex justify-between items-center mb-1"><label className="text-[11px] font-bold text-[#10b981] uppercase tracking-[0.5px]">Salary Band Ceiling</label><span className="font-bold text-[13px]">${builderForm.manualMax.toLocaleString("en-US")}</span></div>
                        <input type="range" min="30000" max="300000" step="5000" value={builderForm.manualMax} onChange={e=>setBuilderForm({...builderForm, manualMax: parseInt(e.target.value)})} className="w-full accent-[#10b981]"/>
                     </div>
                     {builderForm.type !== "None" && (
                         <div>
                            <div className="flex justify-between items-center mb-1"><label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px]">Variable Array Limit</label><span className="font-bold text-[13px]">{builderForm.manualVarPct}%</span></div>
                            <input type="range" min="0" max="100" step="1" value={builderForm.manualVarPct} onChange={e=>setBuilderForm({...builderForm, manualVarPct: parseInt(e.target.value)})} className="w-full accent-[#94a3b8]"/>
                         </div>
                     )}
                  </div>
               )}
            </div>
            
            {(builderMode==="manual" || aiResult) && (
               <div className="bg-white pt-6 border-t border-[#e2e8f0] flex gap-3 mt-4 shrink-0">
                  <button disabled={saveLoading} onClick={()=>handleSaveTemplate("draft")} className="flex-1 py-3 border border-[#10b981] text-[#10b981] font-bold text-[14px] rounded-xl hover:bg-[#10b981]/5 transition-colors disabled:opacity-50">Store as Draft</button>
                  <button disabled={saveLoading} onClick={()=>handleSaveTemplate("active")} className="flex-1 py-3 bg-[#10b981] text-white font-bold text-[14px] rounded-xl hover:bg-[#0ea872] transition-colors shadow-sm flex items-center justify-center disabled:opacity-50">
                    {saveLoading ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Validate & Activate"}
                  </button>
               </div>
            )}
          </div>
          
          <div className="flex flex-col h-full">
            {builderMode === "ai" ? (
               <div className="bg-[#0f172b] rounded-2xl p-6 text-white shadow-xl h-full flex flex-col relative overflow-hidden">
                 {aiResult && <div className="absolute inset-0 bg-emerald-500/10 z-0 pointer-events-none" />}
                 <div className="flex items-center justify-between mb-6 z-10">
                   <div className="flex items-center gap-2"><div className={`size-2 rounded-full ${aiResult ? 'bg-emerald-400':'bg-white/30 animate-pulse'}`} /><span className="font-bold text-[13px] tracking-wide text-white/70">{aiResult ? "MATRIX LOCKED" : "WAITING FOR UPLINK"}</span></div>
                 </div>
                 
                 {aiResult ? (
                   <div className="z-10 flex-1 flex flex-col justify-center">
                     <p className="text-emerald-400 text-[12px] font-bold tracking-widest uppercase mb-1">Interpolated Dynamic Output</p>
                     <h3 className="text-[28px] font-bold mb-4 line-clamp-1">{builderForm.title || "Base Title"}</h3>
                     <div className="space-y-3 bg-white/5 rounded-xl p-5 border border-white/10">
                       <div className="flex justify-between items-center"><span className="text-white/60 text-[13px] font-bold">P25 Floor</span><span className="font-bold text-[15px]">${Math.round(aiResult.p25).toLocaleString("en-US")} /yr</span></div>
                       <div className="flex justify-between items-center bg-white/5 -mx-5 px-5 py-2"><span className="text-white/60 text-[14px] font-bold uppercase tracking-wider">Median Core</span><span className="font-bold text-emerald-400 text-[20px]">${Math.round(aiResult.p50).toLocaleString("en-US")} /yr</span></div>
                       <div className="flex justify-between items-center"><span className="text-white/60 text-[13px] font-bold">P90 Ceiling</span><span className="font-bold text-[15px]">${Math.round(aiResult.p90).toLocaleString("en-US")} /yr</span></div>
                     </div>
                     <p className="text-[11px] text-white/40 mt-6 leading-relaxed bg-[#0f172b]/50 p-2 rounded">Dynamic math constraints derived actively from exact Grade & Role parameters mapping localized jurisdictions precisely.</p>
                   </div>
                 ) : (
                   <div className="z-10 flex-1 flex flex-col items-center justify-center text-center opacity-40">
                     <PieChart className="size-16 mb-4" />
                     <p className="text-[14px] font-bold">Model is Dormant</p>
                     <p className="text-[12px] max-w-[200px] mt-1">Input strict parameters and initiate the compute cycle to review generated bands.</p>
                   </div>
                 )}
               </div>
            ) : (
               <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 h-full flex flex-col items-center text-center">
                   <div className="flex-1 flex flex-col items-center justify-center">
                      <h3 className="font-bold text-[20px] mb-2 text-[#0f172b]">Live Structural Preview</h3>
                      <div className="bg-white border rounded-xl p-4 w-full shadow-sm text-left">
                         <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider mb-2 border-b pb-2">Target Data Result</p>
                         <p className="text-[13px] flex justify-between font-bold mb-1"><span className="text-[#64748b]">Computed Floor:</span> <span className="text-[#3b82f6]">${builderForm.manualMin.toLocaleString("en-US")}</span></p>
                         <p className="text-[13px] flex justify-between font-bold mb-1"><span className="text-[#64748b]">Computed Ceiling:</span> <span className="text-[#10b981]">${builderForm.manualMax.toLocaleString("en-US")}</span></p>
                         <p className="text-[13px] flex justify-between font-bold mt-3 border-t pt-2"><span className="text-[#64748b]">Variable Injection:</span> <span>{builderForm.type !== "None" ? `${builderForm.manualVarPct}% Active` : "None"}</span></p>
                      </div>
                      <p className="text-[12px] text-[#64748b] max-w-[250px] mt-5">This direct array bypasses AI constraints and will save instantly to the database mapping without ML checks.</p>
                   </div>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Toast toast={toast}/>
      <TemplateDrawer open={openDrawer} onClose={()=>setOpenDrawer(false)} template={selectedTemplate} onEdit={(t:any)=>{setOpenDrawer(false); handleEdit(t);}} onDuplicate={handleDuplicate} />
      <ExportModal open={openExport} onClose={()=>setOpenExport(false)} onSuccess={()=>triggerToast('Templated constraints packaged successfully.')} />
      <ImportModal open={openImport} onClose={()=>setOpenImport(false)} onSuccess={handleImportSuccess} />
      <DeleteConfirmModal open={openDelete} onClose={()=>setOpenDelete(false)} template={selectedTemplate} onConfirm={handleDelete} />
      <AssignedEmployeesModal open={openAssigned} onClose={()=>setOpenAssigned(false)} />
      <AssignPersonnelModal open={openAssignModal} onClose={()=>setOpenAssignModal(false)} template={selectedTemplate} onSuccess={handleAssignSuccess} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">Salary Structural Management</h1>
          <p className="text-[14px] text-[#64748b]">Govern base frameworks, scaling logic, and compliance assignments comprehensively.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>setOpenImport(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#334155] hover:bg-[#f8fafc] shadow-sm transition-all focus:ring-2 focus:ring-[#e2e8f0]">
            <Download className="size-4" strokeWidth={2} /> Sync Constraints
          </button>
          <button onClick={() => { setBuilderForm({id: null, title: "", country: "", grade: "", type: "Performance-linked", exp: "", size: "", manualMin: 50000, manualMax: 100000, manualVarPct: 10}); setBuilderMode("ai"); setAiResult(null); setView("builder"); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#10b981] text-white rounded-lg text-[14px] font-bold hover:bg-[#0ea872] shadow-sm transition-all">
            <Plus className="size-4" strokeWidth={2.5} /> Design Framework
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { title: "Active Constraints", value: templates.filter(t=>t.status==="active").length.toString(), change: "+3 stable bounds", positive: true, act: ()=>setFilters({...filters, status:['active']}) },
          { title: "Sovereignties Tracked", value: Array.from(new Set(templates.map(t=>t.country))).length.toString(), subtitle: "Operational Jurisdictions", act: ()=>{ const allC = Array.from(new Set(templates.map(t=>t.country))); setFilters({...filters, country: allC}); } },
          { title: "Linked Subroutines", value: templates.reduce((acc, t)=>acc+t.employeesAssigned, 0).toLocaleString(), change: "System Active Tracking", positive: true, act: ()=>setOpenAssigned(true) },
          { title: "Variable Dynamics Enabled", value: templates.filter(t=>t.variableRule !== "No Variable").length.toString(), subtitle: "Affecting flow logic", act: ()=>setFilters({...filters, hasVariable: ["true"]}) },
        ].map((card, i) => (
          <div key={i} onClick={card.act} className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm hover:ring-2 hover:ring-[#10b981] cursor-pointer transition-all group">
            <p className="text-[13px] font-bold text-[#64748b] mb-2 uppercase tracking-wide group-hover:text-[#10b981] transition-colors">{card.title}</p>
            {loading ? <div className="h-8 w-16 bg-[#e2e8f0] animate-pulse rounded mb-1"/> : <p className="text-[28px] font-bold text-[#0f172a] mb-1">{card.value}</p>}
            {"change" in card && <p className={`text-[12px] font-bold ${card.positive ? "text-[#10b981]" : "text-[#64748b]"}`}>{card.change}</p>}
            {"subtitle" in card && <p className="text-[12px] text-[#94a3b8] font-medium">{card.subtitle}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-visible">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Enforced Templates</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8]" />
              <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Query template tags..." className="pl-8 pr-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-[13px] focus:outline-none focus:border-[#10b981] w-[250px]" />
            </div>
          </div>
          <div className="flex items-center gap-2 relative isolate">
            <div className="relative">
               <button onClick={()=>setShowFilterMenu(!showFilterMenu)} className="px-3 py-1.5 flex gap-1 items-center bg-white border border-[#e2e8f0] rounded-lg text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc]">
                 <Filter className="size-3.5"/> Rules {Object.keys(filters).length>0 && `(${Object.keys(filters).length})`}
               </button>
               {showFilterMenu && (
                 <>
                   <div className="fixed inset-0 z-30" onClick={()=>setShowFilterMenu(false)} />
                   <div className="absolute right-0 top-10 w-48 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-40 p-2 text-[12px]">
                      <div className="px-2 py-1.5 font-bold text-[#94a3b8] uppercase mb-1 flex justify-between"><span>Status Target</span> {filters.status && <button onClick={()=>{const f={...filters};delete f.status;setFilters(f);}} className="text-red-500 hover:underline">X</button>}</div>
                      {["active", "draft", "inactive"].map(s => (
                         <label key={s} className="flex px-2 py-1.5 gap-2 items-center hover:bg-[#f8fafc] rounded-md cursor-pointer">
                            <input type="checkbox" checked={filters.status?.includes(s) || false} onChange={(e) => {
                               const cur = filters.status || [];
                               setFilters({...filters, status: e.target.checked ? [...cur, s] : cur.filter(x=>x!==s)});
                            }} /> <span className="font-medium capitalize">{s}</span>
                         </label>
                      ))}
                      <div className="px-2 py-1 border-t border-[#f1f5f9] mt-2"><button onClick={()=>setFilters({})} className="text-red-500 font-bold hover:underline w-full text-left">Clear Internal Logic</button></div>
                   </div>
                 </>
               )}
            </div>
            
            <div className="relative">
               <button onClick={()=>setShowSortMenu(!showSortMenu)} className="px-3 py-1.5 flex gap-1 items-center bg-white border border-[#e2e8f0] rounded-lg text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc]">
                 <ArrowDownUp className="size-3.5"/> Orient
               </button>
               {showSortMenu && (
                  <>
                   <div className="fixed inset-0 z-30" onClick={()=>setShowSortMenu(false)} />
                   <div className="absolute right-0 top-10 w-48 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-40 p-2 text-[12px] flex flex-col">
                      {[ {l:"Chronological (Mods)", v:"modified"}, {l:"Entity Volume", v:"assigned"}, {l:"Alpha Order", v:"alphabetical"} ].map(o => (
                         <button key={o.v} onClick={()=>{setSortBy(o.v); setShowSortMenu(false);}} className={`px-3 py-2 text-left font-bold rounded-lg ${sortBy===o.v ? "bg-[#10b981]/10 text-[#10b981]":"hover:bg-[#f8fafc] text-[#0f172b]"}`}>{o.l}</button>
                      ))}
                   </div>
                  </>
               )}
            </div>
            
            <button onClick={()=>setOpenExport(true)} className="px-3 py-1.5 flex gap-1 items-center bg-[#0f172b] text-white rounded-lg text-[13px] font-bold hover:bg-[#152040] shadow-sm"><Download className="size-3.5"/> Eject</button>
          </div>
        </div>
        <div className="overflow-visible min-h-[300px]">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                {["Target Node", "Jurisdiction", "Band Limit", "Structural Base", "Compute Rule", "Assignments", "Sync State", "Record Link", "Control"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {loading ? [...Array(5)].map((_,i) => (
                 <tr key={i} className="animate-pulse"><td colSpan={9} className="p-4"><div className="h-6 bg-[#f1f5f9] rounded w-full"/></td></tr>
              )) : paginated.length === 0 ? (
                 <tr>
                    <td colSpan={9} className="py-16 text-center">
                       <EyeOff className="size-10 text-[#cbd5e1] mx-auto mb-2" />
                       <p className="font-bold text-[#0f172b]">No specific template parameters meet the active filter bounds.</p>
                       <p className="text-[12px] text-[#64748b]">Remove tracking tags to regenerate visibility.</p>
                       <button onClick={()=>setFilters({})} className="mt-4 px-4 py-1.5 bg-[#f8fafc] border font-bold text-[12px] rounded-lg">Clear Bounds</button>
                    </td>
                 </tr>
              ) : paginated.map((t) => (
                <tr key={t.id} onClick={(e) => { 
                   if((e.target as HTMLElement).tagName!=="BUTTON" && (e.target as HTMLElement).closest('button')===null) {
                     setSelectedTemplate(t); setOpenDrawer(true); 
                   }
                }} className="hover:bg-[#f8fafc] transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-[12px] font-bold shadow-sm group-hover:scale-105 transition-transform">
                        {t.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-bold text-[#0f172a] group-hover:text-[#10b981] transition-colors line-clamp-1">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#475569] font-medium">{t.country}</td>
                  <td className="px-6 py-4"><span className="text-[12px] font-mono font-bold bg-[#f1f5f9] px-2 py-0.5 rounded text-[#0f172b] whitespace-nowrap">{t.grade}</span></td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#10b981] whitespace-nowrap">{t.baseStructure}</td>
                  <td className="px-6 py-4 text-[12px] text-[#3b82f6] font-bold whitespace-nowrap">{t.variableRule}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#0f172a] bg-[#f8fafc] border px-2 py-0.5 rounded shadow-sm">{t.employeesAssigned}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-[#64748b] font-medium whitespace-nowrap">{t.lastModified}</td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4 text-right pr-4"><ActionMenu t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Integrated natively */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
             <p className="text-[12px] text-[#64748b] font-medium">Viewing block <b>{processedData.length > 0 ? (currentPage-1)*perPage+1 : 0}-{Math.min(currentPage*perPage, processedData.length)}</b> of <b>{processedData.length}</b> total bounds.</p>
             <select value={perPage} onChange={(e) => {setPerPage(Number(e.target.value)); setCurrentPage(1)}} className="bg-white border rounded py-1 px-2 text-[12px] font-bold focus:outline-none">
                 {[5, 10, 25].map(v => <option key={v} value={v}>{v} limit</option>)}
             </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setCurrentPage(c=>Math.max(c-1,1))} disabled={currentPage===1 || processedData.length===0} className="px-3 py-1.5 border border-[#e2e8f0] rounded-md text-[12px] bg-white font-bold text-[#64748b] hover:bg-slate-50 disabled:opacity-50">Backing</button>
            <button onClick={()=>setCurrentPage(c=>Math.min(c+1,maxPages))} disabled={currentPage===maxPages || processedData.length===0} className="px-3 py-1.5 border border-[#e2e8f0] rounded-md text-[12px] bg-white font-bold text-[#64748b] hover:bg-slate-50 disabled:opacity-50">Advance Cycle</button>
          </div>
        </div>
      </div>
    </div>
  );
}
