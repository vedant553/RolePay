import { clsx } from "clsx";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "gray" | "purple";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-[#d1fae5] text-[#065f46]",
  amber: "bg-[#fef3c7] text-[#92400e]",
  red: "bg-[#fee2e2] text-[#991b1b]",
  blue: "bg-[#dbeafe] text-[#1e40af]",
  gray: "bg-[#f1f5f9] text-[#475569]",
  purple: "bg-[#ede9fe] text-[#5b21b6]",
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold",
        variantStyles[variant]
      )}
    >
      {label}
    </span>
  );
}
