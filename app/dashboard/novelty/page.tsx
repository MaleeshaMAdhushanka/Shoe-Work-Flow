import { Suspense } from "react";
import { Metadata } from "next";
import { generateInventoryForecast } from "@/app/lib/item/forecast-data";
import {
  Next12MonthsForecast,
  NextYearSalesProjection,
  MetricsCard,
} from "@/app/ui/inventory/forecast-charts";
import ProtectedPage from "@/app/ui/protectedpage";

export const metadata: Metadata = {
  title: "Inventory Forecasting & Trends",
};

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-20 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

async function ForecastContent() {
  const forecast = await generateInventoryForecast();

  return (
    <div className="p-4 lg:p-7 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
           Inventory Forecasting & Trends
        </h1>
        <p className="text-gray-600 mt-2">
           Predictions for your inventory next year
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricsCard
          icon="🎯"
          title="Top Items to Focus"
          value={forecast.topItemsToFocus.length}
          subtitle="High-demand items next year"
          bgColor="bg-blue-50"
        />
        <MetricsCard
          icon="📈"
          title="Next Year Total"
          value={forecast.nextYearTotal}
          subtitle="Units predicted to sell"
          bgColor="bg-green-50"
        />
        <MetricsCard
          icon="🔮"
          title="Forecast Confidence"
          value={`${forecast.forecastConfidence}%`}
          subtitle="Average prediction accuracy"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <Next12MonthsForecast forecastItems={forecast.forecastItems} />
        </div>
        <div>
          <NextYearSalesProjection forecastItems={forecast.forecastItems} />
        </div>
      </div>

      {/* Top Items Table */}
      <div className="w-full bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h3 className="text-2xl font-bold text-gray-900">
            Top Items to Focus On
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Brand
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Item Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Size
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Current Qty
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Predicted Next Year
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {forecast.topItemsToFocus.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.brand}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.name}</td>
                  <td className="px-4 py-3 text-gray-700">{item.size}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.currentQty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.totalNextYear}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.trendDirection === "up"
                          ? "bg-green-100 text-green-800"
                          : item.trendDirection === "down"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.trendDirection === "up" && "📈 Up"}
                      {item.trendDirection === "down" && "📉 Down"}
                      {item.trendDirection === "stable" && "➡️ Stable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedPage path="/dashboard/novelty">
      <Suspense fallback={<SkeletonLoader />}>
        <ForecastContent />
      </Suspense>
    </ProtectedPage>
  );
}
