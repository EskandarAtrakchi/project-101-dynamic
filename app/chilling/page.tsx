"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react"

export default function ChillingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("Chill Crypto Vibes")

  const playlists = [
    {
      name: "Crypto Trading Beats",
      description: "Perfect background music for trading sessions",
      tracks: 25,
      duration: "1h 45m",
    },
    {
      name: "DeFi Lounge",
      description: "Smooth beats for DeFi research",
      tracks: 18,
      duration: "1h 20m",
    },
    {
      name: "Blockchain Chill",
      description: "Relaxing tunes for blockchain development",
      tracks: 32,
      duration: "2h 15m",
    },
    {
      name: "NFT Vibes",
      description: "Creative energy for NFT creation",
      tracks: 22,
      duration: "1h 35m",
    },
  ]

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Chilling Zone</h1>
          <p className="text-muted-foreground">Relax with curated playlists while you trade and research</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Music Player */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                    <Music className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="font-semibold">{currentTrack}</h3>
                  <p className="text-sm text-muted-foreground">Crypto Lofi Collective</p>
                </div>

                <div className="space-y-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-1/3"></div>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1:23</span>
                    <span>3:45</span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button variant="ghost" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button onClick={togglePlay} size="icon" className="h-12 w-12">
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlists */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Curated Playlists</CardTitle>
                <CardDescription>Handpicked playlists for different crypto activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {playlists.map((playlist, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{playlist.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{playlist.tracks} tracks</span>
                            <span>{playlist.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spotify Integration */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Spotify Integration</CardTitle>
                <CardDescription>Connect your Spotify account for a better experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Connect to Spotify</h3>
                  <p className="text-muted-foreground mb-4">
                    Link your Spotify account to access your personal playlists and enjoy seamless music streaming
                  </p>
                  <Button className="bg-green-500 hover:bg-green-600">Connect Spotify Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
