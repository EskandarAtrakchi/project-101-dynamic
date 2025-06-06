"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, TrendingUp, TrendingDown, Search, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PortfolioItem {
  id: string
  name: string
  symbol: string
  amount: number
  buyPrice: number
  currentPrice: number
}

interface WalletToken {
  token_address: string
  name: string
  symbol: string
  balance: string
  decimals: number
  usd_price?: number
  usd_value?: number
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedChain, setSelectedChain] = useState("eth")
  const [walletTokens, setWalletTokens] = useState<WalletToken[]>([])
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [coinName, setCoinName] = useState("")
  const [coinSymbol, setCoinSymbol] = useState("")
  const [amount, setAmount] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const { toast } = useToast()

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const addToPortfolio = () => {
    if (!coinName || !coinSymbol || !amount || !buyPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      name: coinName,
      symbol: coinSymbol.toUpperCase(),
      amount: Number.parseFloat(amount),
      buyPrice: Number.parseFloat(buyPrice),
      currentPrice: Number.parseFloat(buyPrice) * (1 + (Math.random() - 0.5) * 0.2), // Mock current price
    }

    setPortfolio([...portfolio, newItem])
    setCoinName("")
    setCoinSymbol("")
    setAmount("")
    setBuyPrice("")

    toast({
      title: "Success",
      description: "Coin added to portfolio",
    })
  }

  const loadWalletTokens = async () => {
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

    setLoadingWallet(true)

    try {
      console.log("Loading wallet tokens for:", walletAddress, "on chain:", selectedChain)

      const response = await fetch(`/api/portfolio/${walletAddress}?chain=${selectedChain}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Failed to fetch wallet tokens")
      }

      const data = await response.json()
      console.log("Received wallet data:", data)

      setWalletTokens(data.result || [])

      toast({
        title: "Success",
        description: `Loaded ${data.result?.length || 0} tokens from wallet`,
      })
    } catch (error) {
      console.error("Error loading wallet tokens:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load wallet tokens. Please check the address and try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingWallet(false)
    }
  }

  const addTokenToPortfolio = (token: WalletToken) => {
    const balance = Number.parseFloat(token.balance) / Math.pow(10, token.decimals)
    const price = token.usd_price || 0

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      name: token.name,
      symbol: token.symbol,
      amount: balance,
      buyPrice: price,
      currentPrice: price,
    }

    setPortfolio([...portfolio, newItem])

    toast({
      title: "Success",
      description: `${token.symbol} added to portfolio`,
    })
  }

  const removeFromPortfolio = (id: string) => {
    setPortfolio(portfolio.filter((item) => item.id !== id))
    toast({
      title: "Removed",
      description: "Coin removed from portfolio",
    })
  }

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => total + item.amount * item.currentPrice, 0)
  }

  const calculateTotalInvestment = () => {
    return portfolio.reduce((total, item) => total + item.amount * item.buyPrice, 0)
  }

  const calculateProfitLoss = () => {
    return calculateTotalValue() - calculateTotalInvestment()
  }

  const calculateProfitLossPercentage = () => {
    const investment = calculateTotalInvestment()
    if (investment === 0) return 0
    return (calculateProfitLoss() / investment) * 100
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Portfolio Tracker</h1>
          <p className="text-muted-foreground">Track your cryptocurrency investments and performance</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Manual Add */}
            <Card>
              <CardHeader>
                <CardTitle>Add to Portfolio</CardTitle>
                <CardDescription>Manually add a cryptocurrency to your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="coin-name">Coin Name</Label>
                  <Input
                    id="coin-name"
                    placeholder="e.g., Bitcoin"
                    value={coinName}
                    onChange={(e) => setCoinName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="coin-symbol">Symbol</Label>
                  <Input
                    id="coin-symbol"
                    placeholder="e.g., BTC"
                    value={coinSymbol}
                    onChange={(e) => setCoinSymbol(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="buy-price">Buy Price ($)</Label>
                  <Input
                    id="buy-price"
                    type="number"
                    placeholder="0.00"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                  />
                </div>

                <Button onClick={addToPortfolio} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Portfolio
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Import */}
            <Card>
              <CardHeader>
                <CardTitle>Import from Wallet</CardTitle>
                <CardDescription>Load tokens from a wallet address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="break-all text-sm leading-tight">
                      Enter a valid Ethereum address (e.g., 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)
                  </AlertDescription>
                </Alert>


                <div>
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className={!isValidEthereumAddress(walletAddress) && walletAddress ? "border-red-500" : ""}
                  />
                  {walletAddress && !isValidEthereumAddress(walletAddress) && (
                    <p className="text-sm text-red-500 mt-1">Invalid Ethereum address format</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="chain-select">Select Blockchain</Label>
                  <Select value={selectedChain} onValueChange={setSelectedChain}>
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

                <Button
                  onClick={loadWalletTokens}
                  className="w-full"
                  disabled={loadingWallet || !isValidEthereumAddress(walletAddress)}
                >
                  {loadingWallet ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Load Wallet Tokens
                    </>
                  )}
                </Button>

                {walletTokens.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <h4 className="font-medium">Wallet Tokens ({walletTokens.length}):</h4>
                    {walletTokens.slice(0, 10).map((token, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-muted-foreground">
                            {(Number.parseFloat(token.balance) / Math.pow(10, token.decimals)).toFixed(4)}
                          </div>
                          {token.usd_value && (
                            <div className="text-xs text-green-600">${token.usd_value.toFixed(2)}</div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => addTokenToPortfolio(token)}>
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${calculateTotalValue().toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${calculateTotalInvestment().toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total Investment</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div
                    className={`text-2xl font-bold flex items-center ${
                      calculateProfitLoss() >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {calculateProfitLoss() >= 0 ? (
                      <TrendingUp className="h-5 w-5 mr-1" />
                    ) : (
                      <TrendingDown className="h-5 w-5 mr-1" />
                    )}
                    ${Math.abs(calculateProfitLoss()).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {calculateProfitLoss() >= 0 ? "Profit" : "Loss"} ({calculateProfitLossPercentage().toFixed(2)}%)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Items */}
            <Card>
              <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>
                  {portfolio.length === 0 ? "No coins in portfolio yet" : `${portfolio.length} coins in portfolio`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Add your first cryptocurrency to start tracking your portfolio</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolio.map((item) => {
                      const profitLoss = (item.currentPrice - item.buyPrice) * item.amount
                      const profitLossPercentage = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100

                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{item.name}</h3>
                              <span className="text-sm text-muted-foreground">({item.symbol})</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.amount} coins @ ${item.buyPrice.toFixed(2)}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold">${(item.amount * item.currentPrice).toFixed(2)}</div>
                            <div
                              className={`text-sm flex items-center justify-end ${
                                profitLoss >= 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {profitLoss >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromPortfolio(item.id)}
                            className="ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
