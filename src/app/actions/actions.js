"use server"

import prisma from "../../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";



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

export async function getSocialUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                balanceUSD: true
            }
        })

        for (const user of users) {
            const userValue = await getUserValue(user.id)
            user.userValue = userValue
        }

        users.sort((a, b) => b.userValue - a.userValue)
        return users
    } catch (error) {
        console.error('Error fetching social users:', error);
        throw new Error('Failed to fetch social users');
    }
}
