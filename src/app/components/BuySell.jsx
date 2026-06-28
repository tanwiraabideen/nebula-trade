"use client"
import { useState, useEffect } from "react"
import Input from "../components/Input"
import { sellToken, buyToken } from "../actions/actions"
import Button from "./Button"

export default function BuySell({ tokenId, email }) {
    const [buyAmount, setBuyAmount] = useState('')
    const [sellAmount, setSellAmount] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [isLoadingBuy, setIsLoadingBuy] = useState(false)
    const [isLoadingSell, setIsLoadingSell] = useState(false)

    useEffect(() => {
        let timer;
        if (isLoadingBuy) {
            timer = setTimeout(() => {
                setIsLoadingBuy(false);
            }, 2000);
        } else if (isLoadingSell) {
            timer = setTimeout(() => {
                setIsLoadingSell(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [isLoadingBuy, isLoadingSell])

    const submitBuy = async (e) => {
        e.preventDefault()
        setIsLoadingBuy(true)
        const amount = parseFloat(buyAmount)
        if (isNaN(amount) || amount <= 0) {
            setAlertMessage("Please enter a valid amount")
            setShowAlert(true)
            return
        }
        const response = await buyToken(amount, tokenId, email)
        if (!response) {
            setAlertMessage("Invalid Buy Transaction")
            setShowAlert(true)
        } else {
            // Handle successful transaction
            setBuyAmount('')
        }
    }

    const submitSell = async (e) => {
        e.preventDefault()
        setIsLoadingSell(true)
        const amount = parseFloat(sellAmount)
        if (isNaN(amount) || amount <= 0) {
            setAlertMessage("Please enter a valid amount")
            setShowAlert(true)
            return
        }
        const response = await sellToken(amount, tokenId, email)
        if (!response) {
            setAlertMessage("Invalid Sell Transaction")
            setShowAlert(true)
        } else {
            // Handle successful transaction
            setSellAmount('')
        }
    }

    return (
        <div className="relative w-full max-w-2xl">
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0d0d2b] border border-purple-900/50 p-6 rounded-2xl shadow-2xl max-w-md w-full relative">
                        <h2 className="text-xl font-bold text-white mb-2">Transaction Failed</h2>
                        <p className="text-slate-400 text-sm">{alertMessage}</p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-row gap-4 mt-5">
                <form onSubmit={submitBuy} className="flex-1 bg-[#0d0d2b] border border-emerald-900/40 rounded-xl p-4">
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">Buy</p>
                    <div className="flex gap-2">
                        <Input
                            onChange={(e) => setBuyAmount(e.target.value)}
                            value={buyAmount}
                            className="bg-[#12123a] border-purple-900/40 text-white flex-1 focus:border-emerald-700/60 rounded-lg"
                            placeholder="USD amount"
                            type="number"
                            step="0.01"
                            min="0"
                        />
                        <button type="submit" className="text-white font-semibold bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-600 hover:to-green-500 px-6 py-2 rounded-lg shadow-lg shadow-emerald-900/30 hover:scale-105 transition-all duration-150">
                            {isLoadingBuy ? 'Loading...' : 'Buy'}
                        </button>
                    </div>
                </form>
                <form onSubmit={submitSell} className="flex-1 bg-[#0d0d2b] border border-red-900/40 rounded-xl p-4">
                    <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">Sell</p>
                    <div className="flex gap-2">
                        <Input
                            onChange={(e) => setSellAmount(e.target.value)}
                            value={sellAmount}
                            className="bg-[#12123a] border-purple-900/40 text-white flex-1 focus:border-red-700/60 rounded-lg"
                            placeholder="USD amount"
                            type="number"
                            step="0.01"
                            min="0"
                        />
                        <button type="submit" className="text-white font-semibold bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 px-6 py-2 rounded-lg shadow-lg shadow-red-900/30 hover:scale-105 transition-all duration-150">
                            {isLoadingSell ? 'Loading...' : 'Sell'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}