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

    return (
        <Card className="w-1/2 bg-[#0f172a] text-white p-4">
            <div className='flex flex-row items-center mb-5 my-2'>
                <div id="icon" className="size-fit p-2 rounded-lg bg-slate-800 mr-3">
                    <Image src={coin.icon} width={40} height={40}></Image>
                </div>
                <h2 className="text-xl font-bold mb-2">{coin.name}</h2>
            </div>

            <div className="flex items-center mb-7">
                <span className="text-2xl font-bold mr-2">
                    ${currentPrice.toLocaleString()}
                </span>
                <span className={`text-sm ${coin.priceChangePercentage24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.priceChangePercentage24h.toFixed(2)}%
                </span>
            </div>
            <CardContent className="p-0">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                axisLine={{ stroke: '#888888' }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                axisLine={{ stroke: '#888888' }}
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
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}