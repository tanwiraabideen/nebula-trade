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
            <div className={`${classes} flex flex-row items-center bg-slate-700 p-2 rounded-md`}>
                <input
                    placeholder="Search tokens..."
                    className="focus:outline-none bg-transparent text-white w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="ml-10" />
            </div>
            {searchResults.length > 0 && (
                <div
                    className={`${classes} absolute mt-1 w-full bg-slate-800 rounded-md shadow-lg max-h-60 overflow-y-auto`}
                >
                    {searchResults.map((result, index) => (
                        <Link
                            key={result.id}
                            href={`/market/token/${result.id}`}
                            className={`block px-4 py-2 text-white hover:bg-slate-700 transition-colors duration-150 ease-in-out ${index === 0 ? 'rounded-t-md' : ''
                                } ${index === searchResults.length - 1 ? 'rounded-b-md' : ''}`}
                        >
                            <div className={` flex flex-row items-center`}>
                                <div id="icon" className="size-fit p-2 rounded-lg bg-slate-900 mr-3">
                                    {result.icon !== 'missing_large.png' ? <Image src={result.icon} width={20} height={20} alt={`${result.name} icon`} /> : null}
                                </div>
                                <h1>{result.name}</h1>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}