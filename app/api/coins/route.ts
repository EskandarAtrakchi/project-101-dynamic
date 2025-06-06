import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use CoinGecko API as alternative since bitcoinexplorer.org seems down
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transform data to match expected format
    const transformedData = data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      image: coin.image,
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching coin data:", error)

    // Fallback data
    const fallbackData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        current_price: 45000,
        market_cap: 880000000000,
        price_change_percentage_24h: 2.5,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        current_price: 2800,
        market_cap: 340000000000,
        price_change_percentage_24h: 1.8,
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
    ]

    return NextResponse.json(fallbackData)
  }
}
