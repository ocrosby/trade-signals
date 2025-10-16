import { prisma } from '@/lib/db/connection';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');

        const whereClause: any = {
            isActive: true,
        };

        if (type) {
            whereClause.assetType = type.toUpperCase();
        }

        if (search) {
            whereClause.OR = [
                { symbol: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const assets = await prisma.asset.findMany({
            where: whereClause,
            orderBy: [
                { assetType: 'asc' },
                { symbol: 'asc' },
            ],
            take: limit,
        });

        // Get asset counts by type
        const assetCounts = await prisma.asset.groupBy({
            by: ['assetType'],
            _count: {
                assetType: true,
            },
            where: {
                isActive: true,
            },
        });

        return NextResponse.json({
            assets,
            counts: assetCounts,
            total: assets.length,
        });

    } catch (error) {
        console.error('Error fetching assets:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { symbol, name, assetType, exchange, currency } = body;

        if (!symbol || !name || !assetType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if asset already exists
        const existingAsset = await prisma.asset.findUnique({
            where: { symbol },
        });

        if (existingAsset) {
            return NextResponse.json(
                { error: 'Asset already exists' },
                { status: 409 }
            );
        }

        // Create asset
        const asset = await prisma.asset.create({
            data: {
                symbol,
                name,
                assetType: assetType.toUpperCase(),
                exchange,
                currency: currency || 'USD',
            },
        });

        return NextResponse.json(asset, { status: 201 });

    } catch (error) {
        console.error('Error creating asset:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

