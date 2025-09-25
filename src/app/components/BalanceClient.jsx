"use client"
import { useState, useEffect } from "react";
import getUserTransactions, { getUserDataById } from "../actions/actions"
import Balance from "./Balance"

export default function BalanceClient({ user, myUser }) {
    const [balance, setBalance] = useState(user.balanceUSD);

    useEffect(() => {
        if (myUser) {
            const fetchBalance = async () => {
                try {
                    const newUser = await getUserDataById(user.id);
                    const newBalance = newUser.balanceUSD
                    // Only update state if new balance is different
                    if (newBalance !== balance) {
                        setBalance(newBalance);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            // Initial fetch
            fetchBalance();

            // Set up interval for polling
            const intervalId = setInterval(fetchBalance, 2000);

            // Cleanup function
            return () => clearInterval(intervalId);
        }
    }, [user.id, myUser, balance]) // Added dependencies

    return (<Balance balance={balance} myUser={myUser} name={user.name}></Balance>)
}