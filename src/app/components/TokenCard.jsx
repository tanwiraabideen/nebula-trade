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



    return (
        <Link href={`/market/token/${coin.id}`}>
            <div className="bg-slate-900 rounded-lg flex flex-col w-72 p-5 cursor-pointer hover:scale-105 duration-200 hover:opacity-90">
                {coin ?
                    <div id="parent">
                        <div id="top-row" className="flex flex-row items-center">
                            <div id="icon" className="size-fit p-2 rounded-lg bg-slate-800 mr-3">
                                <Image src={coin.icon} width={40} height={40}></Image>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-xl mb-1">{coin.name}</h1>
                                <p className="text-slate-400 text-sm">{coin.symbol.toUpperCase()}</p>
                            </div>
                            {coin.priceChangePercentage24h > 0 ?
                                <Image className="ml-auto" src={up} height={10} width={10}></Image> :
                                <Image className="ml-auto" src={down} height={10} width={10}></Image>}
                        </div>
                        <div id="bottom-row" className="flex flex-row items-center mt-4 space-x-10">
                            <div id="price&percent" className="flex flex-col">
                                <h1 className="text-white font-extrabold text-2xl mb-1">${coin.price}</h1>
                                {coin.priceChangePercentage24h > 0 ?
                                    <h2 className="text-green-700 font-bold text-lg">+{Math.round((coin.priceChangePercentage24h + Number.EPSILON) * 100) / 100}%</h2> :
                                    <h2 className="text-red-700 font-bold text-lg">{Math.round((coin.priceChangePercentage24h + Number.EPSILON) * 100) / 100}%</h2>}
                            </div>
                            <div id="graph" className="ml-auto">
                                <TokenCardGraph prices={data}></TokenCardGraph>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </Link>
    )
}