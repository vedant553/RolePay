import React from "react";

export function ComplianceBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Compliant: "bg-[#d1fae5] text-[#065f46]",
    "Review Needed": "bg-[#fef3c7] text-[#92400e]",
    Pending: "bg-[#fee2e2] text-[#991b1b]",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold tracking-tight ${styles[status] || "bg-[#f1f5f9] text-[#475569]"}`}>
      {status}
    </span>
  );
}
