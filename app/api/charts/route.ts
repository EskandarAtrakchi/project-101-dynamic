import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.alternative.me/v1/ticker/")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching data from external API:", error)
    return NextResponse.json({ error: "Error fetching data from external API" }, { status: 500 })
  }
}
