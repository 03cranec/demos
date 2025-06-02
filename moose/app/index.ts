import { IngestPipeline } from "@514labs/moose-lib";
import { uk_price_paid } from "./datamodels/UKHousingPricing";

export const UkPricePaidPipeline = new IngestPipeline<uk_price_paid>("uk_price_paid", {
    table: true,
    stream: true,
    ingest: true,
});