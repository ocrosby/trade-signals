# Trade Signals - Intelligent Trading Platform for Beginners

A comprehensive Next.js application designed to make technical analysis accessible to beginner traders. Combines multiple indicators, real-time data, and intuitive design to help new traders learn and succeed in day trading and swing trading.

## 🎯 Project Vision

### Why This Project Exists
Trade Signals bridges the gap between complex financial analysis and beginner-friendly trading tools. Most trading platforms either oversimplify (losing valuable insights) or overwhelm new traders with complexity. This platform provides a learning-focused approach that grows with the user.

### Target Users
- **Beginner Traders**: New to technical analysis, need guided learning
- **Day Traders**: Need fast, reliable signals for intraday decisions  
- **Swing Traders**: Want detailed analysis for multi-day position planning
- **Learning-Focused**: Prefer understanding "why" behind signals, not just "what"

### Primary Markets
- **Stocks**: Major exchanges (NYSE, NASDAQ) with focus on popular tickers
- **Cryptocurrency**: Bitcoin, Ethereum, and top altcoins for 24/7 trading opportunities

### Unique Value Proposition
- **Progressive Complexity**: Start with simple signals, evolve to detailed analysis
- **Educational Focus**: Explains the reasoning behind each signal
- **Performance + UX**: Fast real-time data with intuitive, clean interface  
- **Accuracy First**: Combines multiple indicators for higher confidence signals
- **Beginner-to-Pro Path**: Grows with user expertise from simple alerts to advanced strategies

## 📋 User Stories

### Core Trading Features
1. The user should be able to search for and select a stock or crypto asset to analyze
2. The user should be able to see current price and basic market data for their selected asset
3. The user should be able to view a price chart with technical indicators overlaid
4. The user should be able to receive buy/sell/hold signals with clear explanations
5. The user should be able to understand why a signal was generated (educational component)
6. The user should be able to set up alerts for specific assets or signal types
7. The user should be able to view signal history and track accuracy over time

### Learning & Education Features
8. The user should be able to learn about different technical indicators through tooltips and guides
9. The user should be able to adjust indicator settings and see how it affects signals
10. The user should be able to view beginner-friendly explanations of market concepts
11. The user should be able to practice with paper trading or simulation mode

### Portfolio & Tracking Features
12. The user should be able to create a watchlist of their favorite assets
13. The user should be able to track their trading performance and win rate
14. The user should be able to view their active positions and P&L
15. The user should be able to set risk management rules and position sizing

### Advanced Features
16. The user should be able to receive real-time notifications on mobile/desktop
17. The user should be able to customize their dashboard layout and preferences
18. The user should be able to export their trading data and reports
19. The user should be able to connect with other beginner traders in a community section
20. The user should be able to upgrade from simple signals to detailed multi-indicator analysis

## 🗄️ Data Models

### Core Trading Models
- **Asset**: Stock/crypto symbols with exchange and type information
  - Properties: symbol, name, assetType, exchange, currency, isActive
  - Relationships: has many priceData, indicators, signals, trades

- **PriceData**: Historical OHLCV data with TimescaleDB optimization
  - Properties: open, high, low, close, volume, timestamp, interval
  - Relationships: belongs to asset
  - Indexes: optimized for time-series queries

- **Indicator**: Technical analysis calculations (Bollinger, RSI, MACD, etc.)
  - Properties: indicatorType, period, value, metadata, timestamp
  - Relationships: belongs to asset
  - Supports: Multiple timeframes and custom parameters

- **Signal**: Trading recommendations with confidence scoring
  - Properties: signalType (BUY/SELL/HOLD), strength (0-1), price, metadata
  - Relationships: belongs to asset
  - Tracking: execution status and actual fill prices

### User Management Models (To Be Added)
- **User**: Account management for personalized experience
  - Properties: email, preferences, skillLevel, createdAt
  - Relationships: has many watchlists, trades, alerts

- **UserPreferences**: Dashboard customization and settings
  - Properties: theme, layout, defaultTimeframe, riskTolerance
  - Relationships: belongs to user

