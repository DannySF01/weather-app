export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:col-span-2 bg-blue-950 bg-opacity-30 p-6 rounded-2xl gap-3">
      {children}
    </div>
  );
}
