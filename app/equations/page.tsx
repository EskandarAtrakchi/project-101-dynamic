"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Coin {
  id: string
  name: string
  symbol: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
  image: string
}

interface HalvingData {
  current_block?: number
  next_halving_block?: number
  blocks_until_halving?: number
  estimated_days_until_halving?: number
  estimated_date?: string
  note?: string
}

export default function EquationsPage() {
  const [coinsData, setCoinsData] = useState<Coin[]>([])
  const [halvingData, setHalvingData] = useState<HalvingData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const coinsResponse = await fetch("/api/coins")
        if (coinsResponse.ok) {
          const coinsResult = await coinsResponse.json()
          setCoinsData(coinsResult)
        }

        const halvingResponse = await fetch("/api/next-halving")
        if (halvingResponse.ok) {
          const halvingResult = await halvingResponse.json()
          setHalvingData(halvingResult)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch blockchain data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const pivotPointsData = [
    { term: "P", equation: "(H + L + C) / 3", description: "Pivot Point" },
    { term: "R1", equation: "(2 x P) - L", description: "Resistance 1" },
    { term: "R2", equation: "P + H - L", description: "Resistance 2" },
    { term: "R3", equation: "H + 2 x (P - L)", description: "Resistance 3" },
    { term: "S1", equation: "(2 x P) - H", description: "Support 1" },
    { term: "S2", equation: "P - H + L", description: "Support 2" },
    { term: "S3", equation: "L - 2 x (H - P)", description: "Support 3" },
  ]

  const cryptoSectors = [
    {
      sector: "Social Media",
      coins: ["Polygon MATIC", "Hive (HIVE)", "Steem (STEEM)", "LBRY Credits (LBC)", "Minds (MINDS)"],
    },
    {
      sector: "Game Fi",
      coins: ["Axie Infinity (AXS)", "Decentraland (MANA)", "Enjin Coin (ENJ)", "The Sandbox (SAND)", "Chiliz (CHZ)"],
    },
    {
      sector: "AI",
      coins: [
        "SingularityNET (AGI)",
        "Numerai (NMR)",
        "Fetch.ai (FET)",
        "Ocean Protocol (OCEAN)",
        "DeepBrain Chain (DBC)",
      ],
    },
    {
      sector: "Infrastructure",
      coins: ["Internet Computer (ICP)", "Hedera (HBAR)", "Polkadot (DOT)", "Avalanche (AVAX)", "NEAR Protocol (NEAR)"],
    },
    {
      sector: "RWA & Payments",
      coins: ["Bitcoin (BTC)", "Ripple (XRP)", "Stellar (XLM)", "Algorand (ALGO)", "MakerDAO (MKR)"],
    },
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Trading Equations & Data</h1>
          <p className="text-muted-foreground">Professional trading formulas and blockchain analytics</p>
        </div>

        <Tabs defaultValue="pivot-points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pivot-points">Pivot Points</TabsTrigger>
            <TabsTrigger value="narratives">Market Narratives</TabsTrigger>
            <TabsTrigger value="blockchain-data">Blockchain Data</TabsTrigger>
          </TabsList>

          <TabsContent value="pivot-points">
            <Card>
              <CardHeader>
                <CardTitle>Floor Pivot Points</CardTitle>
                <CardDescription>Standard pivot point calculations for technical analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Equation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pivotPointsData.map((item) => (
                      <TableRow key={item.term}>
                        <TableCell>{item.term}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">{item.equation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="narratives">
            <Card>
              <CardHeader>
                <CardTitle>2023-2026 Market Narratives</CardTitle>
                <CardDescription>Cryptocurrencies organized by sector and use case</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {cryptoSectors.map((sector) => (
                    <div key={sector.sector} className="space-y-3">
                      <h3 className="text-lg font-semibold">{sector.sector}</h3>
                      <div className="flex flex-wrap gap-2">
                        {sector.coins.map((coin) => (
                          <Badge key={coin} variant="secondary">
                            {coin}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain-data">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="ml-2">Loading blockchain data...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Coin Market Data</CardTitle>
                    <CardDescription>Latest prices and market caps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Coin</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Market Cap</TableHead>
                          <TableHead>24h %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coinsData.map((coin) => (
                          <TableRow key={coin.id}>
                            <TableCell className="font-medium">{coin.name}</TableCell>
                            <TableCell>${coin.current_price.toLocaleString()}</TableCell>
                            <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
                            <TableCell
                              className={coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}
                            >
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Halving Details</CardTitle>
                    <CardDescription>Bitcoin halving countdown and metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {halvingData.current_block && (
                          <TableRow>
                            <TableCell>Current Block</TableCell>
                            <TableCell>{halvingData.current_block.toLocaleString()}</TableCell>
                          </TableRow>
                        )}
                        {halvingData.next_halving_block && (
                          <TableRow>
                            <TableCell>Next Halving Block</TableCell>
                            <TableCell>{halvingData.next_halving_block.toLocaleString()}</TableCell>
                          </TableRow>
                        )}
                        {halvingData.blocks_until_halving && (
                          <TableRow>
                            <TableCell>Blocks Until Halving</TableCell>
                            <TableCell>{halvingData.blocks_until_halving.toLocaleString()}</TableCell>
                          </TableRow>
                        )}
                        {halvingData.estimated_days_until_halving && (
                          <TableRow>
                            <TableCell>Estimated Days</TableCell>
                            <TableCell>{halvingData.estimated_days_until_halving} days</TableCell>
                          </TableRow>
                        )}
                        {halvingData.estimated_date && (
                          <TableRow>
                            <TableCell>Estimated Date</TableCell>
                            <TableCell>{halvingData.estimated_date}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {halvingData.note && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{halvingData.note}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
