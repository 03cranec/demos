import { ConsumptionApi } from "@514labs/moose-lib";
import { UkPricePaidPipeline } from "../datamodels/UKHousingPricing";

// Define the query parameters
interface QueryParams {
  limit?: number;
}

// Model the query result type
interface UKPriceResult {
  district: string;
  avg_price: number;
  max_price: number;
}

// Define the API
export const ukAggregatedPricesApi = new ConsumptionApi<QueryParams, UKPriceResult[]>(
  "uk_aggregated_prices",
  async ({ limit = 100 }: QueryParams, { client, sql }) => {
    
    // Query for a specific district
    const query = sql`
    SELECT 
        district,
        avgMerge(avg_price) as avg_price,
        maxMerge(max_price) as max_price
    FROM uk_aggregated_prices
    GROUP BY district
    LIMIT ${limit}
    `;

    const resultSet = await client.query.execute<UKPriceResult>(query);
    return await resultSet.json();
  }
); 