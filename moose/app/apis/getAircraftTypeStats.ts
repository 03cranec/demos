import { ConsumptionApi } from '@514labs/moose-lib';
import { tags } from "typia";

/**
 * Parameters for the aircraft type statistics API
 */
interface AircraftTypeStatsParams {
  /**
   * Maximum number of aircraft types to return
   * Default: 100
   */
  limit?: number & tags.Type<"int64"> & tags.Minimum<1>;
  
  /**
   * Minimum number of data points required for an aircraft type to be included
   * Default: 10
   */
  minDataPoints?: number & tags.Type<"int64"> & tags.Minimum<1>;
}

/**
 * API to get average altitude and ground speed statistics for different types of aircraft
 * 
 * This API queries the AircraftTrackingProcessed table and returns statistics
 * including average altitude, average ground speed, and the number of data points
 * for each aircraft type.
 */
export const getAircraftTypeStats = new ConsumptionApi<AircraftTypeStatsParams>(
  "getAircraftTypeStats",
  async (params, utils) => {
    const { client, sql } = utils;
    
    // Set default values if parameters are not provided
    const limit = params.limit ?? 100;
    const minDataPoints = params.minDataPoints ?? 10;
    
    // Execute the query with parameterized values
    const result = await client.query.execute(sql`
      SELECT 
        aircraft_type,
        round(avg(alt_baro), 2) as avg_altitude_ft,
        round(avg(gs), 2) as avg_ground_speed_kts,
        count(*) as data_points
      FROM AircraftTrackingProcessed
      WHERE 
        aircraft_type IS NOT NULL 
        AND alt_baro > 0 
        AND gs > 0
      GROUP BY aircraft_type
      HAVING count(*) >= ${minDataPoints}
      ORDER BY data_points DESC
      LIMIT ${limit}
    `);

    return result;
  }
);