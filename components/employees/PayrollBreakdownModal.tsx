"use client";
import React from "react";
import { X, PieChart } from "lucide-react";

export function PayrollBreakdownModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
         <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172b] flex items-center gap-2"><PieChart className="size-5 text-[#8b5cf6]" /> Financial Breakdown</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6">
           <p className="text-[13px] text-[#64748b] mb-4">A high-level dispersion matrix of the aggregate $565,240 gross total for current month operations.</p>
           
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[13px] font-bold mb-1"><span className="text-[#0f172b]">USA Base Operations</span> <span className="text-[#8b5cf6]">45%</span></div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded"><div className="bg-[#8b5cf6] h-2 rounded" style={{width: '45%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] font-bold mb-1"><span className="text-[#0f172b]">EU Personnel Hub</span> <span className="text-[#8b5cf6]">30%</span></div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded"><div className="bg-[#8b5cf6] h-2 rounded" style={{width: '30%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] font-bold mb-1"><span className="text-[#0f172b]">APAC Regions</span> <span className="text-[#8b5cf6]">25%</span></div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded"><div className="bg-[#8b5cf6] h-2 rounded" style={{width: '25%'}}></div></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
