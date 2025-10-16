'use client';

import { Activity, BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsPanelProps {
    symbol: string;
    assetType: string;
}

export function StatsPanel({ symbol, assetType }: StatsPanelProps) {
    const [stats, setStats] = useState({
        volatility: 0,
        volume: 0,
        priceChange24h: 0,
        priceChangePercent24h: 0,
        high24h: 0,
        low24h: 0,
        marketCap: 0,
        avgVolume: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data generation
        const generateMockStats = () => {
            const basePrice = 150;
            const volatility = 2.5 + Math.random() * 3;
            const volume = 1000000 + Math.random() * 5000000;
            const priceChange24h = (Math.random() - 0.5) * 10;
            const priceChangePercent24h = (priceChange24h / basePrice) * 100;

            setStats({
                volatility: volatility,
                volume: volume,
                priceChange24h: priceChange24h,
                priceChangePercent24h: priceChangePercent24h,
                high24h: basePrice + Math.random() * 5,
                low24h: basePrice - Math.random() * 5,
                marketCap: 2500000000000 + Math.random() * 500000000000,
                avgVolume: volume * (0.8 + Math.random() * 0.4),
            });
            setIsLoading(false);
        };

        generateMockStats();
    }, [symbol]);

    const formatNumber = (num: number, decimals: number = 2) => {
        if (num >= 1e12) return (num / 1e12).toFixed(decimals) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
        return num.toFixed(decimals);
    };

    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Market Stats
                </h3>
                <BarChart3 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="space-y-4">
                {/* Price Change 24h */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">24h Change</span>
                    <div className={`flex items-center space-x-1 ${stats.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {stats.priceChange24h >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                            {stats.priceChange24h >= 0 ? '+' : ''}${stats.priceChange24h.toFixed(2)} ({stats.priceChangePercent24h.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                {/* High/Low 24h */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">24h High</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            ${stats.high24h.toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">24h Low</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            ${stats.low24h.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Volume */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Volume</span>
                    <div className="flex items-center space-x-1">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatNumber(stats.volume)}
                        </span>
                    </div>
                </div>

                {/* Avg Volume */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Volume</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(stats.avgVolume)}
                    </span>
                </div>

                {/* Volatility */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {stats.volatility.toFixed(2)}%
                    </span>
                </div>

                {/* Market Cap */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
                    <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            ${formatNumber(stats.marketCap)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Technical Indicators Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Technical Indicators
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">RSI (14)</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {(45 + Math.random() * 20).toFixed(1)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">MACD</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {(0.5 + Math.random() * 2).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">SMA (50)</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            ${(150 + Math.random() * 10).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">EMA (20)</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            ${(148 + Math.random() * 8).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

