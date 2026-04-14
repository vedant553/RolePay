import React from "react";

interface StatusToggleProps {
  status: "Active" | "On Leave" | "Inactive";
  onChange: (newStatus: "Active" | "On Leave" | "Inactive") => void;
}

export function StatusToggle({ status, onChange }: StatusToggleProps) {
  const styles: Record<string, string> = {
    Active: "bg-[#d1fae5] text-[#065f46]",
    "On Leave": "bg-[#e0e7ff] text-[#3730a3]",
    Inactive: "bg-[#f1f5f9] text-[#475569]",
  };

  const nextStatus = status === "Active" ? "On Leave" : status === "On Leave" ? "Inactive" : "Active";

  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onChange(nextStatus); }}
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold tracking-tight hover:opacity-80 transition-opacity ${styles[status] || "bg-[#f1f5f9] text-[#475569]"}`}
    >
      {status}
    </button>
  );
}
