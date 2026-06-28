'use client'
import { useState, useEffect } from 'react';
import { Search } from "@mui/icons-material";
import Link from 'next/link';
import Image from 'next/image';
import { getSearchResults } from '../actions/actions';

export default function SearchBar({ classes }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm) {
                try {
                    const results = await getSearchResults(searchTerm);
                    setSearchResults(results);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 100);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    return (
        <div className="relative">
            <div className={`${classes} flex flex-row items-center bg-[#0d0d2b] border border-purple-900/40 focus-within:border-purple-600/60 focus-within:shadow-lg focus-within:shadow-purple-900/20 px-3 py-2.5 rounded-xl transition-all duration-200`}>
                <Search sx={{ color: '#7c3aed', fontSize: 18 }} className="mr-2 flex-shrink-0" />
                <input
                    placeholder="Search tokens..."
                    className="focus:outline-none bg-transparent text-white w-full text-sm placeholder:text-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {searchResults.length > 0 && (
                <div className={`${classes} absolute mt-2 w-full bg-[#0d0d2b] border border-purple-900/40 rounded-xl shadow-xl shadow-black/40 max-h-60 overflow-y-auto z-50`}>
                    {searchResults.map((result, index) => (
                        <Link
                            key={result.id}
                            href={`/market/token/${result.id}`}
                            className={`block px-4 py-2.5 text-white hover:bg-purple-900/30 transition-colors duration-150 ${index === 0 ? 'rounded-t-xl' : ''} ${index === searchResults.length - 1 ? 'rounded-b-xl' : 'border-b border-purple-900/20'}`}
                        >
                            <div className="flex flex-row items-center gap-3">
                                <div className="size-fit p-1.5 rounded-lg bg-[#12123a] border border-purple-900/30">
                                    {result.icon !== 'missing_large.png' ? <Image src={result.icon} width={18} height={18} alt={`${result.name} icon`} /> : null}
                                </div>
                                <h1 className="text-sm font-medium">{result.name}</h1>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}