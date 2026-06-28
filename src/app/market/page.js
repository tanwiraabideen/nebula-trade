'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPaginatedTokens, createUser, getUserDataByEmail } from '../actions/actions';
import SideBar from '../components/SideBar';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import SearchBar from '../components/Search';

const ITEMS_PER_PAGE = 10;

export default function MarketPage() {
    const [tokens, setTokens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();
    const { isAuthenticated, user: kindeUser, isLoading: isAuthLoading } = useKindeBrowserClient();

    useEffect(() => {
        if (!isAuthLoading) {
            setAuthChecked(true);
            if (!isAuthenticated) {
                router.push('/');
            }
        }
    }, [isAuthLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && kindeUser?.email) {
                try {
                    await createUser(kindeUser.email);
                    const userData = await getUserDataByEmail(kindeUser.email);
                    setUser(userData);
                    fetchTokens(currentPage);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        if (authChecked && isAuthenticated) {
            fetchUserData();
        }
    }, [authChecked, isAuthenticated, kindeUser, currentPage]);

    const fetchTokens = async (page) => {
        setIsLoading(true);
        try {
            const data = await getPaginatedTokens(page, ITEMS_PER_PAGE);
            setTokens(data.tokens);
            setTotalPages(Math.ceil(data.totalTokens / ITEMS_PER_PAGE));
        } catch (error) {
            console.error('Error fetching tokens:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    if (isAuthLoading || !authChecked) {
        return <p className="text-white">Checking authentication...</p>;
    }

    if (!isAuthenticated) {
        return null; // This will prevent any flicker before redirect
    }

    if (isLoading) {
        return <p className="text-white">Loading market data...</p>;
    }

    return (
        <div className="flex min-h-screen">
            {user && <SideBar user={user} currentPage="market" />}

            <div className="flex-1 px-8 py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-slate-500 text-sm">Browse</p>
                        <h1 className="text-white font-bold text-2xl">Market</h1>
                    </div>
                    <SearchBar classes="w-72" />
                </div>

                <div className="bg-[#0d0d2b] border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#0a0a22] text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-5 py-4 w-14"></th>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4 w-24">Symbol</th>
                                <th className="px-5 py-4 text-right w-36">Price</th>
                                <th className="px-5 py-4 text-right w-36">24h Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token) => (
                                <tr key={token.id} className="border-t border-purple-900/20 hover:bg-purple-900/10 cursor-pointer transition-colors duration-150">
                                    <td className="px-5 py-3.5 w-14">
                                        <div className="p-1.5 rounded-lg bg-[#12123a] border border-purple-900/30 w-fit">
                                            <Image src={token.icon} alt={token.name} width={26} height={26} className="rounded-full" />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Link href={`/market/token/${token.id}`} className="text-white font-medium text-sm hover:text-violet-300 transition-colors">
                                            {token.name}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 text-sm">{token.symbol.toUpperCase()}</td>
                                    <td className="px-5 py-3.5 text-right text-white font-medium text-sm">${token.price.toFixed(2)}</td>
                                    <td className="px-5 py-3.5 text-right">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${token.priceChangePercentage24h >= 0 ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/40' : 'bg-red-900/30 text-red-400 border border-red-900/40'}`}>
                                            {token.priceChangePercentage24h >= 0 ? '+' : ''}{token.priceChangePercentage24h.toFixed(2)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${currentPage === 1 ? 'bg-[#0d0d2b] border border-purple-900/30 text-slate-600 cursor-not-allowed' : 'bg-[#0d0d2b] border border-purple-700/50 text-purple-300 hover:bg-purple-900/20 hover:border-purple-600/60'}`}
                    >
                        ← Previous
                    </button>
                    <span className="text-slate-400 text-sm px-2">
                        Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${currentPage === totalPages ? 'bg-[#0d0d2b] border border-purple-900/30 text-slate-600 cursor-not-allowed' : 'bg-[#0d0d2b] border border-purple-700/50 text-purple-300 hover:bg-purple-900/20 hover:border-purple-600/60'}`}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}