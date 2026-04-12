export default function Card({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: "blue" | "green" | "violet" }) {
    const colorVariants = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      violet: "bg-violet-50",
    };
  
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          </div>
          <div className={`rounded-full p-2 ${colorVariants[color]}`}>{icon}</div>
        </div>
      </div>
    );
  }
  