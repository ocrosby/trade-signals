# Trade Signals Setup Guide

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## Quick Start with Docker

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd trade-signals
cp env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your API keys:

```bash
# Required API Keys
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_api_key_here"
RAPIDAPI_KEY="your_rapidapi_key_here"

# Database (handled by Docker)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/trade_signals"
REDIS_URL="redis://:redis_password@redis:6379"
```

### 3. Start Services

```bash
# Start PostgreSQL + Redis + App
npm run docker:up

# Check logs
npm run docker:logs
```

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Access Application

- **App**: http://localhost:3000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Manual Setup (Without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL

```bash
# Install PostgreSQL locally or use a cloud service
# Create database
createdb trade_signals

# Install TimescaleDB extension
psql -d trade_signals -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```

### 3. Setup Redis

```bash
# Install Redis locally or use a cloud service
redis-server
```

### 4. Configure Environment

```bash
cp env.example .env.local
# Edit .env.local with your database URLs
```

### 5. Initialize Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

## API Keys Setup

### Alpha Vantage (Free Tier)
1. Visit: https://www.alphavantage.co/support/#api-key
2. Get free API key (25 requests/day)
3. Add to `.env.local`: `ALPHA_VANTAGE_API_KEY="your_key"`

### RapidAPI (Yahoo Finance)
1. Visit: https://rapidapi.com/apidojo/api/yahoo-finance15
2. Subscribe to free plan (500 requests/month)
3. Add to `.env.local`: `RAPIDAPI_KEY="your_key"`

### CoinGecko (Optional)
1. Visit: https://www.coingecko.com/en/api
2. Get free API key (10,000-50,000 requests/month)
3. Add to `.env.local`: `COINGECKO_API_KEY="your_key"`

## Database Schema

### Key Tables

- **assets**: Symbol metadata
- **price_data**: Historical OHLCV data (TimescaleDB hypertable)
- **indicators**: Calculated technical indicators
- **signals**: Generated trading signals
- **trades**: Trade execution records

### TimescaleDB Features

- **Hypertables**: Automatic partitioning by time
- **Compression**: Older data compressed automatically
- **Retention**: Automatic cleanup of old data
- **Continuous Aggregates**: Pre-computed summaries

## Redis Caching Strategy

### Cache Layers

1. **Price Data**: 1 hour TTL
2. **Indicators**: 1 hour TTL  
3. **Signals**: 1 hour TTL
4. **Real-time Data**: 1 minute TTL
5. **Assets**: 24 hours TTL

### Cache Keys

```
price:BTC:1d:100          # Price data cache
indicator:BTC:BOLLINGER:20:1d  # Indicator cache
signals:BTC:BUY:10        # Signals cache
asset:BTC                 # Asset cache
realtime:price:BTC        # Real-time price
```

## Development Workflow

### 1. Database Changes

```bash
# Edit prisma/schema.prisma
npm run db:push          # Apply changes
npm run db:generate      # Regenerate client
```

### 2. Background Jobs

```bash
# Start worker process
npm run worker

# Backfill historical data
npm run backfill

# Calculate indicators
npm run calculate-indicators

# Generate signals
npm run generate-signals
```

### 3. Testing

```bash
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Production Deployment

### 1. Environment Setup

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL="your_production_db_url"
REDIS_URL="your_production_redis_url"
```

### 2. Build and Deploy

```bash
npm run build
npm start
```

### 3. Database Migrations

```bash
npm run db:migrate
```

## Monitoring and Maintenance

### 1. Database Health

```bash
# Check database connection
npm run db:studio

# Monitor TimescaleDB
psql -d trade_signals -c "SELECT * FROM timescaledb_information.hypertables;"
```

### 2. Redis Health

```bash
# Check Redis connection
redis-cli ping

# Monitor cache usage
redis-cli info memory
```

### 3. Application Logs

```bash
# Docker logs
npm run docker:logs

# Application logs
tail -f logs/app.log
```

## Performance Optimization

### 1. Database

- TimescaleDB compression for older data
- Proper indexing on time-series columns
- Partitioning by symbol and time
- Connection pooling

### 2. Redis

- Multiple Redis databases for different data types
- Appropriate TTL values
- Cache warming strategies
- Memory optimization

### 3. Application

- Server-side rendering where appropriate
- Client-side caching with React Query
- WebSocket connections for real-time data
- Background job processing

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL in .env.local
   - Ensure PostgreSQL is running
   - Verify TimescaleDB extension is installed

2. **Redis Connection Failed**
   - Check REDIS_URL in .env.local
   - Ensure Redis is running
   - Verify Redis password

3. **API Rate Limits**
   - Check API key configuration
   - Monitor request usage
   - Implement request queuing

4. **Memory Issues**
   - Monitor Redis memory usage
   - Check database connection pool
   - Optimize query performance

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Database shell
psql -d trade_signals

# Redis shell
redis-cli -a redis_password

# Application shell
docker-compose exec app sh
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   PostgreSQL    │    │     Redis       │
│                 │    │  + TimescaleDB  │    │                 │
│  - API Routes   │◄──►│                 │    │  - Caching      │
│  - Components   │    │  - Price Data   │    │  - Sessions     │
│  - Pages        │    │  - Indicators   │    │  - Real-time    │
│                 │    │  - Signals      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Data Providers │    │  Background     │    │  WebSocket      │
│                 │    │  Workers        │    │  Connections    │
│  - Yahoo Finance│    │                 │    │                 │
│  - Alpha Vantage│    │  - Data Sync    │    │  - Live Prices  │
│  - CoinGecko    │    │  - Indicators   │    │  - Signals      │
│  - Binance      │    │  - Signals      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review application logs
3. Check database and Redis health
4. Verify API key configuration
5. Create an issue in the repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