### Learning & Tracking Models
- **Watchlist**: Custom asset lists for monitoring
  - Properties: name, description, isPublic
  - Relationships: contains many assets through WatchlistAsset

- **Trade**: Performance tracking for paper and real trades
  - Properties: entryPrice, exitPrice, quantity, pnl, tradeType
  - Relationships: belongs to asset and user

- **Alert**: Customizable notifications for price/signal events
  - Properties: triggerType, conditions, isActive, deliveryMethod
  - Relationships: belongs to user and asset

### Educational Models (To Be Added)
- **LearningContent**: Tutorials and explanations for beginners
  - Properties: title, content, difficulty, category
  - Relationships: can be linked to indicators or concepts

- **UserProgress**: Track learning journey and feature unlocks
  - Properties: completedTutorials, skillLevel, achievements
  - Relationships: belongs to user

### System Models
- **DataSync**: Track data ingestion from various APIs
  - Properties: source, lastSync, status, recordCount
  - Relationships: monitors asset data freshness

## 🎯 MVP Definition

### Core MVP Features (Must Have)
Our MVP focuses on the essential experience: helping beginners understand and learn from trading signals.

**Essential Trading Features:**
1. **Asset Search & Selection** - Search and select popular stocks and crypto assets
2. **Real-Time Market Data** - Display current price, daily change, and volume
3. **Interactive Price Chart** - Clean chart with Bollinger Bands overlay
4. **Simple Signal Generation** - Clear BUY/SELL/HOLD recommendations
5. **Educational Signal Explanations** - Plain English explanations of why signals were generated
6. **Basic Watchlist** - Save and monitor favorite assets
7. **Signal History Tracking** - View past signals to learn patterns and accuracy

**Educational MVP Features:**
- **Beginner-Friendly Tooltips** - Explain what Bollinger Bands are and how they work
- **Confidence Scoring** - Simple High/Medium/Low confidence instead of complex percentages
- **"Why This Signal?" Section** - Educational explanations for each recommendation
- **Learning Progress Indicators** - Track understanding of basic concepts

**Technical MVP Requirements:**
- **Asset Coverage** - Top 50 stocks (S&P 500) + Top 20 cryptocurrencies
- **Data Refresh** - 15-minute delayed data (sufficient for learning)
- **Timeframes** - Daily charts only (simpler for beginners)
- **Single Indicator** - Bollinger Bands only (avoid overwhelming users)

### Out of MVP Scope (Phase 2+)
**Deferred Features:**
- Real-time alerts and notifications
- Multiple technical indicators (RSI, MACD, etc.)
- Paper trading simulation
- Performance tracking and P&L analysis
- Advanced customization options
- Mobile app and push notifications
- Community features and social trading
- Multi-timeframe analysis
- Advanced risk management tools
- Data export and reporting

**MVP Success Criteria:**
- Users can find and analyze their first stock/crypto within 2 minutes
- 90%+ of users understand what a signal means after first explanation
- Users can successfully interpret 5+ signals independently
- Average session time >10 minutes (indicating engagement with learning content)

## 🚀 Future Vision & Scalability

### Project Evolution Path
**Phase 1: Hobby Project (0-6 months)**
- Personal learning and portfolio showcase
- 10-50 users (friends, family, early feedback)
- Free hosting (Vercel/Railway) + free API tiers
- Focus on core functionality and user experience

**Phase 2: Community Growth (6-18 months)**
- Open source community building
- 100-500 active users
- Potential freemium model exploration
- Enhanced educational content and features

**Phase 3: Monetization Potential (18+ months)**
- Premium features (real-time data, advanced indicators)
- Subscription tiers for serious traders
- API partnerships and affiliate revenue
- 1,000+ active users

### Technical Scalability Decisions

**Current Architecture (Supports up to 1K users):**
- Next.js + PostgreSQL/TimescaleDB + Redis
- Docker deployment ready for cloud platforms
- API rate limits handled with caching strategies
- Educational focus keeps data requirements moderate

