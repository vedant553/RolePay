import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  aiTag?: boolean;
}

export default function StatCard({
  title,
  value,
  trend,
  trendDirection,
  subtitle,
  icon,
  iconBg,
  aiTag = true,
}: StatCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-6 flex-1 min-w-[200px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)] overflow-hidden">
      {aiTag && (
        <div className="absolute top-4 right-4 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded px-1.5 py-0.5">
          <p className="text-[8px] font-bold text-[#10b981] tracking-[0.5px] uppercase">AI</p>
        </div>
      )}

      <div
        className={`${iconBg} rounded-xl size-10 flex items-center justify-center mb-4`}
      >
        {icon}
      </div>

      <p className="text-[10px] font-bold text-[#62748e] tracking-[0.5px] uppercase mb-2">
        {title}
      </p>

      <p className="text-[28px] font-bold text-[#0f172b] tracking-tight mb-2">
        {value}
      </p>

      {(trend || subtitle) && (
        <div className="flex items-center gap-2">
          {trend && (
            <div
              className={`flex items-center gap-1 rounded px-2 py-1 ${
                trendDirection === "up"
                  ? "bg-[#ecfdf5] text-[#009966]"
                  : "bg-[#fef2f2] text-[#dc2626]"
              }`}
            >
              {trendDirection === "up" ? (
                <TrendingUp className="size-3" strokeWidth={2} />
              ) : (
                <TrendingDown className="size-3" strokeWidth={2} />
              )}
              <span className="text-[10px] font-bold">{trend}</span>
            </div>
          )}
          {subtitle && (
            <p className="text-[10px] text-[#90a1b9]">{subtitle}</p>
          )}
        </div>
      )}

      {/* Animated bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-2xl">
        <div
          className={`${iconBg} h-full w-[30%] opacity-30 animate-slide-right`}
        />
      </div>
    </div>
  );
}
