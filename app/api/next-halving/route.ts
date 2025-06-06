import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try multiple Bitcoin halving APIs as backup
    const apis = [
      "https://api.blockchain.info/stats",
      "https://blockstream.info/api/blocks/tip/height",
      "https://api.blockcypher.com/v1/btc/main",
    ]

    // Calculate next halving manually since the original API seems down
    try {
      const response = await fetch("https://blockstream.info/api/blocks/tip/height")
      if (response.ok) {
        const currentHeight = await response.json()

        // Bitcoin halving occurs every 210,000 blocks
        const halvingInterval = 210000
        const nextHalvingBlock = Math.ceil(currentHeight / halvingInterval) * halvingInterval
        const blocksUntilHalving = nextHalvingBlock - currentHeight

        // Estimate time (assuming ~10 minutes per block)
        const minutesUntilHalving = blocksUntilHalving * 10
        const daysUntilHalving = Math.floor(minutesUntilHalving / (60 * 24))

        const data = {
          current_block: currentHeight,
          next_halving_block: nextHalvingBlock,
          blocks_until_halving: blocksUntilHalving,
          estimated_days_until_halving: daysUntilHalving,
          estimated_date: new Date(Date.now() + daysUntilHalving * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }

        return NextResponse.json(data)
      }
    } catch (error) {
      console.error("Error with blockstream API:", error)
    }

    // Fallback data if APIs are down
    const fallbackData = {
      current_block: 870000, // Approximate current block
      next_halving_block: 1050000,
      blocks_until_halving: 180000,
      estimated_days_until_halving: 1250,
      estimated_date: "2028-04-15",
      note: "Estimated data - external APIs unavailable",
    }

    return NextResponse.json(fallbackData)
  } catch (error) {
    console.error("Error fetching next halving data:", error)
    return NextResponse.json({ error: "An error occurred while fetching next halving data" }, { status: 500 })
  }
}