**Growth-Ready Decisions Already Made:**
- **TimescaleDB**: Handles millions of price data points efficiently
- **Redis Caching**: Reduces API calls and improves performance
- **Docker**: Easy deployment scaling across cloud providers
- **API Abstraction**: Can add multiple data providers without code changes

**Future Scaling Triggers:**
- **100+ users**: Upgrade to paid API tiers (~$50-100/month)
- **500+ users**: Add CDN and database read replicas
- **1K+ users**: Implement user authentication and rate limiting
- **5K+ users**: Microservices architecture and dedicated infrastructure

### Monetization Readiness
**Free Tier (Always Available):**
- 15-minute delayed data
- Basic Bollinger Bands signals
- Limited watchlist (5 assets)
- Educational content access

**Premium Features (Future):**
- Real-time data feeds
- Multiple technical indicators
- Unlimited watchlists and alerts
- Advanced backtesting tools
- Priority support and exclusive content

**Revenue Streams (Potential):**
- Subscription tiers ($9.99-$49.99/month)
- Educational course sales
- Affiliate partnerships with brokers
- Premium data provider partnerships

## 🧩 Component Breakdown

### Frontend Components (React/Next.js)

**Layout Components:**
- `Header` - Navigation, search bar, theme toggle
- `Sidebar` - Quick access to watchlist and recent signals
- `Footer` - Links, status indicators, help

**Dashboard Components:**
- `AssetSearch` - Search/select stocks and crypto with autocomplete
- `MarketDataCard` - Current price, daily change, volume display
- `PriceChart` - Chart.js integration with Bollinger Bands overlay
- `SignalPanel` - Current BUY/SELL/HOLD recommendation with confidence
- `SignalExplanation` - Educational "Why this signal?" content
- `WatchlistWidget` - Quick asset monitoring and management

**Educational Components:**
- `TooltipHelper` - Contextual help for trading terms
- `IndicatorExplainer` - Interactive Bollinger Bands tutorial
- `SignalHistory` - Past signals with learning annotations
- `ProgressTracker` - User understanding and engagement metrics

**Settings & Preferences:**
- `SettingsPanel` - Basic preferences and timeframe selection
- `AboutModal` - Project information and educational resources

### Backend Components (API Routes)

**Data Management APIs:**
- `/api/assets` - Asset search, details, and metadata
- `/api/price-data` - Historical and current OHLCV data
- `/api/indicators` - Bollinger Bands calculations
- `/api/signals` - Trading signal generation and history

**User Features APIs:**
- `/api/watchlist` - Watchlist CRUD operations
- `/api/user-preferences` - Settings and customization
- `/api/learning-progress` - Track educational engagement

**System APIs:**
- `/api/health` - System status and data freshness
- `/api/data-sync` - Background data ingestion status

### Core Business Logic

**Data Processing Services:**
- `PriceDataService` - Fetch and normalize market data
- `IndicatorCalculator` - Bollinger Bands and technical analysis
- `SignalGenerator` - Trading recommendations with confidence scoring
- `EducationalContentService` - Context-aware explanations

**Integration Services:**
- `AlphaVantageClient` - Stock data integration
- `CryptoDataClient` - Cryptocurrency price feeds
- `CacheManager` - Redis-based performance optimization
- `DataSyncService` - Background data updates

### Database Schema (Existing + Additions)

**Current Models (Already Implemented):**
- Asset, PriceData, Indicator, Signal, Trade, Watchlist

**Missing MVP Models:**
- `User` - Basic user preferences and progress tracking
- `UserPreferences` - Dashboard customization
- `LearningProgress` - Educational milestone tracking
- `SignalFeedback` - User ratings for signal accuracy (learning tool)

### External Integrations

**Data Providers:**
- Alpha Vantage API (stocks)
- CoinGecko API (crypto)
- Yahoo Finance (backup/historical)

**Development Tools:**
- Chart.js for interactive charts
- React Query for data fetching
- Prisma for database operations
- Redis for caching and real-time features

## ✅ Tech Stack Validation

