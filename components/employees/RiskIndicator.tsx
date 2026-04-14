import React from "react";
import { Employee } from "@/lib/data/employees";

export function RiskIndicator({ score }: { score: number }) {
  const color = score < 20 ? "#10b981" : score < 50 ? "#f59e0b" : "#ef4444";
  const bg = score < 20 ? "#d1fae5" : score < 50 ? "#fef3c7" : "#fee2e2";
  return (
    <div className="flex items-center gap-1.5 group relative cursor-help">
      <div className="flex-1 max-w-[50px] h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="px-1.5 py-0.5 rounded text-[11px] font-bold min-w-[28px] text-center" style={{ backgroundColor: bg, color }}>
        {score}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0f172b] text-white text-[10px] p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <p className="font-bold mb-1">Risk Breakdown</p>
        <p className="text-[#94a3b8]">Overall Score: {score}/100</p>
        <p className="text-[#94a3b8]">Status: {score < 20 ? "Safe" : score < 50 ? "Moderate" : "High Risk"}</p>
        {score >= 50 && <p className="text-red-400 mt-1">Requires immediate review.</p>}
      </div>
    </div>
  );
}
