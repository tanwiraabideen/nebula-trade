"use client"
import PaidIcon from '@mui/icons-material/Paid';

export default function Balance({ myUser, balance, name }) {
    return (
        <div className="bg-[#0d0d2b] border border-purple-900/40 p-4 rounded-xl shadow-lg flex flex-row items-center gap-4 w-52">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-violet-700/40 to-purple-900/40 border border-purple-700/30">
                <PaidIcon sx={{ color: '#a78bfa', fontSize: 24 }} />
            </div>
            <div className="flex flex-col">
                <p className="text-xs text-slate-500 mb-1">{myUser ? 'USD Balance' : `${name}'s Balance`}</p>
                <h1 className="text-lg text-white font-bold">${balance}</h1>
            </div>
        </div>
    )
}