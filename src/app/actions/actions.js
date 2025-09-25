"use server"

import { ThermometerSnowflakeIcon } from "lucide-react";
import prisma from "../../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

let updateInterval;

const API_KEY = process.env.COINGECKO_API_KEY;
const MAX_COINS = 1500;
const CALLS_PER_MINUTE = 10;
const DELAY_BETWEEN_CALLS = 60000 / CALLS_PER_MINUTE; // 3000 ms

async function fetchWithRetry(url, retries = 3, initialDelay = 4000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'X-CoinGecko-Api-Key': API_KEY
                }
            });
            if (response.status === 429) {
                const delay = initialDelay * Math.pow(2, i);
                console.log(`Rate limited. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return await response.json();
            }
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
    throw new Error('Max retries reached');
}

async function fetchAndUpdateTokens() {
    const perPage = 250; // Maximum allowed by CoinGecko
    let page = 1;
    let totalProcessed = 0;

    while (totalProcessed < MAX_COINS) {
        try {
            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d,30d`;

            const tokens = await fetchWithRetry(url);

            await prisma.$transaction(async (prisma) => {
                for (const token of tokens) {
                    if (totalProcessed >= MAX_COINS) break;

                    await prisma.token.upsert({
                        where: { id: token.id },
                        update: {
                            symbol: token.symbol,
                            name: token.name,
                            icon: token.image,
                            price: token.current_price,
                            marketCapRank: token.market_cap_rank || 0,
                            priceChange1h: token.price_change_percentage_1h_in_currency || 0,
                            priceChange7d: token.price_change_percentage_7d_in_currency || 0,
                            priceChange30d: token.price_change_percentage_30d_in_currency || 0,
                            priceChangePercentage24h: token.price_change_percentage_24h || 0,
                            lastUpdated: new Date(token.last_updated),
                        },
                        create: {
                            id: token.id,
                            symbol: token.symbol,
                            name: token.name,
                            icon: token.image,
                            price: token.current_price,
                            marketCapRank: token.market_cap_rank || 0,
                            priceChange1h: token.price_change_percentage_1h_in_currency || 0,
                            priceChange7d: token.price_change_percentage_7d_in_currency || 0,
                            priceChange30d: token.price_change_percentage_30d_in_currency || 0,
                            priceChangePercentage24h: token.price_change_percentage_24h || 0,
                            lastUpdated: new Date(token.last_updated),
                        },
                    });

                    totalProcessed++;
                }
            });

            console.log(`Processed page ${page} with ${tokens.length} tokens. Total processed: ${totalProcessed}`);

            if (totalProcessed >= MAX_COINS || tokens.length < perPage) {
                break;
            } else {
                page++;
                // Delay to respect rate limit
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
            }
        } catch (error) {
            console.error(`Error processing page ${page}:`, error);
            break;
        }
    }

    console.log(`Fetch cycle completed. Total tokens processed: ${totalProcessed}`);
}

export async function startAutomatedTokenUpdater() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    const fetchAndWait = async () => {
        await fetchAndUpdateTokens();
        // Wait for 5 minutes after completing a full fetch cycle
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
    };

    // Start the first cycle immediately
    fetchAndWait();

    // Set up the interval for subsequent cycles
    // The interval is set to 7 minutes to account for fetching time plus waiting time
    updateInterval = setInterval(fetchAndWait, 7 * 60 * 1000);

    console.log('Automated token updater started');
}

export async function stopAutomatedTokenUpdater() {
    if (updateInterval) {
        clearInterval(updateInterval);
        console.log('Automated token updater stopped');
    }
}

export async function getUserDataByEmail(email) {

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                competitions: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                balanceUSD: true
                                // Add PFP in future
                            }
                        }
                    }
                },
                transactions: true,
                userTokens: true
            }
        })

        return user

    } catch (error) {
        console.log('ERROR FROM GET USER BY ID ACTION: ', error)
    }

}

export async function getUserDataById(id) {

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                competitions: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                balanceUSD: true
                                // Add PFP in future
                            }
                        }
                    }
                },
                transactions: true,
                userTokens: true
            }
        })

        return user

    } catch (error) {
        console.log('ERROR FROM GET USER BY ID ACTION: ', error)
    }

}

export async function createUser() {
    // We are finding if the user signed up before, if not, we're creating user. FIND IF IT'S INEFFICIENT DOING EVERY LOGIN

    const { getUser } = getKindeServerSession()
    const user = await getUser()
    console.log('USERNAME IS', user.email)

    try {
        console.log("create user started")
        const accounts = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })
        console.log("accounts found are", accounts)

        if (!accounts) {
            await prisma.user.create({
                data: {
                    name: user.given_name, // ADD FAMILY NAME TOO
                    email: user.email,
                    balanceUSD: 1000,
                }
            })
            console.log("Created a prisma record for account")
        }

    } catch (error) {
        console.log(error)
        return (error)
    }

}