### Frontend Stack Analysis
**Next.js 15 with App Router** ✅ **Perfect Choice**
- Server-side rendering for SEO (important for educational content)
- Built-in API routes eliminate need for separate backend
- App Router provides modern React features
- Turbopack for fast development builds

**React 19 + TypeScript** ✅ **Excellent**
- Latest React features for optimal user experience
- TypeScript prevents bugs in complex trading calculations
- Strong ecosystem for financial applications

**Tailwind CSS v4** ✅ **Great for MVP**
- Rapid prototyping and consistent design
- Small bundle size for performance
- Easy customization as project grows

**Chart.js + React-ChartJS-2** ✅ **Solid Choice**
- Mature library with excellent financial chart support
- Lighter than complex trading chart libraries for MVP
- Can upgrade to TradingView or similar later

**React Query** ✅ **Perfect for Trading Data**
- Built-in caching reduces API calls
- Background refetching keeps data fresh
- Optimistic updates for watchlists

### Backend Stack Analysis
**PostgreSQL + TimescaleDB** ✅ **Excellent Long-term**
- TimescaleDB specifically designed for time-series data
- Handles millions of price points efficiently
- ACID compliance for financial data integrity
- Scales to production loads

**Redis** ✅ **Essential for Performance**
- API response caching reduces external API costs
- Real-time signal notifications ready
- Session management for future user features

**Prisma ORM** ✅ **Great Developer Experience**
- Type-safe database queries prevent runtime errors
- Automatic migrations and schema management
- Built-in connection pooling

### State Management & Forms
**Zustand** ✅ **Perfect for MVP**
- Simpler than Redux for current scope
- Easy to refactor to more complex solutions later
- Great for watchlist and user preferences

**React Hook Form + Zod** ✅ **Robust Validation**
- Excellent form performance for search/settings
- Zod provides runtime type validation for API data

### Missing Dependencies (Recommended Additions)
```json
{
  "clsx": "^2.0.0",           // Conditional CSS classes
  "class-variance-authority": "^0.7.0", // Component variants
  "@radix-ui/react-*": "...", // Accessible UI components
  "sonner": "^1.3.1",         // Toast notifications for signals
  "cmdk": "^0.2.0"            // Command palette for asset search
}
```

### Deployment Stack
**Docker + Docker Compose** ✅ **Production Ready**
- Consistent development and production environments
- Easy scaling across cloud providers
- Database and Redis bundled for development

**Recommended Hosting Path:**
1. **MVP**: Vercel (frontend) + Railway/Supabase (database)
2. **Growth**: Digital Ocean App Platform or AWS
3. **Scale**: Kubernetes with managed databases

### API Strategy Validation
**Current Approach** ✅ **Cost-Effective Start**
- Alpha Vantage free tier (500 calls/day)
- 15-minute delayed data acceptable for learning
- Caching extends API limits significantly

**Future API Evolution:**
- Add Polygon.io for real-time data (premium features)
- Multiple providers for redundancy
- WebSocket connections for live updates

## 🚀 Development Process & Deployment Strategy

### Development Workflow

**Phase 1: MVP Foundation (Weeks 1-4)**
1. **Week 1**: Core infrastructure and API endpoints
   - Set up database models (User, UserPreferences) 
   - Create `/api/assets` and `/api/price-data` endpoints
   - Basic data seeding and API integration

2. **Week 2**: Essential UI components
   - `AssetSearch` with autocomplete
   - `MarketDataCard` with real price data
   - `PriceChart` with Bollinger Bands overlay

3. **Week 3**: Signal generation and education
   - `SignalPanel` with BUY/SELL/HOLD logic
   - `SignalExplanation` educational content
   - `IndicatorExplainer` tooltips and guides

4. **Week 4**: Watchlist and history
   - `WatchlistWidget` CRUD operations
   - `SignalHistory` with learning annotations
   - MVP testing and refinement

**Phase 2: Enhanced Learning (Weeks 5-8)**
- User progress tracking
- Advanced educational content
- Performance optimizations
- User feedback collection

**Phase 3: Community & Growth (Weeks 9-12)**
- User authentication
- Social features foundation
- Real-time notifications
- Analytics and metrics

