import Image from "next/image"
import Link from "next/link"
import { getCoinData } from "../actions/actions"
import up from '../../../public/other/up.png'
import down from '../../../public/other/down.png'
import { TokenCardGraph } from "./TokenCardGraph"

export default async function TokenCard({ coinId }) {

    const coin = await getCoinData(coinId)
    let data

    function createChart() {
        const chartData = [];
        const currentPrice = coin.price;

        // Helper function to calculate price based on percentage change
        const calculatePrice = (changePercentage) => {
            return currentPrice / (1 + changePercentage / 100);
        };

        // Add current price
        chartData.push({ time: 'Now', price: currentPrice });

        // Add 1h price change if available
        if (coin.priceChange1h !== 0) {
            chartData.push({
                time: '1h',
                price: calculatePrice(coin.priceChange1h)
            });
        }

        // Add 24h price change if available
        if (coin.priceChangePercentage24h !== 0) {
            chartData.push({
                time: '24h',
                price: calculatePrice(coin.priceChangePercentage24h)
            });
        }

        // Add 7d price change if available
        if (coin.priceChange7d !== 0) {
            chartData.push({
                time: '7d',
                price: calculatePrice(coin.priceChange7d)
            });
        }

        // Add 30d price change if available
        if (coin.priceChange30d !== 0) {
            chartData.push({
                time: '30d',
                price: calculatePrice(coin.priceChange30d)
            });
        }

        const timeOrder = ['Now', '1h', '24h', '7d', '30d'];
        chartData.sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time));

        console.log('CHART DATA IS', chartData)
        return chartData;
    }

    coin ? data = createChart() : null



    const isPositive = coin.priceChangePercentage24h > 0
    const pctChange = Math.round((coin.priceChangePercentage24h + Number.EPSILON) * 100) / 100

    return (
        <Link href={`/market/token/${coin.id}`}>
            <div className="bg-[#0d0d2b] border border-purple-900/40 rounded-xl flex flex-col w-72 p-5 cursor-pointer hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-900/20 hover:-translate-y-1 transition-all duration-200">
                {coin ?
                    <div>
                        <div className="flex flex-row items-center">
                            <div className="p-2.5 rounded-xl bg-[#12123a] border border-purple-900/30 mr-3">
                                <Image src={coin.icon} width={36} height={36} alt={coin.name} />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white font-semibold">{coin.name}</h1>
                                <p className="text-slate-500 text-xs mt-0.5">{coin.symbol.toUpperCase()}</p>
                            </div>
                            <div className={`ml-auto px-2 py-1 rounded-lg text-xs font-semibold ${isPositive ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/40' : 'bg-red-900/30 text-red-400 border border-red-900/40'}`}>
                                {isPositive ? '+' : ''}{pctChange}%
                            </div>
                        </div>
                        <div className="flex flex-row items-end mt-4">
                            <div className="flex flex-col">
                                <h1 className="text-white font-bold text-2xl">${coin.price}</h1>
                                <p className="text-slate-500 text-xs mt-1">24h change</p>
                            </div>
                            <div className="ml-auto">
                                <TokenCardGraph prices={data} />
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </Link>
    )
}