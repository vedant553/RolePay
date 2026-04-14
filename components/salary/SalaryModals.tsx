"use client";
import React, { useState } from "react";
import { Download, UploadCloud, X, File, AlertTriangle, PieChart, Users, CheckSquare, Square } from "lucide-react";

export function ExportModal({ open, onClose, onSuccess }: any) {
  const [fmt, setFmt] = useState("csv");
  const [scope, setScope] = useState("filtered");
  const [isExp, setIsExp] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between">
           <h2 className="text-xl font-bold">Export Templates</h2>
           <button onClick={onClose}><X className="size-5 text-[#64748b]"/></button>
        </div>
        <div className="p-6 space-y-5">
           <div>
              <label className="text-[12px] font-bold text-[#64748b]">Scope</label>
              <select value={scope} onChange={e=>setScope(e.target.value)} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 mt-1 text-[13px] outline-none focus:border-[#10b981]">
                <option value="filtered">Filtered Only</option><option value="all">All Data</option>
              </select>
           </div>
           <div>
              <label className="text-[12px] font-bold text-[#64748b]">Format</label>
              <div className="flex gap-2 mt-1">
                 {["csv", "xlsx", "pdf"].map(f => (
                    <button key={f} onClick={()=>setFmt(f)} className={`flex-1 py-2 font-bold uppercase rounded-lg border ${fmt===f?"border-[#10b981] text-[#10b981] bg-[#10b981]/10":"border-[#e2e8f0]"}`}>{f}</button>
                 ))}
              </div>
           </div>
        </div>
        <div className="px-6 py-4 bg-[#f8fafc] border-t flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-[#64748b] font-bold text-[13px]">Cancel</button>
           <button onClick={()=>{ setIsExp(true); setTimeout(()=>{setIsExp(false); onSuccess();}, 1000); }} className="px-5 py-2 bg-[#10b981] text-white font-bold rounded-lg text-[13px] flex items-center justify-center min-w-[90px]">
             {isExp ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Export"}
           </button>
        </div>
      </div>
    </div>
  );
}

export function ImportModal({ open, onClose, onSuccess }: any) {
  const [file, setFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  if (!open) return null;

  const handleProcessFile = async (f: File) => {
    if(!f.name.endsWith(".csv")) { setErr("Invalid format. Strictly use CSV."); return; }
    setFile(f); setErr("");
    
    // Process purely frontend
    const text = await f.text();
    const rows = text.split('\n').filter(r => r.trim().length > 0);
    if(rows.length < 2) return setErr("File contains no workable data rows.");
    
    const headers = rows[0].split(',').map(s=>s.trim().toLowerCase());
    const req = ['name', 'country', 'grade', 'base', 'variable'];
    if(!req.every(h => headers.some(x=>x.includes(h)))) setErr("Missing required columns: Name, Country, Grade, Base, Variable.");

    const parsedData = rows.slice(1, 4).map(r => {
      const cols = r.split(',');
      return { name: cols[0] || 'Unknown', country: cols[1] || 'Unknown', baseStructure: cols[3] || 'TBD' };
    });
    setPreview(parsedData);
  };

  const executeImport = () => {
    setUploading(true);
    setTimeout(()=>{
       setUploading(false);
       onSuccess(preview);
       setFile(null); setPreview([]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
       <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center"><h2 className="font-bold text-xl">Import Templates</h2><button onClick={onClose}><X className="size-5"/></button></div>
        <div className="p-6 overflow-y-auto">
           {!file && (
             <div className="border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] p-8 rounded-xl flex flex-col items-center justify-center cursor-pointer relative hover:bg-slate-50">
                <input type="file" onChange={e => { if(e.target.files) handleProcessFile(e.target.files[0]) }} className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv" />
                <UploadCloud className="size-10 text-[#94a3b8] mb-3"/>
                <p className="font-bold text-[14px]">Drag CSV validation file to parse</p>
                <p className="text-[12px] text-[#64748b] mt-1">Maximum 500 lines per block</p>
             </div>
           )}
           {err && <p className="text-red-500 text-[12px] mt-3 font-bold text-center bg-red-50 p-2 rounded">{err}</p>}
           
           {file && !err && (
             <div>
                <div className="mb-4 p-3 border border-[#10b981]/40 bg-[#10b981]/5 rounded flex items-center justify-between"><div className="flex gap-2 items-center"><File className="size-5 text-[#10b981]"/><span className="text-[13px] font-bold text-[#0f172b]">{file.name}</span></div> <button className="text-red-500 text-[12px] font-bold" onClick={()=>setFile(null)}>Remove</button></div>
                {preview.length > 0 && (
                  <div>
                    <p className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2">Data Integrity Preview (First 3 Rows)</p>
                    <div className="border rounded-lg overflow-hidden divide-y text-[13px]">
                       {preview.map((p, i) => (
                         <div key={i} className="p-2 bg-[#f8fafc] flex justify-between"><div className="w-1/2 font-bold truncate pr-2">{p.name}</div><div className="w-1/4 truncate">{p.country}</div><div className="w-1/4 text-right font-bold text-[#10b981] truncate">{p.baseStructure}</div></div>
                       ))}
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
        <div className="bg-[#f8fafc] p-4 flex justify-between border-t border-[#e2e8f0] items-center">
           <button className="text-[12px] font-bold text-[#3b82f6] hover:underline">Documentation Schema</button>
           <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 font-bold text-[13px] bg-white border rounded">Cancel</button>
              <button disabled={!file || uploading || !!err} onClick={executeImport} className="px-5 py-2 bg-[#10b981] text-white rounded font-bold text-[13px] disabled:opacity-50 min-w-[100px] flex justify-center items-center">
                 {uploading ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Initiate Import"}
              </button>
           </div>
        </div>
       </div>
    </div>
  );
}

export function DeleteConfirmModal({ open, onClose, onConfirm, template }: any) {
  const [loading, setLoading] = useState(false);
  if(!open || !template) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
         <AlertTriangle className="size-12 text-red-500 mx-auto mb-4" />
         <h2 className="text-lg font-bold mb-2">Obliterate {template.name}?</h2>
         <p className="text-[13px] text-[#64748b] mb-6">This severs validation limits for {template.employeesAssigned} employees operating under this constraint map. Dispersal flows may fault.</p>
         <div className="flex gap-3">
            <button onClick={onClose} disabled={loading} className="flex-1 py-2 border rounded font-bold text-[13px] bg-white hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={()=>{setLoading(true); setTimeout(()=>{setLoading(false); onConfirm(); onClose();}, 1500)}} disabled={loading} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-[13px] transition-colors flex items-center justify-center disabled:opacity-50">
              {loading ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Delete Irreversibly"}
            </button>
         </div>
      </div>
    </div>
  )
}

export function AssignedEmployeesModal({ open, onClose }: any) {
    if(!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h2 className="font-bold text-xl flex items-center gap-2"><PieChart className="size-5 text-[#3b82f6]"/> Structural Assignments</h2><button onClick={onClose}><X className="size-5"/></button></div>
            <div className="p-6 overflow-auto">
               <p className="text-[13px] text-[#64748b] mb-5">Current matrix tracks precisely 1,847 employees verified against logic templates.</p>
               <div className="space-y-5">
                  {[{label: "Senior Tech - India", count: 124, pct: "40%", c:"#3b82f6"}, {label: "Mid-Level Engineering", count: 89, pct: "25%", c:"#10b981"}, {label: "Junior Sales - UK", count: 56, pct: "15%", c:"#f59e0b"}].map((row:any) => (
                    <div key={row.label}>
                       <div className="flex justify-between text-[12px] font-bold mb-1.5"><span className="text-[#0f172b]">{row.label}</span><span style={{color:row.c}}>{row.count} ({row.pct})</span></div>
                       <div className="w-full bg-[#f1f5f9] h-2 rounded overflow-hidden"><div className="h-2 rounded transition-all" style={{width: row.pct, backgroundColor: row.c}}></div></div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-[#f8fafc] p-4 border-t flex justify-end"><button onClick={onClose} className="px-4 py-2 font-bold bg-white border border-[#e2e8f0] rounded text-[13px]">Acknowledge</button></div>
          </div>
        </div>
    )
}

export function AssignPersonnelModal({ open, onClose, template, onSuccess }: any) {
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  if(!open || !template) return null;

  const staff = [
    {id:1, name:"Alex Sterling", dept:"Engineering"}, {id:2, name:"Marcus Chen", dept:"Finance"},
    {id:3, name:"Sarah Jenkins", dept:"UK Operations"}, {id:4, name:"Liam Patel", dept:"Engineering"},
    {id:5, name:"Elena Rodriguez", dept:"Sales"}
  ].filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.dept.toLowerCase().includes(search.toLowerCase()));

  const performSave = () => {
     setLoading(true);
     setTimeout(()=>{
        setLoading(false);
        onSuccess(selected.length);
        setSelected([]);
        onClose();
     }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
       <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
          <div className="px-6 py-4 border-b flex justify-between items-center bg-[#f8fafc]">
             <div><h2 className="font-bold text-[18px]">Bind Logic to Employees</h2><p className="text-[12px] text-[#64748b]">Template: {template.name}</p></div>
             <button onClick={onClose} className="hover:bg-slate-200 p-1 rounded"><X className="size-5 text-[#64748b]" /></button>
          </div>
          <div className="p-4 border-b">
             <input autoFocus type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter directory by node ID or Name..." className="w-full border p-2 text-[13px] rounded bg-[#f8fafc] outline-none focus:border-[#3b82f6]"/>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
             {staff.map(s => {
                const isS = selected.includes(s.id);
                return (
                  <div key={s.id} onClick={()=>setSelected(isS ? selected.filter(x=>x!==s.id) : [...selected, s.id])} className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${isS ? "bg-[#3b82f6]/10" : "hover:bg-slate-50"}`}>
                     <button className={`shrink-0 ${isS ? "text-[#3b82f6]" : "text-[#cbd5e1]"}`}>{isS ? <CheckSquare className="size-5"/> : <Square className="size-5"/>}</button>
                     <div><p className="text-[13px] font-bold text-[#0f172b]">{s.name}</p><p className="text-[11px] text-[#64748b]">{s.dept} Subdomain</p></div>
                  </div>
                )
             })}
             {staff.length === 0 && <p className="p-6 text-center text-[#64748b] text-[12px] font-bold">No directory entities match parameters.</p>}
          </div>
          <div className="bg-[#f8fafc] p-4 flex justify-between items-center border-t border-[#e2e8f0]">
             <span className="text-[13px] font-bold text-[#64748b]">{selected.length} entities tracked</span>
             <button disabled={selected.length===0 || loading} onClick={performSave} className="px-5 py-2 min-w-[120px] justify-center bg-[#3b82f6] text-white rounded font-bold text-[13px] disabled:opacity-50 flex items-center">
                 {loading ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Deploy Bindings"}
             </button>
          </div>
       </div>
    </div>
  )
}
