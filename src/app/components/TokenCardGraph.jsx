"use client"

import { LineChart, Line, XAxis, ResponsiveContainer } from 'recharts';

const timeOrder = ['30d', '7d', '24h', '1h', 'Now'];

export function TokenCardGraph({ prices = [] }) {
  const sortedPrices = prices.sort((a, b) =>
    timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time)
  );

  const chartData = sortedPrices.map(({ time, price }) => ({
    time,
    value: price
  }));

  const isPositiveTrend = chartData.length > 1 &&
    chartData[chartData.length - 1].value > chartData[0].value;
  const lineColor = isPositiveTrend ? "#22c55e" : "#ef4444";

  return (
    <div className='bg-slate-800 rounded-lg p-1' style={{ width: 100, height: 100 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 8, left: 8, bottom: 5 }}
        >
          <XAxis
            dataKey="time"
            tick={{ fontSize: 7 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickMargin={3}
            tickFormatter={(value) => value === 'Now' ? 'Nov' : value}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}