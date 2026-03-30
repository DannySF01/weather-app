interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ children, title }: Readonly<CardProps>) {
  return (
    <div className="grid lg:col-span-2 bg-blue-950 bg-opacity-30 p-6 rounded-2xl gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
