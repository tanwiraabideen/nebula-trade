'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import Image from 'next/image';
import { getCoinData } from '../actions/actions';

export default function CryptoChart({ coin }) {
    const [chartData, setChartData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(coin.price)

    useEffect(() => {
        if (coin) {
            setChartData(createChart());
        }
    }, [coin]);

    useEffect(() => {
        const fetchCurrentPrice = async () => {
            const token = await getCoinData(coin.id)
            const newPrice = token.price
            if (newPrice !== currentPrice) {
                console.log('price updated')
                setCurrentPrice(newPrice)
            }
        }
        fetchCurrentPrice()

        const intervalId = setInterval(fetchCurrentPrice, 60000);

        // Cleanup function
        return () => clearInterval(intervalId)
    }, [])

    function createChart() {
        const currentPrice = coin.price;
        const calculatePrice = (changePercentage) => currentPrice / (1 + changePercentage / 100);

        return [
            { time: '30d', price: calculatePrice(coin.priceChange30d) },
            { time: '7d', price: calculatePrice(coin.priceChange7d) },
            { time: '24h', price: calculatePrice(coin.priceChangePercentage24h) },
            { time: '1h', price: calculatePrice(coin.priceChange1h) },
            { time: 'Now', price: currentPrice },
        ].filter(item => item.price !== 0);
    }

    const isPriceUp = coin.priceChangePercentage24h > 0;
    const lineColor = isPriceUp ? "#22c55e" : "#ef4444";

    const formatYAxis = (value) => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
        }
        return `$${value.toFixed(0)}`;
    };

    const isPriceUp2 = coin.priceChangePercentage24h > 0;

    return (
        <div className="w-full max-w-2xl bg-[#0d0d2b] border border-purple-900/40 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-row items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#12123a] border border-purple-900/30">
                        <Image src={coin.icon} width={36} height={36} alt={coin.name} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg">{coin.name}</h2>
                        <p className="text-slate-500 text-xs">{coin.symbol?.toUpperCase()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">${currentPrice.toLocaleString()}</div>
                    <div className={`text-sm font-medium mt-0.5 ${isPriceUp2 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPriceUp2 ? '+' : ''}{coin.priceChangePercentage24h.toFixed(2)}% (24h)
                    </div>
                </div>
            </div>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis
                            dataKey="time"
                            stroke="#4c1d95"
                            axisLine={{ stroke: '#4c1d95' }}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#4c1d95"
                            axisLine={{ stroke: '#4c1d95' }}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                            domain={['dataMin', 'dataMax']}
                            allowDataOverflow={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke={lineColor}
                            dot={false}
                            strokeWidth={2.5}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}