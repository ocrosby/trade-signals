# Claude Development Notes

This file contains important information for Claude to help with this project.

## Project Overview
Trade Signals is a beginner-focused trading platform for day/swing traders learning technical analysis with stocks and crypto. The project targets educational signal generation using Bollinger Bands with clear explanations.

## Development Commands

### Linting & Type Checking
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Database Management
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database

### Docker Operations
- `npm run docker:up` - Start all services
- `npm run docker:down` - Stop all services
- `npm run docker:logs` - View logs

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests

## Project Status
- ✅ Project vision and planning complete
- ✅ 20 user stories defined
- ✅ Data models documented  
- ✅ MVP scope established
- ✅ Tech stack validated
- ✅ Development roadmap created
- 🔄 Ready to begin implementation

## Key Implementation Notes
- Focus on MVP: Asset search, Bollinger Bands signals, educational explanations, basic watchlist
- Target users: Beginners learning technical analysis
- Educational focus: Always explain "why" behind signals
- Tech stack: Next.js 15, PostgreSQL/TimescaleDB, Redis, TypeScript
- Database schema already defined in prisma/schema.prisma

## Next Steps
Start with Week 1 of development roadmap:
1. Set up missing database models (User, UserPreferences)
2. Create core API endpoints (/api/assets, /api/price-data)
3. Implement basic data seeding and API integration