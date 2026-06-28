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
        <div className={`${classes} bg-[#0d0d2b] border border-purple-900/40 rounded-xl p-4 flex items-center gap-4`}>
            <div className="p-2.5 rounded-xl bg-[#12123a] border border-purple-900/30">
                <Image src={token.icon} width={32} height={32} alt={`${token.name} icon`} />
            </div>
            <div>
                <p className="text-slate-500 text-xs">Your {token.name} Holdings</p>
                <h1 className="text-white font-bold text-xl mt-0.5">${tokenBalance}</h1>
            </div>
        </div>
    )
}