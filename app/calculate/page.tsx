"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Calculator, TrendingUp, BarChart3, Percent } from "lucide-react"

interface Transaction {
  amount: number
  price: number
  transactionValue: number
}

export default function CalculatePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [coinAmount, setCoinAmount] = useState("")
  const [coinPrice, setCoinPrice] = useState("")
  const [incrementNumber, setIncrementNumber] = useState("")
  const [incrementPercentage, setIncrementPercentage] = useState("")
  const [currentNumber, setCurrentNumber] = useState(0)
  const { toast } = useToast()

  const addTransaction = () => {
    const amount = Number.parseFloat(coinAmount)
    const price = Number.parseFloat(coinPrice)

    if (isNaN(amount) || isNaN(price)) {
      toast({
        title: "Error",
        description: "Please enter valid numbers for both fields",
        variant: "destructive",
      })
      return
    }

    const transactionValue = amount * price
    const newTransaction: Transaction = { amount, price, transactionValue }

    setTransactions([...transactions, newTransaction])
    setCoinAmount("")
    setCoinPrice("")

    toast({
      title: "Success",
      description: "Transaction added successfully",
    })
  }

  const calculateAverage = () => {
    if (transactions.length === 0) return { averagePrice: 0, totalValue: 0, totalAmount: 0 }

    const totalValue = transactions.reduce((sum, t) => sum + t.transactionValue, 0)
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
    const averagePrice = totalValue / totalAmount

    return { averagePrice, totalValue, totalAmount }
  }

  const handleIncrement = () => {
    const number = Number.parseFloat(incrementNumber)
    const percentage = Number.parseFloat(incrementPercentage)

    if (isNaN(number) || isNaN(percentage)) {
      toast({
        title: "Error",
        description: "Please enter valid numbers",
        variant: "destructive",
      })
      return
    }

    if (currentNumber === 0) {
      setCurrentNumber(number)
    }

    const incrementAmount = (percentage / 100) * (currentNumber || number)
    const newNumber = (currentNumber || number) + incrementAmount
    setCurrentNumber(newNumber)
  }

  const calculateSequenceNode = () => {
    const percentage = prompt("Enter the percentage:")
    const trades = prompt("Number of trades?:")
    const amount = prompt("Enter the amount:")

    if (!percentage || !trades || !amount) return

    const per = Number.parseFloat(percentage) / 100
    const n = Number.parseInt(trades)
    const initialAmount = Number.parseFloat(amount)

    const divisionAdd = initialAmount / n
    let dividedNumber = initialAmount / n

    for (let i = 1; i <= n; i++) {
      dividedNumber = dividedNumber * per
      alert(`Trade ${i}: ${dividedNumber.toFixed(2)}`)
      dividedNumber = dividedNumber + divisionAdd
    }

    dividedNumber = dividedNumber - divisionAdd
    alert(`Total profit: ${(dividedNumber - initialAmount).toFixed(2)}`)
  }

  const downloadTransactions = () => {
    const data = JSON.stringify(transactions, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "crypto_transactions.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const { averagePrice, totalValue, totalAmount } = calculateAverage()

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Crypto Calculators</h1>
          <p className="text-muted-foreground">Advanced calculation tools for crypto trading</p>
        </div>

        <Tabs defaultValue="average-calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="average-calculator">Average Calculator</TabsTrigger>
            <TabsTrigger value="percentage-increment">Percentage Increment</TabsTrigger>
            <TabsTrigger value="sequence-node">Sequence Node</TabsTrigger>
            <TabsTrigger value="divided-equally">Divided Equally</TabsTrigger>
          </TabsList>

          <TabsContent value="average-calculator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Average Buying Price Calculator
                </CardTitle>
                <CardDescription>Calculate your average buying price across multiple transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coin-amount">Coin Amount</Label>
                    <Input
                      id="coin-amount"
                      type="number"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(e.target.value)}
                      placeholder="Enter coin amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coin-price">Price per Coin</Label>
                    <Input
                      id="coin-price"
                      type="number"
                      value={coinPrice}
                      onChange={(e) => setCoinPrice(e.target.value)}
                      placeholder="Enter price per coin"
                    />
                  </div>
                </div>

                <Button onClick={addTransaction} className="w-full">
                  Add Transaction
                </Button>

                {transactions.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">${averagePrice.toFixed(4)}</div>
                          <p className="text-xs text-muted-foreground">Average Price</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">{totalAmount.toFixed(4)}</div>
                          <p className="text-xs text-muted-foreground">Total Coins</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                          <p className="text-xs text-muted-foreground">Total Value</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Button onClick={downloadTransactions} variant="outline" className="w-full">
                      Download Transactions as JSON
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="percentage-increment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Percentage Increment Calculator
                </CardTitle>
                <CardDescription>Calculate compound percentage increases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="increment-number">Starting Number</Label>
                    <Input
                      id="increment-number"
                      type="number"
                      value={incrementNumber}
                      onChange={(e) => setIncrementNumber(e.target.value)}
                      placeholder="Enter starting number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="increment-percentage">Percentage Increase</Label>
                    <Input
                      id="increment-percentage"
                      type="number"
                      value={incrementPercentage}
                      onChange={(e) => setIncrementPercentage(e.target.value)}
                      placeholder="Enter percentage"
                    />
                  </div>
                </div>

                <Button onClick={handleIncrement} className="w-full">
                  Calculate Increment
                </Button>

                {currentNumber > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-center">{currentNumber.toFixed(4)}</div>
                      <p className="text-center text-muted-foreground">Current Result</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sequence-node">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sequence Node Calculator
                </CardTitle>
                <CardDescription>Calculate profit from sequential trading with fixed additions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={calculateSequenceNode} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Sequence Nodes
                </Button>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">How it works:</h4>
                  <p className="text-sm text-muted-foreground">
                    This calculator divides your initial investment equally among trades, applies the percentage return,
                    and adds a fixed amount to each subsequent trade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="divided-equally">
            <Card>
              <CardHeader>
                <CardTitle>Divided Equally Calculator</CardTitle>
                <CardDescription>Calculate profit distribution across equal trade divisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    This feature calculates profit distribution when dividing investments equally among multiple trades
                    with dynamic reallocation.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
