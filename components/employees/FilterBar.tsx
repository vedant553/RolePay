"use client";
import React, { useState } from "react";
import { ChevronDown, Search, Download, X } from "lucide-react";

export function FilterBar({ searchQuery, setSearchQuery, onExport, filters, setFilters }: any) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    if (current.includes(value)) {
       setFilters({...filters, [key]: current.filter((v:any) => v !== value)});
    } else {
       setFilters({...filters, [key]: [...current, value]});
    }
  };

  const clearFilter = (key: string) => {
    const fresh = {...filters};
    delete fresh[key];
    setFilters(fresh);
  };

  const FilterDropdown = ({ label, options, filterKey }: { label: string, options: string[], filterKey: string }) => {
    const isOpen = openDropdown === filterKey;
    const selectedCount = (filters[filterKey] || []).length;
    
    return (
      <div className="relative isolate">
        <button 
          onClick={() => setOpenDropdown(isOpen ? null : filterKey)}
          className={`h-10 px-4 rounded-lg flex items-center gap-2 text-[14px] transition-colors border ${selectedCount > 0 ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 font-bold" : "bg-white border-[#e2e8f0] text-[#0f172b] hover:bg-[#f8fafc]"}`}
        >
          {label} {selectedCount > 0 && `(${selectedCount})`}
          <ChevronDown className="size-3.5 opacity-70" strokeWidth={2} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-12 left-0 w-56 bg-white border border-[#e2e8f0] shadow-xl rounded-xl p-3 z-40">
              <div className="flex items-center justify-between mb-3 text-[11px] font-bold uppercase text-[#94a3b8]">
                <span>Select values</span>
                {selectedCount > 0 && <button onClick={() => clearFilter(filterKey)} className="text-[#ef4444] hover:underline">Clear</button>}
              </div>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                 {options.map(opt => {
                   const isSelected = (filters[filterKey] || []).includes(opt);
                   return (
                     <label key={opt} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
                        <div className={`size-4 rounded flex items-center justify-center border transition-colors ${isSelected ? "border-[#10b981] bg-[#10b981]" : "border-[#cbd5e1] bg-white"}`}>
                          {isSelected && <Check className="size-3 text-white" />}
                        </div>
                        <span className="text-[13px] text-[#0f172b]">{opt}</span>
                     </label>
                   )
                 })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const hasAnyFilter = Object.keys(filters).some(k => filters[k].length > 0);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown label="Country" filterKey="country" options={["USA", "Singapore", "Spain", "UK", "India", "Germany", "Japan", "Canada"]} />
          <FilterDropdown label="Risk Level" filterKey="risk" options={["Low Risk (<20)", "Moderate (20-49)", "High Risk (50+)"]} />
          <FilterDropdown label="Status" filterKey="status" options={["Active", "On Leave", "Inactive"]} />
          
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exact Name, ID, or Entity..."
              className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-10 pr-4 text-[14px] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#10b981] transition-colors"
            />
          </div>
          
          <button 
            onClick={onExport}
            className="bg-[#0f172b] text-white hover:bg-[#152040] h-10 px-4 rounded-lg flex items-center gap-2 font-medium text-[14px] transition-all shadow-sm"
          >
            <Download className="size-4" />
            Export Data
          </button>
        </div>

        {/* Applied Filters Tags */}
        {hasAnyFilter && (
           <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase mr-1">Active Blocks:</span>
              {Object.entries(filters).map(([k, values]: any) => 
                values.map((v: string) => (
                  <span key={`${k}-${v}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-[12px] font-medium text-[#0f172b]">
                    {v}
                    <button onClick={() => toggleFilter(k, v)} className="text-[#94a3b8] hover:text-[#ef4444] transition-colors"><X className="size-3" /></button>
                  </span>
                ))
              )}
              <button onClick={() => setFilters({})} className="text-[12px] text-[#94a3b8] hover:text-[#ef4444] font-bold ml-2 transition-colors">Clear Sequence</button>
           </div>
        )}
      </div>
    </div>
  );
}
