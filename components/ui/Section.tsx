function Section({
  className,
  children,
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  return (
    <div
      className={`${className} rounded-[28px] border border-slate-700/70 bg-[linear-gradient(145deg,rgba(19,45,76,0.72),rgba(8,25,47,0.82))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl`}
    >
      {children}
    </div>
  );
}

function SectionHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <header className="text-secondary mb-5 px-1 text-xs font-semibold uppercase tracking-wide">
      {children}
    </header>
  );
}

export { Section, SectionHeader };
