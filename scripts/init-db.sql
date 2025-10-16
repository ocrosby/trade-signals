-- Initialize TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create hypertables for time-series data
-- This will be done after the initial schema is created by Prisma
-- Run this after: npx prisma db push

-- Convert price_data table to hypertable
-- SELECT create_hypertable('price_data', 'timestamp');

-- Convert indicators table to hypertable  
-- SELECT create_hypertable('indicators', 'timestamp');

-- Convert signals table to hypertable
-- SELECT create_hypertable('signals', 'timestamp');

-- Create compression policies for older data
-- ALTER TABLE price_data SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol');
-- ALTER TABLE indicators SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol');
-- ALTER TABLE signals SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol');

-- Add compression policies (compress data older than 7 days)
-- SELECT add_compression_policy('price_data', INTERVAL '7 days');
-- SELECT add_compression_policy('indicators', INTERVAL '7 days');
-- SELECT add_compression_policy('signals', INTERVAL '7 days');

-- Create retention policies (keep data for 2 years)
-- SELECT add_retention_policy('price_data', INTERVAL '2 years');
-- SELECT add_retention_policy('indicators', INTERVAL '2 years');
-- SELECT add_retention_policy('signals', INTERVAL '2 years');

-- Create indexes for better performance
-- CREATE INDEX CONCURRENTLY idx_price_data_symbol_timestamp ON price_data (symbol, timestamp DESC);
-- CREATE INDEX CONCURRENTLY idx_indicators_symbol_type_timestamp ON indicators (symbol, "indicatorType", timestamp DESC);
-- CREATE INDEX CONCURRENTLY idx_signals_symbol_type_timestamp ON signals (symbol, "signalType", timestamp DESC);

-- Create materialized views for common queries
-- CREATE MATERIALIZED VIEW daily_summary AS
-- SELECT 
--     symbol,
--     DATE(timestamp) as date,
--     FIRST(open, timestamp) as open_price,
--     MAX(high) as high_price,
--     MIN(low) as low_price,
--     LAST(close, timestamp) as close_price,
--     SUM(volume) as total_volume
-- FROM price_data
-- GROUP BY symbol, DATE(timestamp);

-- CREATE UNIQUE INDEX ON daily_summary (symbol, date);
-- SELECT add_continuous_aggregate_policy('daily_summary', INTERVAL '1 day', INTERVAL '1 day', INTERVAL '1 hour');

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE trade_signals TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