### Development Standards

**Code Organization:**
```
src/
├── app/                 # Next.js pages and API routes
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs)
│   ├── dashboard/      # Trading-specific components
│   ├── educational/    # Learning and tutorial components
│   └── layout/         # Navigation and structure
├── lib/                # Business logic and utilities
│   ├── api/           # External API clients
│   ├── calculations/  # Technical analysis algorithms  
│   ├── db/            # Database utilities
│   └── validators/    # Zod schemas and validation
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
└── types/              # TypeScript type definitions
```

**Development Practices:**
- **Git Flow**: Feature branches with descriptive names (`feature/signal-explanations`)
- **Code Reviews**: All changes reviewed before merge
- **Testing**: Component tests for critical trading logic
- **Documentation**: JSDoc comments for complex calculations
- **Type Safety**: Strict TypeScript configuration

### Testing Strategy

**Automated Testing:**
- **Unit Tests**: Trading calculations and signal generation
- **Integration Tests**: API endpoints and database operations
- **Component Tests**: Critical UI components (charts, signals)
- **E2E Tests**: Core user journeys (search → analyze → watchlist)

**Manual Testing:**
- **Signal Accuracy**: Verify Bollinger Band calculations against known values
- **Educational Content**: Test explanations with actual beginners
- **Performance**: Monitor API response times and chart rendering
- **Cross-browser**: Ensure compatibility across major browsers

### Deployment Strategy

**Environment Setup:**
- **Development**: Local Docker Compose with hot reload
- **Staging**: Railway/Render with production data samples  
- **Production**: Vercel (frontend) + Railway (database) or full Docker deployment

**CI/CD Pipeline:**
```yaml
# GitHub Actions workflow
1. Code push triggers build
2. Run TypeScript checks and tests
3. Build Docker images
4. Deploy to staging environment  
5. Run smoke tests
6. Manual approval for production
7. Deploy to production with rollback capability
```

**Database Migration Strategy:**
- **Development**: Prisma db push for rapid iteration
- **Production**: Prisma migrations with backup procedures
- **Data Seeding**: Automated seeding of popular stocks and crypto assets

**Monitoring & Observability:**
- **Application**: Error tracking with built-in Next.js analytics
- **Database**: Connection pool monitoring and query performance
- **External APIs**: Rate limit monitoring and failure alerts
- **User Analytics**: Basic usage metrics without personal data collection

### Launch & Iteration Plan

**MVP Launch Checklist:**
- [ ] Core functionality tested with 5+ beta users
- [ ] Educational content reviewed by trading beginners
- [ ] Performance benchmarks met (<2s page loads)
- [ ] Database backup and recovery procedures tested
- [ ] API rate limiting and error handling verified

**Post-Launch Iteration:**
- **Week 1-2**: Bug fixes and immediate user feedback
- **Week 3-4**: Performance optimizations based on real usage
- **Month 2**: First feature additions based on user requests
- **Month 3**: Analytics review and roadmap adjustment

**Success Metrics:**
- **Engagement**: >70% of users analyze 3+ assets in first session
- **Learning**: >50% of users click educational explanations
- **Retention**: >30% of users return within 7 days
- **Performance**: <2s average page load time
- **Reliability**: >99% uptime for core functionality

## 🚀 Features

- **Multi-Asset Support**: Stocks, Crypto, Forex, and Commodities
- **Real-time Data**: Live price feeds with WebSocket support
- **Technical Analysis**: Bollinger Bands, SMA, EMA, RSI, MACD
- **Signal Generation**: Automated buy/sell signals with confidence scoring
- **Interactive Charts**: Responsive charts with Chart.js
- **Performance Optimization**: Redis caching and TimescaleDB for time-series data
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   PostgreSQL    │    │     Redis       │
│                 │    │  + TimescaleDB  │    │                 │
│  - App Router   │◄──►│                 │    │  - Caching      │
│  - API Routes   │    │  - Price Data   │    │  - Sessions     │
│  - Components   │    │  - Indicators   │    │  - Real-time    │
│  - Charts       │    │  - Signals      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts
- **React Query** - Data fetching and caching
- **Lucide React** - Beautiful icons

