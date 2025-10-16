import { prisma } from '@/lib/db/connection';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '10');

        const whereClause: any = {};

        if (symbol) {
            whereClause.symbol = symbol;
        }

        if (type) {
            whereClause.signalType = type;
        }

        const signals = await prisma.signal.findMany({
            where: whereClause,
            orderBy: {
                timestamp: 'desc',
            },
            take: limit,
            include: {
                asset: true,
            },
        });

        // Get signal statistics
        const stats = await prisma.signal.groupBy({
            by: ['signalType'],
            _count: {
                signalType: true,
            },
            where: symbol ? { symbol } : {},
        });

        const totalSignals = await prisma.signal.count({
            where: symbol ? { symbol } : {},
        });

        const recentSignals = await prisma.signal.count({
            where: {
                ...(symbol ? { symbol } : {}),
                timestamp: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
            },
        });

        return NextResponse.json({
            signals,
            stats: {
                total: totalSignals,
                recent: recentSignals,
                byType: stats,
            },
        });

    } catch (error) {
        console.error('Error fetching signals:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { symbol, signalType, strength, price, confidence, metadata } = body;

        if (!symbol || !signalType || !strength || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get asset
        const asset = await prisma.asset.findUnique({
            where: { symbol },
        });

        if (!asset) {
            return NextResponse.json(
                { error: 'Asset not found' },
                { status: 404 }
            );
        }

        // Create signal
        const signal = await prisma.signal.create({
            data: {
                assetId: asset.id,
                symbol,
                timestamp: new Date(),
                signalType,
                strength,
                price,
                confidence: confidence || 0.5,
                metadata: metadata || {},
            },
            include: {
                asset: true,
            },
        });

        return NextResponse.json(signal, { status: 201 });

    } catch (error) {
        console.error('Error creating signal:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

