import Image from "next/image";
import { fetchBestSellers } from "@/app/lib/dashboard/data";

export default async function BestSellers() {
  const bestSellers = await fetchBestSellers();

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Best Selling Products</h2>
      <div className="space-y-4">
        {bestSellers?.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="w-16 h-16 relative rounded-md overflow-hidden">
              <Image src={item.image ? `${process.env.NEXT_PUBLIC_BLOB_URL}${item.image}` : "/default.jpg"} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 40vw, 20vw" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">{item.soldCount} sold</p>
            </div>
            <p className="font-semibold text-gray-900">Rs {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
