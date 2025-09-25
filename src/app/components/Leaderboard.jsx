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

    if (error) return <h1 className="text-white">{error}</h1>;

    return (
        <div>
            {!competition ? <h1 className="text-white">Loading...</h1> :
                <div className="flex flex-col justify-center items-center bg-slate-900 p-5 rounded-2xl">
                    <h1 className="text-white text-2xl">{competition.name}</h1>
                    {orderedUsers && orderedUsers.length > 0 ?
                        <div id="leaderboard-structure" className='mt-5 flex flex-row'>
                            {orderedUsers[2] ?
                                <div id="third-place" className="bg-slate-800 rounded-xl rounded-r-none h-28 w-24 p-2 mt-auto">
                                    <div className=' flex flex-col items-center justify-center'>
                                        <Image src={placeholder} height={30} className='rounded-full border-2 border-purple-500' alt="Third place"></Image>
                                        <h1 className='text-lg'>🥉</h1>
                                        <h1 className='text-white text-sm'>{orderedUsers[2].name}</h1>
                                        <h2 className='text-white text-sm'>${Number(orderedUsers[2].userValue.toFixed(2))}</h2>
                                    </div>
                                </div>
                                : null}
                            <div id="first-place" className="bg-slate-700 rounded-xl rounded-b-none h-36 w-24 p-3">
                                <div className=' flex flex-col items-center justify-center'>
                                    <Image src={placeholder} height={50} className='rounded-full border-2 border-purple-500' alt="First place"></Image>
                                    <h1 className='text-lg'>🥇</h1>
                                    <h1 className='text-white'>{orderedUsers[0].name}</h1>
                                    <h2 className='text-white'>${Number(orderedUsers[0].userValue.toFixed(2))}</h2>
                                </div>
                            </div>
                            {orderedUsers[1] ?
                                <div id="second-place" className="bg-slate-800 rounded-xl rounded-l-none h-28 w-24 p-2 mt-auto">
                                    <div className=' flex flex-col items-center justify-center'>
                                        <Image src={placeholder} height={30} className='rounded-full border-2 border-purple-500' alt="Second place"></Image>
                                        <h1 className='text-lg'>🥈</h1>
                                        <h1 className='text-white text-sm'>{orderedUsers[1].name}</h1>
                                        <h2 className='text-white text-sm'>${Number(orderedUsers[1].userValue.toFixed(2))}</h2>
                                    </div>
                                </div>
                                : null}
                        </div>
                        : null}
                </div>}
        </div>
    )
}