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
        <div className="relative">
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full relative">
                        <h2 className="text-2xl font-bold text-white mb-2">Transaction Failed</h2>
                        <p className="text-slate-300">{alertMessage}</p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-white focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-row justify-between w-fit space-x-6 mt-5">
                <form onSubmit={submitBuy} className="flex flex-row">
                    <Input
                        onChange={(e) => setBuyAmount(e.target.value)}
                        value={buyAmount}
                        className={`bg-slate-700 w-44 p-1 text-white border-none`}
                        placeholder="USD value to purchase"
                        type="number"
                        step="0.01"
                        min="0"
                    />
                    <button type="submit" className="text-white bg-gradient-to-t from-green-600 to-green-500 p-2 rounded-md hover:scale-105 duration-150 hover:opacity-90 px-10">{isLoadingBuy ? 'Loading...' : 'Buy'}</button>
                </form>
                <form onSubmit={submitSell} className="flex flex-row">
                    <Input
                        onChange={(e) => setSellAmount(e.target.value)}
                        value={sellAmount}
                        className={`bg-slate-700 w-44 p-1 text-white border-none`}
                        placeholder="USD value to sell"
                        type="number"
                        step="0.01"
                        min="0"
                    />
                    <button type="submit" className="text-white bg-gradient-to-t from-red-600 to-red-500 p-2 rounded-md hover:scale-105 duration-150 hover:opacity-90 px-10">{isLoadingSell ? 'Loading...' : 'Sell'}</button>
                </form>
            </div>
        </div>
    )
}