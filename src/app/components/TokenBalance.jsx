'use client'
import Image from "next/image"
import { getUserToken, getTokenById } from "../actions/actions"
import { useState, useEffect } from "react"

export default function TokenBalance({ classes, userId, tokenId }) {
    const [tokenBalance, setTokenBalance] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const fetchTokenBalance = async () => {
            try {
                const [userToken, tokenData] = await Promise.all([
                    getUserToken(userId, tokenId),
                    getTokenById(tokenId)
                ])

                const usdValueHeld = Number((tokenData.price * userToken.tokensHeld).toFixed(2))

                setToken(tokenData)
                setTokenBalance(prevBalance => {
                    if (prevBalance !== usdValueHeld) {
                        return usdValueHeld
                    }
                    return prevBalance
                })
            } catch (error) {
                console.error('Error fetching token data:', error)
            }
        }

        fetchTokenBalance()
        const intervalId = setInterval(fetchTokenBalance, 2000)

        return () => clearInterval(intervalId)
    }, [userId, tokenId])

    if (!tokenBalance || !token) return null

    return (
        <div className={`${classes} size-fit p-3 flex flex-col items-center justify-center bg-slate-900 rounded-lg`}>
            <h1 className="text-white mb-2 text-2xl">Your {token.name}</h1>
            <div className="flex flex-row items-center">
                <div id="icon" className="size-fit p-2 rounded-lg bg-slate-800 mr-3">
                    <Image className="mr-auto" src={token.icon} width={30} height={30} alt={`${token.name} icon`} />
                </div>
                <h1 className="text-white mr-auto font-bold text-xl">${tokenBalance}</h1>
            </div>
        </div>
    )
}