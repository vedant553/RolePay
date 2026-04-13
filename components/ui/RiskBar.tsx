interface RiskBarProps {
  label: string;
  value: number;
  variant: "green" | "amber" | "red";
}

const variantColor: Record<string, string> = {
  green: "bg-[#10b981]",
  amber: "bg-[#f59e0b]",
  red: "bg-[#ef4444]",
};

const variantText: Record<string, string> = {
  green: "text-[#10b981]",
  amber: "text-[#f59e0b]",
  red: "text-[#ef4444]",
};

export default function RiskBar({ label, value, variant }: RiskBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[#0f172b]">{label}</span>
        <span className={`text-[13px] font-bold ${variantText[variant]}`}>
          {value}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
        <div
          className={`h-full ${variantColor[variant]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
