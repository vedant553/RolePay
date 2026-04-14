import React from "react";

interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (num: number) => void;
}

export function PaginationComponent({ total, perPage, currentPage, onPageChange, onPerPageChange }: PaginationProps) {
  const pages = Math.ceil(total / perPage) || 1;
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <div className="border-t border-[#e2e8f0] px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-[14px] text-[#64748b]">
          Showing <span className="font-bold text-[#0f172b]">{total === 0 ? 0 : start}-{end}</span> of <span className="font-bold text-[#0f172b]">{total}</span>
        </p>
        <div className="flex items-center gap-2">
           <span className="text-[12px] text-[#64748b] font-medium uppercase tracking-wide">Rows:</span>
           <select 
              value={perPage} 
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-[13px] border border-[#e2e8f0] rounded-md font-bold focus:outline-none"
            >
             <option value={5}>5</option>
             <option value={10}>10</option>
             <option value={20}>20</option>
             <option value={50}>50</option>
           </select>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-[#e2e8f0] rounded-md text-[14px] text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: pages }).map((_, i) => {
          const num = i + 1;
          const isActive = num === currentPage;
          return (
             <button 
              key={num} 
              onClick={() => onPageChange(num)}
              className={`px-3 py-2 rounded-md text-[14px] transition-colors ${isActive ? "bg-[#10b981] text-white font-bold shadow-sm" : "border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"}`}
            >
              {num}
            </button>
          )
        })}
        <button 
          onClick={() => onPageChange(Math.min(pages, currentPage + 1))}
          disabled={currentPage === pages}
          className="px-3 py-2 border border-[#e2e8f0] rounded-md text-[14px] text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
