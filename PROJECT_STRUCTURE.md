# Trade Signals Project Structure

## Recommended Project Structure

```
trade-signals/
├── README.md
├── package.json
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── docker-compose.yml
├── Dockerfile
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app/                    # Next.js 14+ App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   ├── data/
│   │   │   │   ├── route.ts
│   │   │   │   ├── symbols/route.ts
│   │   │   │   └── historical/route.ts
│   │   │   ├── signals/
│   │   │   │   ├── route.ts
│   │   │   │   ├── generate/route.ts
│   │   │   │   └── history/route.ts
│   │   │   ├── indicators/
│   │   │   │   ├── bollinger/route.ts
│   │   │   │   ├── sma/route.ts
│   │   │   │   └── rsi/route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   └── symbols/
│   │       ├── [symbol]/
│   │       │   ├── page.tsx
│   │       │   └── loading.tsx
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── charts/             # Chart components
│   │   │   ├── PriceChart.tsx
│   │   │   ├── BollingerChart.tsx
│   │   │   ├── VolumeChart.tsx
│   │   │   └── SignalChart.tsx
│   │   │
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── AssetSelector.tsx
│   │   │   ├── SignalPanel.tsx
│   │   │   ├── StatsPanel.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── Watchlist.tsx
│   │   │
│   │   ├── forms/              # Form components
│   │   │   ├── TradingForm.tsx
│   │   │   ├── SettingsForm.tsx
│   │   │   └── AlertForm.tsx
│   │   │
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Footer.tsx
│   │       └── Navigation.tsx
│   │
│   ├── lib/                    # Core utilities
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   ├── queries.ts
│   │   │   └── migrations.ts
│   │   │
│   │   ├── redis/
│   │   │   ├── connection.ts
│   │   │   ├── cache.ts
│   │   │   └── pubsub.ts
│   │   │
│   │   ├── data/
│   │   │   ├── providers/
│   │   │   │   ├── base.ts
│   │   │   │   ├── yahoo-finance.ts
│   │   │   │   ├── alpha-vantage.ts
│   │   │   │   ├── coingecko.ts
│   │   │   │   └── binance.ts
│   │   │   ├── fetcher.ts
│   │   │   ├── normalizer.ts
│   │   │   └── manager.ts
│   │   │
│   │   ├── indicators/
│   │   │   ├── bollinger-bands.ts
│   │   │   ├── sma.ts
│   │   │   ├── ema.ts
│   │   │   ├── rsi.ts
│   │   │   ├── macd.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── signals/
│   │   │   ├── generator.ts
│   │   │   ├── validator.ts
│   │   │   ├── backtester.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── math.ts
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── types/
│   │       ├── api.ts
│   │       ├── data.ts
│   │       ├── signals.ts
│   │       └── index.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── usePriceData.ts
│   │   ├── useSignals.ts
│   │   ├── useWebSocket.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/                  # State management
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── dataSlice.ts
│   │   │   ├── signalsSlice.ts
│   │   │   ├── settingsSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── middleware.ts
│   │
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── utilities.css
│
├── scripts/                    # Utility scripts
│   ├── seed-db.ts
│   ├── backfill-data.ts
│   ├── calculate-indicators.ts
│   └── generate-signals.ts
│
├── tests/                      # Test files
│   ├── __mocks__/
│   ├── components/
│   ├── lib/
│   ├── api/
│   └── setup.ts
│
├── docs/                       # Documentation
│   ├── api.md
│   ├── database.md
│   ├── deployment.md
│   └── development.md
│
└── public/                     # Static assets
    ├── images/
    ├── icons/
    └── favicon.ico
```

## Key Features of This Structure

### 1. **Scalable Architecture**
- App Router for Next.js 14+
- TypeScript throughout
- Modular component organization
- Clear separation of concerns

### 2. **Database Integration**
- Prisma ORM for type-safe database access
- PostgreSQL with TimescaleDB for time-series data
- Redis for caching and real-time features

### 3. **Data Management**
- Multiple data provider support
- Unified data normalization
- Caching strategy with Redis
- Background data processing

### 4. **Performance Optimization**
- Server-side rendering where appropriate
- Client-side caching with React Query
- WebSocket support for real-time data
- Optimized database queries

### 5. **Development Experience**
- Hot reload with Next.js
- TypeScript for type safety
- ESLint and Prettier for code quality
- Docker for consistent environments
