"use client"
import placeholder from '../../../public/placeholder.jpeg'
import { useEffect, useState } from "react"
import { orderUsers } from "../utils/utils"
import Image from "next/image"

export default function Leaderboard({ user }) {
    const [compUsers, setCompUsers] = useState(null)
    const [competition, setCompetition] = useState(null)
    const [orderedUsers, setOrderedUsers] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                if (!user || !user.competitions || user.competitions.length === 0) {
                    setError("No competition data available");
                    return;
                }

                const compLength = user.competitions.length;
                const latestCompetition = user.competitions[compLength - 1];
                setCompetition(latestCompetition);

                if (latestCompetition && latestCompetition.users) {
                    const users = await orderUsers(latestCompetition.users);
                    if (users && users.length > 0 && users[0].name) {
                        setOrderedUsers(users);
                        setCompUsers(users);
                    } else {
                        setError("Invalid user data received");
                    }
                } else {
                    setError("No users found in the competition");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching data");
            }
        }

        fetchData();
    }, [user])

    if (error) return <h1 className="text-slate-400 text-sm">{error}</h1>;

    return (
        <div>
            {!competition ? <h1 className="text-slate-400 text-sm">Loading...</h1> :
                <div className="flex flex-col justify-center items-center bg-[#0d0d2b] border border-purple-900/40 p-5 rounded-2xl shadow-lg">
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Competition</p>
                    <h1 className="text-white font-bold text-lg mb-4">{competition.name}</h1>
                    {orderedUsers && orderedUsers.length > 0 ?
                        <div className="flex flex-row items-end gap-1">
                            {orderedUsers[2] ?
                                <div className="flex flex-col items-center bg-[#12123a] border border-purple-900/30 rounded-xl rounded-r-none h-28 w-24 p-2 justify-end pb-3">
                                    <Image src={placeholder} height={28} width={28} className="rounded-full ring-2 ring-purple-700/50 mb-1" alt="Third place" />
                                    <span className="text-base">🥉</span>
                                    <h1 className="text-white text-xs font-medium truncate w-full text-center">{orderedUsers[2].name}</h1>
                                    <h2 className="text-purple-400 text-xs">${Number(orderedUsers[2].userValue.toFixed(2))}</h2>
                                </div>
                                : null}
                            <div className="flex flex-col items-center bg-gradient-to-b from-purple-900/50 to-[#12123a] border border-purple-700/40 rounded-xl rounded-b-none h-36 w-24 p-2 justify-end pb-3 shadow-lg shadow-purple-900/30">
                                <Image src={placeholder} height={38} width={38} className="rounded-full ring-2 ring-violet-500/70 mb-1" alt="First place" />
                                <span className="text-base">🥇</span>
                                <h1 className="text-white text-xs font-semibold truncate w-full text-center">{orderedUsers[0].name}</h1>
                                <h2 className="text-violet-300 text-xs font-medium">${Number(orderedUsers[0].userValue.toFixed(2))}</h2>
                            </div>
                            {orderedUsers[1] ?
                                <div className="flex flex-col items-center bg-[#12123a] border border-purple-900/30 rounded-xl rounded-l-none h-28 w-24 p-2 justify-end pb-3">
                                    <Image src={placeholder} height={28} width={28} className="rounded-full ring-2 ring-purple-700/50 mb-1" alt="Second place" />
                                    <span className="text-base">🥈</span>
                                    <h1 className="text-white text-xs font-medium truncate w-full text-center">{orderedUsers[1].name}</h1>
                                    <h2 className="text-purple-400 text-xs">${Number(orderedUsers[1].userValue.toFixed(2))}</h2>
                                </div>
                                : null}
                        </div>
                        : null}
                </div>}
        </div>
    )
}