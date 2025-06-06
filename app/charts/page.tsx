"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Search, AlertCircle, TrendingUp, Gauge } from "lucide-react"

const coinSymbolToIdMap: { [key: string]: string } = {
  btc: "bitcoin",
  eth: "ethereum",
  near: "near",
  sol: "solana",
  ada: "cardano",
  dot: "polkadot",
  avax: "avalanche-2",
  bnb: "binancecoin",
  xrp: "ripple",
  doge: "dogecoin",
  link: "chainlink",
  ltc: "litecoin",
  sui: "sui",
    trx: "tron",
  matic: "matic-network",
  shib: "shiba-inu",
  uni: "uniswap",
  atom: "cosmos",
  etc: "ethereum-classic",
  xlm: "stellar",
  bch: "bitcoin-cash",
  xmr: "monero",
  egld: "elrond-erd-2",
  aave: "aave",
  axs: "axie-infinity",
  sand: "the-sandbox",
  mana: "decentraland",
  gala: "gala",
  hbar: "hedera-hashgraph",
  icp: "internet-computer",
  apt: "aptos",
  arb: "arbitrum",
  op: "optimism",
  chz: "chiliz",
  qnt: "quant-network",
  flow: "flow",
  render: "render-token",
  ldo: "lido-dao",
  imx: "immutable-x",
  enj: "enjincoin",
  cro: "crypto-com-chain",
  ftm: "fantom",
  gmx: "gmx",
  nexo: "nexo",
  zec: "zcash",
  dash: "dash",
  waves: "waves",
  crv: "curve-dao-token",
  snx: "synthetix-network-token",
  comp: "compound-governance-token",
  bal: "balancer",
  kava: "kava",
  celo: "celo",
  rlc: "iexec-rlc",
  stx: "stacks",
  ksm: "kusama",
  mina: "mina-protocol",
  ankr: "ankr",
  hot: "holo",
  btt: "bittorrent",
  spell: "spell-token",
  sushiswap: "sushi",
  omg: "omisego",
  bat: "basic-attention-token",
  dodo: "dodo",
  ocean: "ocean-protocol",
  dent: "dent",
  vet: "vechain",
  zk: "zkspace",
  dydx: "dydx",
  skale: "skale",
  reef: "reef",
  fetch: "fetch-ai",
  mask: "mask-network",
  woo: "woo-network",
  api3: "api3",
  aleph: "aleph",
  gas: "gas",
  wan: "wanchain",
  sys: "syscoin",
  rad: "radicle",
  pols: "polkastarter",
  perp: "perpetual-protocol",
  nmr: "numeraire",
  dnt: "district0x",
  xyo: "xyo-network",
  cvc: "civic",
  powr: "power-ledger",
  req: "request-network",
  ubt: "unibright",
  xvs: "venus",
  t: "threshold",
  keep: "keep-network",
  rari: "rari-governance-token",
  audio: "audius",
  yfi: "yearn-finance",
  ren: "ren",
  storj: "storj",
  ntvrk: "ntvrk",
  agix: "singularitynet",
  baby: "baby-doge-coin",
  floki: "floki-inu",
  pepe: "pepe",
  bonk: "bonk",
  memecoin: "memecoin",
  weth: "weth",
  usdt: "tether",
  usdc: "usd-coin",
  dai: "dai",
  frax: "frax",
  tusd: "true-usd",
  gusd: "gemini-dollar",
  lrc: "loopring",
  xvg: "verge",
  zrx: "0x",
  qtum: "qtum",
  iota: "iota",
  algo: "algorand",
  eos: "eos",
  xtz: "tezos",
  fil: "filecoin",
  bsv: "bitcoin-cash-sv",
}

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
      if (!response.ok) throw new Error("Failed to fetch fear and greed data")
      const data = await response.json()
      setFearGreedData(data)
      toast({ title: "Success", description: "Fear and Greed Index data loaded successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to load Fear and Greed Index data", variant: "destructive" })
    }
  }

  const startLoadingTickerData = async () => {
    try {
      const coinId = coinSymbolToIdMap[searchInput.toLowerCase()]
      if (!coinId) {
        toast({
          title: "Invalid Symbol",
          description: `No CoinGecko ID found for symbol "${searchInput}"`,
          variant: "destructive",
        })
        return
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
      )
      if (!response.ok) throw new Error("Failed to fetch ticker data")

      const data = await response.json()
      if (data.length === 0) {
        toast({
          title: "Not Found",
          description: `No data found for "${searchInput}"`,
          variant: "destructive",
        })
        return
      }

      setTickerData(data)
      toast({ title: "Success", description: "Ticker data loaded successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to load ticker data", variant: "destructive" })
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
                <iframe
                  src="https://s.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=D&theme=dark"
                  className="w-full h-full"
                  title="TradingView Chart"
                ></iframe>
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
                    <div className="text-center">
                      <div className="text-4xl font-bold">{fearGreedData.data[0].value}</div>
                      <div className="text-xl font-semibold">{fearGreedData.data[0].value_classification}</div>
                      <div className="text-sm text-muted-foreground">
                        Last updated:{" "}
                        {new Date(Number.parseInt(fearGreedData.data[0].timestamp) * 1000).toLocaleString()}
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
                        <img
                          src="https://alternative.me/images/fng/crypto-fear-and-greed-index-2020-5-13.png"
                          alt="Fear Index"
                          className="w-full h-auto"
                        />
                      )}
                      {showGreedIndex && (
                        <img
                          src="https://alternative.me/crypto/fear-and-greed-index.png"
                          alt="Greed Index"
                          className="w-full h-auto"
                        />
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
                  <Input
                    placeholder="Enter symbol (e.g., BTC, ETH, NEAR)"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
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
                        {tickerData.map((coin, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-2">{coin.name}</td>
                            <td className="py-2">{coin.symbol.toUpperCase()}</td>
                            <td className="text-right py-2">${coin.current_price.toFixed(6)}</td>
                            <td
                              className={`text-right py-2 ${
                                coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {coin.price_change_percentage_24h?.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p>Search for a cryptocurrency by symbol to compare market data</p>
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
