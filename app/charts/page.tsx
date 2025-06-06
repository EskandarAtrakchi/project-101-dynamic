"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Search, AlertCircle, TrendingUp, Gauge } from "lucide-react"

export default function ChartsPage() {
  const [fearGreedData, setFearGreedData] = useState<any>(null)
  const [showFearIndex, setShowFearIndex] = useState(false)
  const [showGreedIndex, setShowGreedIndex] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [tickerData, setTickerData] = useState<any[]>([])
  const { toast } = useToast()

  const loadFearAndGreedData = async () => {
    try {
      const response = await fetch("/api/fear-greed")

      if (!response.ok) {
        throw new Error("Failed to fetch fear and greed data")
      }

      const data = await response.json()
      setFearGreedData(data)

      toast({
        title: "Success",
        description: "Fear and Greed Index data loaded successfully",
      })
    } catch (error) {
      console.error("Error loading fear and greed data:", error)
      toast({
        title: "Error",
        description: "Failed to load Fear and Greed Index data",
        variant: "destructive",
      })
    }
  }

  const startLoadingTickerData = async () => {
    try {
      const response = await fetch("/api/charts")

      if (!response.ok) {
        throw new Error("Failed to fetch ticker data")
      }

      const data = await response.json()

      // Filter data based on search input
      const filteredData = Object.values(data).filter(
        (coin: any) =>
          coin.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
          coin.symbol?.toLowerCase().includes(searchInput.toLowerCase()),
      )

      setTickerData(filteredData.slice(0, 10)) // Limit to 10 results

      toast({
        title: "Success",
        description: "Ticker data loaded successfully",
      })
    } catch (error) {
      console.error("Error loading ticker data:", error)
      toast({
        title: "Error",
        description: "Failed to load ticker data",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Crypto Charts & Data</h1>
          <p className="text-muted-foreground">Real-time cryptocurrency charts and market indicators</p>
        </div>

        <Tabs defaultValue="crypto-bubbles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crypto-bubbles">Crypto Bubbles</TabsTrigger>
            <TabsTrigger value="trading-view">TradingView</TabsTrigger>
            <TabsTrigger value="fear-greed">Fear & Greed</TabsTrigger>
            <TabsTrigger value="currency-compare">Currency Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto-bubbles" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Crypto Bubbles Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[800px]">
                <iframe
                  src="https://cryptobubbles.net"
                  className="w-full h-full border-none"
                  title="Crypto Bubbles"
                ></iframe>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading-view" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>TradingView Chart</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[800px]">
                <div className="tradingview-widget-container h-full">
                  <iframe
                    src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d87&symbol=BINANCE:BTCUSDT&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&hideideas=1&theme=dark&style=1&timezone=exchange&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE%3ABTCUSDT"
                    className="w-full h-full"
                    title="TradingView Chart"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fear-greed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Fear and Greed Index
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={loadFearAndGreedData} className="w-full">
                  Fetch Fear and Greed Index
                </Button>

                {fearGreedData && (
                  <div className="space-y-4">
                    <div className="grid place-items-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{fearGreedData.data[0].value}</div>
                        <div className="text-xl font-semibold">{fearGreedData.data[0].value_classification}</div>
                        <div className="text-sm text-muted-foreground">
                          Last updated:{" "}
                          {new Date(Number.parseInt(fearGreedData.data[0].timestamp) * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button onClick={() => setShowFearIndex(!showFearIndex)} variant="outline">
                        {showFearIndex ? "Hide" : "Show"} Fear Index
                      </Button>
                      <Button onClick={() => setShowGreedIndex(!showGreedIndex)} variant="outline">
                        {showGreedIndex ? "Hide" : "Show"} Greed Index
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {showFearIndex && (
                        <div className="flex justify-center">
                          <img
                            src="https://alternative.me/images/fng/crypto-fear-and-greed-index-2020-5-13.png"
                            alt="Crypto Fear Index"
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}
                      {showGreedIndex && (
                        <div className="flex justify-center">
                          <img
                            src="https://alternative.me/crypto/fear-and-greed-index.png"
                            alt="Latest Crypto Greed Index"
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="currency-compare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Crypto Ticker Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Search by name or symbol (e.g., BTC, ETH, NEAR)"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={startLoadingTickerData}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {tickerData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Symbol</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">24h Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickerData.map((coin, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{coin.name}</td>
                            <td className="py-2">{coin.symbol}</td>
                            <td className="text-right py-2">${coin.price.toFixed(2)}</td>
                            <td
                              className={`text-right py-2 ${coin.change_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {coin.change_24h >= 0 ? "+" : ""}
                              {coin.change_24h.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p>Search for cryptocurrencies to see their current prices and data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
