"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Copy, Loader2, RefreshCw } from "lucide-react"

export default function WalletGeneratePage() {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateWallet = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/wallet-generate")

      if (!response.ok) {
        throw new Error("Failed to generate wallet")
      }

      const data = await response.json()
      setSeedPhrase(data.seedPhrase)

      toast({
        title: "Success",
        description: "Wallet seed phrase generated successfully",
      })
    } catch (error) {
      console.error("Error generating wallet:", error)
      toast({
        title: "Error",
        description: "Failed to generate wallet seed phrase",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copySeedPhrase = () => {
    if (!seedPhrase) return

    navigator.clipboard.writeText(seedPhrase)
    toast({
      title: "Copied",
      description: "Seed phrase copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Crypto Wallet Generator</h1>
          <p className="text-muted-foreground">Generate a secure seed phrase for your crypto wallet</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Seed Phrase Generator</CardTitle>
              <CardDescription>Generate a secure 12-word seed phrase for your crypto wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={generateWallet} className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Crypto Wallet
                  </>
                )}
              </Button>

              {seedPhrase && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Your Seed Phrase:</h3>
                      <Button variant="ghost" size="sm" onClick={copySeedPhrase}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-background rounded border font-mono text-sm break-all">{seedPhrase}</div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Important Security Notice:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Store this seed phrase in a secure location</li>
                        <li>• Never share it with anyone</li>
                        <li>• Anyone with this phrase can access your wallet</li>
                        <li>• Write it down on paper and store it safely</li>
                        <li>• Do not store it digitally or take screenshots</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                <p>This tool generates a cryptographically secure seed phrase using industry-standard methods.</p>
                <p className="mt-1">
                  Always verify the security of any wallet generation tool before using it with real funds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
