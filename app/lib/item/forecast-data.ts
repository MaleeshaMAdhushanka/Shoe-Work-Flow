import { sql } from "@vercel/postgres";
import { Item } from "../types";

// ======================================
// TYPES - Define what data looks like
// ======================================

// Information about one shoe item with predictions
export interface ForecastItem {
  id: string;                    // Unique ID
  name: string;                  // Shoe name
  brand: string;                 // Brand (e.g., "Puma", "Nike")
  size: string;                  // Shoe size
  currentQty: number;            // How many in stock now
  price: number;                 // Price of item
  predictedMonthly: number[];    // Predicted sales for each of 12 months
  totalNextYear: number;         // Total predicted for next year
  trendDirection: "up" | "down" | "stable"; // Is it selling more or less?
}

// All forecast data combined
export interface ForecastMetrics {
  topItemsToFocus: ForecastItem[];  // Top 5 items to watch
  nextYearTotal: number;            // Total units sold next year
  forecastConfidence: number;       // How confident we are (%)
  forecastItems: ForecastItem[];    // All predicted items
}

// ======================================
// HELPER FUNCTION - Predict 12 months
// ======================================

/**
 * Simple prediction: assumes each month follows the base quantity
 * with some random variation (like real sales have ups and downs)
 * 
 * @param baseQuantity - Starting quantity (e.g., current stock)
 * @returns Array of 12 predicted monthly quantities
 */
function predictTwelveMonths(baseQuantity: number): number[] {
  const predictions: number[] = [];

  // Loop 12 times (one for each month)
  for (let month = 0; month < 12; month++) {
    // Each month: base quantity + small random change (-10% to +10%)
    const randomChange = (Math.random() - 0.5) * 0.2; // Random between -0.1 and +0.1
    const predictedQty = baseQuantity * (1 + randomChange);
    
    // Make sure we never predict less than 1 unit
    const finalPrediction = Math.max(1, Math.round(predictedQty));
    
    predictions.push(finalPrediction);
  }

  return predictions;
}

// ======================================
// HELPER FUNCTION - Extract brand name
// ======================================

/**
 * Get brand name from item name
 * Example: "Puma shoes" → "Puma"
 * 
 * @param itemName - Full product name
 * @returns First word (usually the brand)
 */
function extractBrand(itemName: string): string {
  const parts = itemName.split(" ");
  return parts[0] || "Unknown";
}

// ======================================
// HELPER FUNCTION - Determine trend
// ======================================

/**
 * Check if sales are going up, down, or staying stable
 * Compares first 3 months vs last 3 months
 * 
 * @param monthlyData - Array of 12 predictions
 * @returns "up", "down", or "stable"
 */
function determineTrend(monthlyData: number[]): "up" | "down" | "stable" {
  // Get average of first 3 months
  const first3Months = monthlyData.slice(0, 3);
  const firstAverage = first3Months.reduce((a, b) => a + b, 0) / 3;

  // Get average of last 3 months
  const last3Months = monthlyData.slice(-3);
  const lastAverage = last3Months.reduce((a, b) => a + b, 0) / 3;

  // Compare: if last is 10% higher → going up
  if (lastAverage > firstAverage * 1.1) {
    return "up";
  }

  // If last is 10% lower → going down
  if (lastAverage < firstAverage * 0.9) {
    return "down";
  }

  // Otherwise → stable
  return "stable";
}

// ======================================
// MAIN FUNCTION - Get all forecast data
// ======================================

/**
 * Main function: Gets all items from database and creates predictions
 * This is what runs when the page loads!
 */
export async function generateInventoryForecast(): Promise<ForecastMetrics> {
  try {
    // STEP 1: Get all items from database
    const itemsResult = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      ORDER BY qty DESC
    `;

    const allItems = itemsResult.rows;

    // STEP 2: Create forecast for EACH item
    const forecastItems: ForecastItem[] = allItems.map((item) => {
      // Predict sales for 12 months
      const monthlyPredictions = predictTwelveMonths(item.qty);

      // Add up all 12 months to get yearly total
      const yearlyTotal = monthlyPredictions.reduce((sum, qty) => sum + qty, 0);

      return {
        id: item.id,
        name: item.name,
        brand: extractBrand(item.name),
        size: item.size,
        currentQty: item.qty,
        price: item.price,
        predictedMonthly: monthlyPredictions,
        totalNextYear: yearlyTotal,
        trendDirection: determineTrend(monthlyPredictions),
      };
    });

    // STEP 3: Sort by yearly total and pick top 5 to focus on
    const topItemsToFocus = [...forecastItems]
      .sort((a, b) => b.totalNextYear - a.totalNextYear)
      .slice(0, 5);

    // STEP 4: Calculate total for all items next year
    const nextYearTotal = forecastItems.reduce(
      (sum, item) => sum + item.totalNextYear,
      0
    );

    // STEP 5: Set confidence level (random for now, but could be based on data quality)
    const forecastConfidence = 40; // 40% confidence (you can adjust this)

    // STEP 6: Return everything needed for the dashboard
    return {
      topItemsToFocus,
      nextYearTotal: Math.round(nextYearTotal),
      forecastConfidence,
      forecastItems: forecastItems.slice(0, 20), // Show only top 20 on charts
    };
  } catch (error) {
    console.error("❌ Error generating forecast:", error);
    throw new Error("Failed to generate forecast data.");
  }
}
