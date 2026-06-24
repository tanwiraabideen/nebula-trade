import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const API_KEY = process.env.COINGECKO_API_KEY
const MAX_COINS = 1500
const CALLS_PER_MINUTE = 10
const DELAY_BETWEEN_CALLS = 60000 / CALLS_PER_MINUTE

async function fetchWithRetry(url, retries = 3, initialDelay = 4000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: { 'X-CoinGecko-Api-Key': API_KEY }
            })
            if (response.status === 429) {
                const delay = initialDelay * Math.pow(2, i)
                console.log(`Rate limited. Retrying in ${delay}ms...`)
                await new Promise(resolve => setTimeout(resolve, delay))
            } else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            } else {
                return await response.json()
            }
        } catch (error) {
            if (i === retries - 1) throw error
        }
    }
    throw new Error('Max retries reached')
}

async function fetchAndUpdateTokens() {
    const perPage = 250
    let page = 1
    let totalProcessed = 0

    while (totalProcessed < MAX_COINS) {
        try {
            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d,30d`

            const tokens = await fetchWithRetry(url)

            await prisma.$transaction(async (tx) => {
                for (const token of tokens) {
                    if (totalProcessed >= MAX_COINS) break

                    await tx.token.upsert({
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
                    })

                    totalProcessed++
                }
            })

            console.log(`Processed page ${page} with ${tokens.length} tokens. Total processed: ${totalProcessed}`)

            if (totalProcessed >= MAX_COINS || tokens.length < perPage) {
                break
            } else {
                page++
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS))
            }
        } catch (error) {
            console.error(`Error processing page ${page}:`, error)
            break
        }
    }

    console.log(`Fetch cycle completed. Total tokens processed: ${totalProcessed}`)
}

async function main() {
    console.log('Token updater started')
    while (true) {
        await fetchAndUpdateTokens()
        console.log('Waiting 5 minutes before next cycle...')
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000))
    }
}

main().catch(console.error)
