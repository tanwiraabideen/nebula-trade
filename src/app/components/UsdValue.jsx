// user value needs to update every time token prices update, every 2 minutes
'use client'
import { useState, useEffect } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getUserValue } from '../actions/actions';

export default function Value({ myUser, user }) {
    const [value, setValue] = useState(null)

    useEffect(() => {
        const fetchValue = async () => {
            const newValue = await getUserValue(user.id) // make this function and fix prop
            if (newValue !== value) {
                setValue(newValue)
            }
        }
        fetchValue()

        const intervalId = setInterval(fetchValue, 2000);

        // Cleanup function
        return () => clearInterval(intervalId)
    }, [])

    if (!value) {
        return null
    }

    return (<div className="bg-slate-900 p-2 rounded-md shadow-md flex flex-row  w-48 items-center justify-center">
        <AccountBalanceWalletIcon fontSize='large' color='primary'></AccountBalanceWalletIcon>
        <div className='flex flex-col ml-4'>
            <p className='text-sm mb-2 text-slate-500'>{myUser ? 'Your value' : `${user.name}'s account value`}</p>
            <h1 className='text-xl text-slate-50 font-bold'>${Number(value.toFixed(2))}</h1>
        </div>
    </div>)
}