### Backend
- **PostgreSQL** - Primary database
- **TimescaleDB** - Time-series extension
- **Redis** - Caching and real-time features
- **Prisma** - Database ORM
- **Node.js** - Runtime environment

### Data Sources
- **Alpha Vantage** - Stock and Forex data
- **Yahoo Finance** - Historical data
- **CoinGecko** - Cryptocurrency data
- **Binance API** - Real-time crypto data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd trade-signals
cp env.example .env.local
```

### 2. Configure Environment Variables
Edit `.env.local` with your API keys:
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trade_signals"
REDIS_URL="redis://:redis_password@localhost:6379"

# API Keys
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_api_key_here"
RAPIDAPI_KEY="your_rapidapi_key_here"
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

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
trade-signals/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── AssetSelector.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   ├── SignalPanel.tsx
│   │   │   ├── StatsPanel.tsx
│   │   │   └── SettingsPanel.tsx
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   └── lib/                   # Core utilities
│       ├── db/                # Database connection
│       └── redis/             # Redis connection
├── prisma/                    # Database schema
├── scripts/                   # Utility scripts
├── docker-compose.yml         # Docker services
└── package.json              # Dependencies
```

## 🔧 API Endpoints

### Data
- `GET /api/data` - Get price data, indicators, and signals
- `GET /api/assets` - Get asset information
- `POST /api/assets` - Create new asset

### Signals
- `GET /api/signals` - Get trading signals
- `POST /api/signals` - Create new signal

### Indicators
- `GET /api/indicators/bollinger` - Get Bollinger Bands data
- `POST /api/indicators/bollinger` - Calculate Bollinger Bands

### Health
- `GET /api/health` - System health check

## 📊 Usage

### 1. Select Asset
Choose from stocks, crypto, forex, or commodities using the asset selector.

### 2. Configure Settings
Adjust Bollinger Bands parameters:
- Period (default: 20)
- Standard Deviation Multiplier (default: 2)
- Timeframe (1D, 1W, 1M, 3M, 6M, 1Y)

### 3. View Analysis
- **Price Chart**: Interactive chart with Bollinger Bands
- **Signals**: Buy/sell signals with confidence scores
- **Stats**: Market statistics and technical indicators

### 4. Monitor Performance
Track signal accuracy and portfolio performance over time.

## 🎯 Trading Signals

### Bollinger Bands Strategy
- **Buy Signal**: Price touches or goes below lower band
- **Sell Signal**: Price touches or goes above upper band
- **Hold Signal**: Price consolidating within bands

### Signal Strength
- **0.8-1.0**: Strong signal
- **0.6-0.8**: Moderate signal
- **0.4-0.6**: Weak signal
- **0.0-0.4**: Very weak signal

## 🔍 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Database Commands
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### Docker Commands
```bash
npm run docker:up     # Start services
npm run docker:down   # Stop services
npm run docker:logs   # View logs
```

## 📈 Performance

### Caching Strategy
- **Price Data**: 1 hour TTL
- **Indicators**: 1 hour TTL
- **Signals**: 1 hour TTL
- **Real-time Data**: 1 minute TTL

### Database Optimization
- **TimescaleDB**: Automatic partitioning by time
- **Compression**: Older data compressed automatically
- **Retention**: Automatic cleanup of old data
- **Indexes**: Optimized for time-series queries

## 🔒 Security

- Environment variables for sensitive data
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection prevention with Prisma

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
ALPHA_VANTAGE_API_KEY=your_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the [troubleshooting guide](SETUP.md#troubleshooting)
2. Review application logs
3. Check database and Redis health
4. Create an issue in the repository

## 🔮 Roadmap

- [ ] Real-time WebSocket connections
- [ ] Advanced technical indicators
- [ ] Portfolio management
- [ ] Backtesting engine
- [ ] Mobile app
- [ ] Social trading features
- [ ] AI-powered signal generation

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.