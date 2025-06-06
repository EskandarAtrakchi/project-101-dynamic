import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { walletAddress, chain } = await request.json()

    if (!walletAddress || !chain) {
      return NextResponse.json({ error: "Wallet address and chain are required" }, { status: 400 })
    }

    // Use the provided Moralis API key
    const MORALIS_API_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJiNWEyOWY5LWE5YjgtNDEwZC1iZDE1LTg2NDM2N2NhNzRhNiIsIm9yZ0lkIjoiMzM0MjI4IiwidXNlcklkIjoiMzQzNjQ0IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiIxYmYwOTMxMC1jNDdjLTQzZGMtOTQ0Ni1lZmZlNTVjNGEyYmIiLCJpYXQiOjE3MTExNDY2NDAsImV4cCI6NDg2NjkwNjY0MH0.ozz--ABVhBXp6ModCqrtR2MU0rSU8NJamh-qs_bRKsg"

    console.log("Fetching net worth for:", walletAddress, "on chain:", chain)

    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?chains%5B0%5D=${chain}&exclude_spam=true&exclude_unverified_contracts=true`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    })

    console.log("Moralis response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Moralis API error:", response.status, errorText)
      throw new Error(`Moralis API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Moralis response data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching net worth data:", error)
    return NextResponse.json(
      {
        error: "Error fetching net worth data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
