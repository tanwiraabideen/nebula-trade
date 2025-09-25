"use client"
import { useState, useEffect } from 'react';
import PaidIcon from '@mui/icons-material/Paid';
import { getUserTransactions } from '../actions/actions';

export default function Balance({ myUser, balance, name }) {


    return (<div className="bg-slate-900 p-2 rounded-md shadow-md flex flex-row w-48 items-center justify-center">
        <PaidIcon fontSize='large' color='primary'></PaidIcon>
        <div className='flex flex-col ml-4'>
            <p className='text-sm mb-2 text-slate-500'>{myUser ? 'Your USD balance' : `${name}'s USD balance`}</p>
            <h1 className='text-xl text-slate-50 font-bold'>{`$${balance}`}</h1>
        </div>
    </div>)
}