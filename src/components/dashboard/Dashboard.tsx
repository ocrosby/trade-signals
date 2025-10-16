'use client';

import { useState } from 'react';
import { AssetSelector } from './AssetSelector';
import { PriceChart } from './PriceChart';
import { SettingsPanel } from './SettingsPanel';
import { SignalPanel } from './SignalPanel';
import { StatsPanel } from './StatsPanel';

export function Dashboard() {
    const [selectedAsset, setSelectedAsset] = useState('AAPL');
    const [selectedType, setSelectedType] = useState('stocks');

    const handleAssetSelect = (symbol: string, type: string) => {
        setSelectedAsset(symbol);
        setSelectedType(type);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Trading Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Analyze {selectedAsset} with Bollinger Bands and technical indicators
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="badge badge-info">{selectedType.toUpperCase()}</span>
                    <span className="badge badge-success">{selectedAsset}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <AssetSelector
                        onAssetSelect={handleAssetSelect}
                        selectedAsset={selectedAsset}
                        selectedType={selectedType}
                    />
                    <SettingsPanel />
                </div>

                {/* Main Chart Area */}
                <div className="lg:col-span-2">
                    <PriceChart
                        symbol={selectedAsset}
                        assetType={selectedType}
                    />
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <SignalPanel
                        symbol={selectedAsset}
                        assetType={selectedType}
                    />
                    <StatsPanel
                        symbol={selectedAsset}
                        assetType={selectedType}
                    />
                </div>
            </div>

            {/* Bottom Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Signals
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                1,247
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Active Signals
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                23
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Accuracy Rate
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                87.3%
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total P&L
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                +$12,847
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

