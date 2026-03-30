import { ReactNode } from "react";

interface AirItemProps {
  label: string;
  value: string | ReactNode | number | undefined;
  icon?: string;
}

export default function AirItem({ label, value, icon }: AirItemProps) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-xl lg:text-2xl font-bold text-white">
        {value ?? "--"}
      </span>
    </div>
  );
}