export async function getCoinData(coinId) {
    try {
        const response = await prisma.token.findUnique({
            where: {
                id: coinId
            }
        })
        return response

    } catch (error) {
        console.log(error)
    }


}

export async function getSearchResults(searchTerm) {

    try {
        const response = prisma.token.findMany({
            where: {
                name: {
                    contains: searchTerm
                }
            }

        })
        return response
    } catch (err) {
        console.log('Error from token search action : ', err)
        throw err
    }
}

export async function getTokenById(id) {

    try {
        const response = prisma.token.findUnique({
            where: {
                id: id
            }

        })
        return response
    } catch (err) {
        console.log('Error from token page data action : ', err)
        throw err
    }
}


export async function buyToken(amount, tokenId, email) {
    const user = await getUserDataByEmail(email)
    const coin = await getCoinData(tokenId)

    if (!user || !coin) {
        console.log('DIDNT GET USER AND COIN')
        return false
    }

    console.log('GOT USER AND COIN')

    if (amount <= user.balanceUSD) {
        try {
            // Wrap all database operations in a transaction
            const result = await prisma.$transaction(async (prisma) => {
                // Create transaction record
                await prisma.transaction.create({
                    data: {
                        type: "buy",
                        userEmail: email,
                        tokenId: tokenId,
                        amount: amount
                    }
                })

                // Update or create user token record
                await prisma.userToken.upsert({
                    where: {
                        userId_tokenId: {
                            userId: user.id,
                            tokenId: tokenId
                        }
                    },
                    update: {
                        tokensHeld: {
                            increment: amount / coin.price
                        }
                    },
                    create: {
                        tokenId: tokenId,
                        tokensHeld: amount / coin.price,
                        user: { connect: { id: user.id } }
                    }
                })

                // Update user balance
                await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        balanceUSD: {
                            decrement: amount
                        }
                    }
                })

                return true
            })

            return result
        } catch (error) {
            console.log(error)
            return false
        }
    } else {
        return false
    }
}

export async function sellToken(amount, tokenId, email) {
    let usdValueHeld
    try {


        const user = await getUserDataByEmail(email)
        const userToken = await getUserToken(user.id, tokenId)
        const coin = await getTokenById(tokenId)
        usdValueHeld = Number((coin.price * userToken.tokensHeld).toFixed(2))

        if (amount < usdValueHeld) {
            const result = await prisma.$transaction(async (prisma) => {
                // Create transaction record
                await prisma.transaction.create({
                    data: {
                        type: "sell",
                        userEmail: email,
                        tokenId: tokenId,
                        amount: amount
                    }
                })

                // Update or create user token record
                await prisma.userToken.upsert({
                    where: {
                        userId_tokenId: {
                            userId: user.id,
                            tokenId: tokenId
                        }
                    },
                    update: {
                        tokensHeld: {
                            decrement: amount / coin.price
                        }
                    },
                    create: {
                        tokenId: tokenId,
                        tokensHeld: amount / coin.price,
                        user: { connect: { id: user.id } }
                    }
                })

                // Update user balance
                await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        balanceUSD: {
                            increment: amount
                        }
                    }
                })


            })
            return true
        }
    } catch (err) {
        console.log('ERROR FROM SELL ACTION', err)
        return false
    }
}

export async function getUserToken(userId, tokenId) {
    try {
        const userToken = await prisma.userToken.findUnique({
            where: {
                userId_tokenId: {
                    userId: userId,
                    tokenId: tokenId
                }
            }
        })
        return userToken
    } catch (err) {
        console.log('ERROR FROM USERTOKEN ACTION', error)
        return false
    }
}

export async function getUserTransactions(email) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userEmail: email
            }
        })
        return transactions
    } catch (err) {
        console.log('ERROR FROM GET USER TRANSACTION', err)
        throw err
    }
}

export async function getUserValue(userId) {
    const user = await getUserDataById(userId)
    let value = user.balanceUSD

    try {
        const userTokens = await prisma.userToken.findMany({
            where: {
                userId: userId
            }
        })

        for (const userToken of userTokens) {
            const token = await getTokenById(userToken.tokenId)
            value += token.price * userToken.tokensHeld
        }

        return value
    } catch (error) {
        console.error('Error calculating user value:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

export async function getPaginatedTokens(page = 1, itemsPerPage = 20, sortDirection = 'desc') {
    const skip = (page - 1) * itemsPerPage;

    try {
        const [tokens, totalTokens] = await Promise.all([
            prisma.token.findMany({
                skip: skip,
                take: itemsPerPage,
                orderBy: {
                    price: sortDirection, // 'desc' for highest to lowest, 'asc' for lowest to highest
                },
                select: {
                    id: true,
                    name: true,
                    symbol: true,
                    icon: true,
                    price: true,
                    priceChangePercentage24h: true
                }
            }),
            prisma.token.count()
        ]);

        return {
            tokens,
            totalTokens,
            page,
            itemsPerPage
        };
    } catch (error) {
        console.error('Error fetching tokens:', error);
        throw new Error('Failed to fetch tokens');
    }
}
