import { NextResponse } from "next/server"
import { generateMnemonic } from "bip39"

export async function GET() {
  try {
    const seedPhrase = generateMnemonic()
    return NextResponse.json({ seedPhrase })
  } catch (error) {
    console.error("Error generating seed phrase:", error)
    return NextResponse.json({ error: "Error generating seed phrase" }, { status: 500 })
  }
}
