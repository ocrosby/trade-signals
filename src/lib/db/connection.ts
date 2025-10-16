import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
}

// Database initialization for TimescaleDB
export async function initializeTimescaleDB(): Promise<void> {
    try {
        // Enable TimescaleDB extension
        await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS timescaledb`;

        // Convert tables to hypertables (run after schema is created)
        console.log('TimescaleDB extension enabled');
    } catch (error) {
        console.error('Failed to initialize TimescaleDB:', error);
        throw error;
    }
}

// Create hypertables for time-series data
export async function createHypertables(): Promise<void> {
    try {
        // Check if hypertables already exist
        const existingHypertables = await prisma.$queryRaw<Array<{ hypertable_name: string }>>`
      SELECT hypertable_name FROM timescaledb_information.hypertables 
      WHERE hypertable_name IN ('price_data', 'indicators', 'signals')
    `;

        const existingNames = existingHypertables.map(h => h.hypertable_name);

        // Create hypertables for time-series tables
        if (!existingNames.includes('price_data')) {
            await prisma.$executeRaw`SELECT create_hypertable('price_data', 'timestamp')`;
            console.log('Created hypertable for price_data');
        }

        if (!existingNames.includes('indicators')) {
            await prisma.$executeRaw`SELECT create_hypertable('indicators', 'timestamp')`;
            console.log('Created hypertable for indicators');
        }

        if (!existingNames.includes('signals')) {
            await prisma.$executeRaw`SELECT create_hypertable('signals', 'timestamp')`;
            console.log('Created hypertable for signals');
        }

        // Set up compression for older data
        await setupCompression();

        // Set up retention policies
        await setupRetentionPolicies();

    } catch (error) {
        console.error('Failed to create hypertables:', error);
        throw error;
    }
}

// Setup compression for older data
async function setupCompression(): Promise<void> {
    try {
        // Enable compression on time-series tables
        await prisma.$executeRaw`ALTER TABLE price_data SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol')`;
        await prisma.$executeRaw`ALTER TABLE indicators SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol')`;
        await prisma.$executeRaw`ALTER TABLE signals SET (timescaledb.compress, timescaledb.compress_segmentby = 'symbol')`;

        // Add compression policies (compress data older than 7 days)
        await prisma.$executeRaw`SELECT add_compression_policy('price_data', INTERVAL '7 days')`;
        await prisma.$executeRaw`SELECT add_compression_policy('indicators', INTERVAL '7 days')`;
        await prisma.$executeRaw`SELECT add_compression_policy('signals', INTERVAL '7 days')`;

        console.log('Compression policies configured');
    } catch (error) {
        console.error('Failed to setup compression:', error);
    }
}

// Setup retention policies
async function setupRetentionPolicies(): Promise<void> {
    try {
        // Add retention policies (keep data for 2 years)
        await prisma.$executeRaw`SELECT add_retention_policy('price_data', INTERVAL '2 years')`;
        await prisma.$executeRaw`SELECT add_retention_policy('indicators', INTERVAL '2 years')`;
        await prisma.$executeRaw`SELECT add_retention_policy('signals', INTERVAL '2 years')`;

        console.log('Retention policies configured');
    } catch (error) {
        console.error('Failed to setup retention policies:', error);
    }
}

// Create performance indexes
export async function createPerformanceIndexes(): Promise<void> {
    try {
        // Create indexes for better query performance
        await prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_price_data_symbol_timestamp 
      ON price_data (symbol, timestamp DESC)
    `;

        await prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_indicators_symbol_type_timestamp 
      ON indicators (symbol, "indicatorType", timestamp DESC)
    `;

        await prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_signals_symbol_type_timestamp 
      ON signals (symbol, "signalType", timestamp DESC)
    `;

        console.log('Performance indexes created');
    } catch (error) {
        console.error('Failed to create performance indexes:', error);
    }
}

export default prisma;
