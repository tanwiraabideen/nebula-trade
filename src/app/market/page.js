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
            {user && (
                <div className="w-64 flex-shrink-0 border-r border-slate-700">
                    <SideBar user={user} currentPage="market" />
                </div>
            )}
            <div className="flex-grow p-6">
                <div className="mb-6 w-full flex justify-center">
                    <SearchBar classes={''} />
                </div>
                <div className="overflow-x-auto rounded-lg text-white flex flex-row justify-center">
                    <table className="w-2/3 bg-slate-800 rounded-lg">
                        <thead className="bg-slate-700 rounded-t-lg">
                            <tr>
                                <th className="w-16 px-4 py-2 text-left rounded-tl-lg">Icon</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="w-24 px-4 py-2 text-left">Symbol</th>
                                <th className="w-32 px-4 py-2 text-right">Price</th>
                                <th className="w-32 px-4 py-2 text-right rounded-tr-lg">24h Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token) => (
                                <tr key={token.id} className="hover:bg-slate-600 cursor-pointer">
                                    <td className="w-16 px-4 py-2">
                                        <Image src={token.icon} alt={token.name} width={32} height={32} className="rounded-full" />
                                    </td>
                                    <td className="px-4 py-2 font-medium">
                                        <Link href={`/market/token/${token.id}`} className="hover:underline">
                                            {token.name}
                                        </Link>
                                    </td>
                                    <td className="w-24 px-4 py-2 text-gray-400">{token.symbol}</td>
                                    <td className="w-32 px-4 py-2 text-right">${token.price.toFixed(2)}</td>
                                    <td className={`w-32 px-4 py-2 text-right ${token.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {token.priceChangePercentage24h.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-lg font-semibold text-white">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}