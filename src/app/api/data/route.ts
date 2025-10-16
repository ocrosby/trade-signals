import { prisma } from '@/lib/db/connection';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');
        const assetType = searchParams.get('assetType');
        const timeframe = searchParams.get('timeframe') || '1D';
        const limit = parseInt(searchParams.get('limit') || '100');

        if (!symbol || !assetType) {
            return NextResponse.json(
                { error: 'Symbol and assetType are required' },
                { status: 400 }
            );
        }

        // Get asset from database
        const asset = await prisma.asset.findUnique({
            where: { symbol },
        });

        if (!asset) {
            return NextResponse.json(
                { error: 'Asset not found' },
                { status: 404 }
            );
        }

        // Calculate date range based on timeframe
        const now = new Date();
        let startDate = new Date();

        switch (timeframe) {
            case '1D':
                startDate.setDate(now.getDate() - 1);
                break;
            case '1W':
                startDate.setDate(now.getDate() - 7);
                break;
            case '1M':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6M':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        // Get price data
        const priceData = await prisma.priceData.findMany({
            where: {
                symbol,
                timestamp: {
                    gte: startDate,
                },
            },
            orderBy: {
                timestamp: 'asc',
            },
            take: limit,
        });

        // Get indicators
        const indicators = await prisma.indicator.findMany({
            where: {
                symbol,
                timestamp: {
                    gte: startDate,
                },
            },
            orderBy: {
                timestamp: 'asc',
            },
        });

        // Get signals
        const signals = await prisma.signal.findMany({
            where: {
                symbol,
                timestamp: {
                    gte: startDate,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: 10,
        });

        return NextResponse.json({
            asset,
            priceData,
            indicators,
            signals,
            timeframe,
            count: priceData.length,
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

