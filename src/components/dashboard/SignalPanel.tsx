'use client';

import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Signal {
    id: string;
    type: 'BUY' | 'SELL' | 'HOLD';
    strength: number;
    price: number;
    timestamp: string;
    confidence: number;
    reason: string;
}

interface SignalPanelProps {
    symbol: string;
    assetType: string;
}

export function SignalPanel({ symbol, assetType }: SignalPanelProps) {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data for demonstration
    useEffect(() => {
        const generateMockSignals = (): Signal[] => {
            const mockSignals: Signal[] = [
                {
                    id: '1',
                    type: 'BUY',
                    strength: 0.85,
                    price: 152.34,
                    timestamp: new Date().toISOString(),
                    confidence: 0.78,
                    reason: 'Price touched lower Bollinger Band with strong volume',
                },
                {
                    id: '2',
                    type: 'HOLD',
                    strength: 0.45,
                    price: 151.89,
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    confidence: 0.62,
                    reason: 'Price consolidating within Bollinger Bands',
                },
                {
                    id: '3',
                    type: 'SELL',
                    strength: 0.72,
                    price: 154.12,
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    confidence: 0.69,
                    reason: 'Price broke above upper Bollinger Band',
                },
            ];
            return mockSignals;
        };

        setTimeout(() => {
            setSignals(generateMockSignals());
            setIsLoading(false);
        }, 1000);
    }, [symbol]);

    const currentSignal = signals[0];

    const getSignalIcon = (type: string) => {
        switch (type) {
            case 'BUY':
                return <TrendingUp className="h-5 w-5" />;
            case 'SELL':
                return <TrendingDown className="h-5 w-5" />;
            default:
                return <AlertCircle className="h-5 w-5" />;
        }
    };

    const getSignalColor = (type: string) => {
        switch (type) {
            case 'BUY':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            case 'SELL':
                return 'text-red-600 bg-red-100 dark:bg-red-900/20';
            default:
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
        }
    };

    const getStrengthColor = (strength: number) => {
        if (strength >= 0.8) return 'text-green-600';
        if (strength >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (isLoading) {
        return (
            <div className="card">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Trading Signals
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {symbol}
                </div>
            </div>

            {/* Current Signal */}
            {currentSignal && (
                <div className="mb-6">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Current Signal
                    </div>
                    <div className={`p-4 rounded-lg border ${getSignalColor(currentSignal.type)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                {getSignalIcon(currentSignal.type)}
                                <span className="font-semibold text-lg">{currentSignal.type}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium">
                                    ${currentSignal.price.toFixed(2)}
                                </div>
                                <div className="text-xs">
                                    {new Date(currentSignal.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Strength:</span>
                                <span className={`text-sm font-medium ${getStrengthColor(currentSignal.strength)}`}>
                                    {(currentSignal.strength * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Confidence:</span>
                                <span className="text-sm font-medium">
                                    {(currentSignal.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                            {currentSignal.reason}
                        </div>
                    </div>
                </div>
            )}

            {/* Signal History */}
            <div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Recent Signals
                </div>
                <div className="space-y-3">
                    {signals.slice(1).map((signal) => (
                        <div
                            key={signal.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-1 rounded ${getSignalColor(signal.type)}`}>
                                    {getSignalIcon(signal.type)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {signal.type}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        ${signal.price.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-medium ${getStrengthColor(signal.strength)}`}>
                                    {(signal.strength * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(signal.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Signal Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-green-600">
                            {signals.filter(s => s.type === 'BUY').length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Buy Signals</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-red-600">
                            {signals.filter(s => s.type === 'SELL').length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Sell Signals</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

