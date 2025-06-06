"use client"

import type React from "react"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChainData {
  chain: string
  native_balance: string
  native_balance_usd: string
  token_balance_usd: string
  networth_usd: string
}

interface WalletData {
  total_networth_usd: string
  chains: ChainData[]
}

export default function NetWorthPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [chain, setChain] = useState("eth")
  const [loading, setLoading] = useState(false)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const { toast } = useToast()

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const trackWallet = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      })
      return
    }

    if (!isValidEthereumAddress(walletAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (starts with 0x and is 42 characters long)",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log("Tracking wallet:", walletAddress, "on chain:", chain)

      const response = await fetch("/api/net-worth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          chain,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Failed to fetch wallet data")
      }

      const data = await response.json()
      console.log("Received net worth data:", data)

      setWalletData(data)

      toast({
        title: "Success",
        description: "Wallet data retrieved successfully",
      })
    } catch (error) {
      console.error("Error tracking wallet:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to retrieve wallet data. Please check the wallet address and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Wallet Net Worth Tracker</h1>
          <p className="text-muted-foreground">Track your crypto portfolio value across multiple blockchains</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Track Wallet
              </CardTitle>
              <CardDescription>Enter a wallet address and select blockchain to track</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Example address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045</AlertDescription>
              </Alert>

              <form onSubmit={trackWallet} className="space-y-4">
                <div>
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className={!isValidEthereumAddress(walletAddress) && walletAddress ? "border-red-500" : ""}
                    required
                  />
                  {walletAddress && !isValidEthereumAddress(walletAddress) && (
                    <p className="text-sm text-red-500 mt-1">Invalid Ethereum address format</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="chain-select">Select Blockchain</Label>
                  <Select value={chain} onValueChange={setChain}>
                    <SelectTrigger id="chain-select">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eth">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="bsc">BSC</SelectItem>
                      <SelectItem value="avalanche">Avalanche</SelectItem>
                      <SelectItem value="fantom">Fantom</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !isValidEthereumAddress(walletAddress)}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Tracking Wallet...
                    </>
                  ) : (
                    "Track Wallet"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            {loading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-center space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium">Tracking Wallet on the Blockchain</p>
                    <p className="text-sm text-muted-foreground">This may take a few moments...</p>
                  </div>
                </CardContent>
              </Card>
            ) : walletData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Net Worth</CardTitle>
                  <CardDescription>Detailed breakdown of your wallet value</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Total Net Worth</div>
                    <div className="text-3xl font-bold">{walletData.total_networth_usd}</div>
                  </div>

                  <div className="space-y-4">
                    {walletData.chains?.map((chainData, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2">Chain: {chainData.chain}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Native Balance:</div>
                          <div className="text-right font-medium">{chainData.native_balance}</div>

                          <div>Native Value:</div>
                          <div className="text-right font-medium">{chainData.native_balance_usd}</div>

                          <div>Token Value:</div>
                          <div className="text-right font-medium">{chainData.token_balance_usd}</div>

                          <div className="font-semibold">Net Worth:</div>
                          <div className="text-right font-semibold">{chainData.networth_usd}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <Wallet className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Enter a wallet address to track</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track your crypto portfolio across multiple blockchains
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
