import { getTokenById, getUserTransactions } from '../actions/actions'
import Image from 'next/image'
import { format } from 'date-fns'

function formatAmount(amount, isBitcoin = false) {
    if (isBitcoin) {
        if (amount < 0.0001) {
            return amount.toFixed(5)
        } else if (amount < 0.01) {
            return amount.toFixed(4)
        } else if (amount < 1) {
            return amount.toFixed(3)
        }
    }
    return amount.toFixed(2)
}

function formatDate(date) {
    return format(new Date(date), 'MMMM d, yyyy')
}

export default async function UserTransactions({ id }) {
    const transactions = await getUserTransactions(id)

    return (
        <div className="bg-[#0d0d2b] border border-purple-900/40 rounded-xl w-full p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-sm">Transaction History</h2>
                <span className="text-slate-500 text-xs">{transactions?.length ?? 0} transactions</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-purple-900/30">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#0a0a22] text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-4 py-3 w-2/5">Token</th>
                            <th className="px-4 py-3 w-1/5">Amount</th>
                            <th className="px-4 py-3 w-1/5">Token Qty</th>
                            <th className="px-4 py-3 w-1/10">Type</th>
                            <th className="px-4 py-3 w-1/5">Date</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-[180px] overflow-y-auto">
                    <table className="w-full">
                        <tbody>
                            {transactions && transactions.length > 0 ? (
                                transactions.map(async (transaction, index) => {
                                    const token = await getTokenById(transaction.tokenId);
                                    if (!token) return null;

                                    const isBuy = transaction.type === 'buy';
                                    const tokenAmount = transaction.amount / token.price;
                                    const isBitcoin = token.symbol.toLowerCase() === 'btc';

                                    return (
                                        <tr key={index} className="border-t border-purple-900/20 hover:bg-purple-900/10 transition-colors">
                                            <td className="py-3 px-4 w-2/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-[#12123a] border border-purple-900/30">
                                                        <Image src={token.icon} width={20} height={20} alt={token.name} />
                                                    </div>
                                                    <span className="text-white text-sm">{token.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-slate-300 py-3 px-4 w-1/5 text-sm">${formatAmount(transaction.amount)}</td>
                                            <td className="text-slate-400 py-3 px-4 w-1/5 text-sm">{formatAmount(tokenAmount, isBitcoin)} {token.symbol}</td>
                                            <td className="py-3 px-4 w-1/10">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${isBuy ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/40' : 'bg-red-900/30 text-red-400 border border-red-900/40'}`}>
                                                    {transaction.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="text-slate-500 py-3 px-4 w-1/5 text-xs">{formatDate(transaction.createdAt)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-slate-500 py-8 text-sm">No transactions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}