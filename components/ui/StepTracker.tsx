import { Check, Clock, Circle } from "lucide-react";

type StepStatus = "done" | "active" | "pending";

interface Step {
  label: string;
  time?: string;
  status: StepStatus;
}

interface StepTrackerProps {
  steps: Step[];
}

export default function StepTracker({ steps }: StepTrackerProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div
              className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                step.status === "done"
                  ? "bg-[#10b981]"
                  : step.status === "active"
                  ? "bg-[#10b981] ring-4 ring-[rgba(16,185,129,0.2)]"
                  : "bg-[#e5e7eb]"
              }`}
            >
              {step.status === "done" ? (
                <Check className="size-4 text-white" strokeWidth={2.5} />
              ) : step.status === "active" ? (
                <Clock className="size-4 text-white" strokeWidth={2} />
              ) : (
                <Circle className="size-4 text-[#9ca3af]" strokeWidth={1.5} />
              )}
            </div>
            {/* Label */}
            <div className="mt-2 text-center">
              <p
                className={`text-[12px] font-bold whitespace-nowrap ${
                  step.status === "pending" ? "text-[#9ca3af]" : "text-[#0f172b]"
                }`}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="text-[10px] text-[#90a1b9] mt-0.5">{step.time}</p>
              )}
            </div>
          </div>
          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-6 ${
                steps[index + 1].status !== "pending" ? "bg-[#10b981]" : "bg-[#e5e7eb]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
