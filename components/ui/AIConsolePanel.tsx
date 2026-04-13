import { AlertTriangle, Info, CheckCircle, Zap } from "lucide-react";

interface Alert {
  type: "warning" | "info" | "success" | "critical";
  title: string;
  body: string;
  action?: string;
}

interface EntityHealth {
  region: string;
  entity: string;
  risk: string;
  status: "healthy" | "warning" | "critical";
}

interface AIConsolePanelProps {
  title: string;
  version?: string;
  alerts: Alert[];
  entityHealth?: EntityHealth[];
}

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
  },
  info: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    titleColor: "text-blue-300",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-300",
  },
  critical: {
    icon: AlertTriangle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    iconColor: "text-red-400",
    titleColor: "text-red-300",
  },
};

const statusDot: Record<string, string> = {
  healthy: "bg-[#10b981]",
  warning: "bg-amber-400",
  critical: "bg-red-500",
};

export default function AIConsolePanel({
  title,
  version = "v3.1",
  alerts,
  entityHealth,
}: AIConsolePanelProps) {
  return (
    <div className="bg-[#0f172b] rounded-2xl overflow-hidden shadow-xl border border-white/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#10b981]/20 to-transparent border-b border-[#10b981]/20 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#10b981] rounded-full opacity-30 animate-ping" />
            <div className="relative size-2 bg-[#10b981] rounded-full" />
          </div>
          <span className="text-[#10b981] font-bold text-[13px]">{title}</span>
          <span className="text-[10px] text-[#10b981]/60 font-mono">{version}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="size-3 text-[#10b981]" />
          <span className="text-[10px] text-[#10b981]/80 font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="p-4 space-y-3">
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          return (
            <div
              key={index}
              className={`${config.bg} border ${config.border} rounded-xl p-3`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`size-4 ${config.iconColor} shrink-0 mt-0.5`} strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-bold ${config.titleColor} mb-0.5`}>
                    {alert.title}
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed">{alert.body}</p>
                  {alert.action && (
                    <button className={`mt-1.5 text-[11px] font-bold ${config.iconColor} hover:opacity-80 transition-opacity`}>
                      {alert.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Entity Health */}
      {entityHealth && entityHealth.length > 0 && (
        <div className="border-t border-white/5 px-4 pb-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 pt-3">
            Entity Health
          </p>
          <div className="space-y-2">
            {entityHealth.map((entity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${statusDot[entity.status]}`} />
                  <span className="text-[12px] text-white/60">{entity.entity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white/40">{entity.region}</span>
                  <span className="text-[11px] text-white/60">{entity.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
