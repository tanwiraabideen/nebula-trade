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
        <div className="bg-slate-950 rounded-lg w-full p-6">
            <div className="overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-sm">
                            <th className="pb-4 w-2/5 pr-4">Transactions</th>
                            <th className="pb-4 w-1/5 px-4">Amount</th>
                            <th className="pb-4 w-1/5 px-4">Token Amount</th>
                            <th className="pb-4 w-1/10 px-4">Type</th>
                            <th className="pb-4 w-1/5 pl-4">Date</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-[160px] overflow-y-auto">
                    <table className="w-full">
                        <tbody>
                            {transactions && transactions.length > 0 ? (
                                transactions.map(async (transaction, index) => {
                                    const token = await getTokenById(transaction.tokenId);
                                    if (!token) return null;

                                    const typeColor = transaction.type === 'buy' ? 'text-green-500' : 'text-red-500';
                                    const tokenAmount = transaction.amount / token.price;
                                    const isBitcoin = token.symbol.toLowerCase() === 'btc';

                                    return (
                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950'}`}>
                                            <td className="py-4 w-2/5 pr-4">
                                                <div className="flex items-center">
                                                    <div className="mr-3 bg-slate-800 rounded-lg p-2">
                                                        <Image src={token.icon} width={24} height={24} alt={token.name} />
                                                    </div>
                                                    <span className="text-white">{`${token.name}`}</span>
                                                </div>
                                            </td>
                                            <td className="text-white py-4 w-1/5 px-4">{`$${formatAmount(transaction.amount)}`}</td>
                                            <td className="text-white py-4 w-1/5 px-4">{`${formatAmount(tokenAmount, isBitcoin)} ${token.symbol}`}</td>
                                            <td className={`py-4 ${typeColor} font-semibold w-1/10 px-4`}>
                                                {transaction.type.toUpperCase()}
                                            </td>
                                            <td className="text-gray-400 py-4 w-1/5 pl-4">{formatDate(transaction.createdAt)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-400 py-4">No transactions.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}