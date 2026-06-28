'use client'
import { useState, useEffect } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getUserValue } from '../actions/actions';

export default function Value({ myUser, user }) {
    const [value, setValue] = useState(null)

    useEffect(() => {
        const fetchValue = async () => {
            const newValue = await getUserValue(user.id)
            if (newValue !== value) {
                setValue(newValue)
            }
        }
        fetchValue()
        const intervalId = setInterval(fetchValue, 2000);
        return () => clearInterval(intervalId)
    }, [])

    if (!value) return null

    return (
        <div className="bg-[#0d0d2b] border border-purple-900/40 p-4 rounded-xl shadow-lg flex flex-row items-center gap-4 w-52">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-violet-700/40 to-purple-900/40 border border-purple-700/30">
                <AccountBalanceWalletIcon sx={{ color: '#a78bfa', fontSize: 24 }} />
            </div>
            <div className="flex flex-col">
                <p className="text-xs text-slate-500 mb-1">{myUser ? 'Portfolio Value' : `${user.name}'s Value`}</p>
                <h1 className="text-lg text-white font-bold">${Number(value.toFixed(2))}</h1>
            </div>
        </div>
    )
}