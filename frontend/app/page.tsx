"use client"

interface EthereumWindow extends Window {
  ethereum?: {
    on: (event: string, callback: (accounts: string[]) => void) => void;
    removeAllListeners: (event: string) => void;
    request: (args: { method: string }) => Promise<void>;
  };
}

declare const window: EthereumWindow;

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Plus, RefreshCw, Wallet } from 'lucide-react'
import { ConnectWallet } from "@/components/connect-wallet"
import { SubscriptionCard } from "@/components/subscription-card"
import { contractABI, contractAddress } from "@/lib/contract"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { Spotlight } from "@/components/ui/spotlight"
import { Meteors } from "@/components/ui/meteors"
import { Particles } from "@/components/ui/particles"

export default function Home() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState([])
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.listAccounts()

          if (accounts.length > 0) {
            setAccount(accounts[0])
            await fetchSubscriptions(provider)
          }
        }
        setLoading(false)
      } catch (err) {
        console.error("Connection error:", err)
        setError("Failed to connect to wallet")
        setLoading(false)
      }
    }

    checkConnection()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          if (window.ethereum) {
            fetchSubscriptions(new ethers.providers.Web3Provider(window.ethereum))
          }
        } else {
          setAccount("")
          setSubscriptions([])
        }
      })
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  const fetchSubscriptions = async (provider) => {
    try {
      setRefreshing(true)
      const contract = new ethers.Contract(contractAddress, contractABI, provider)
      const subs = await contract.getMySubscriptions()
      setSubscriptions(subs)
      setError("")
    } catch (err) {
      console.error("Error fetching subscriptions:", err)
      setError("Failed to fetch subscriptions")
      toast.error("Failed to fetch your subscriptions", {
        description: "Please try again later",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleAddSubscription = () => {
    router.push("/new")
  }

  const handleRefresh = async () => {
    if (!account) return
    await fetchSubscriptions(new ethers.providers.Web3Provider(window.ethereum))
  }

  const handleConnect = (address) => {
    setAccount(address)
    fetchSubscriptions(new ethers.providers.Web3Provider(window.ethereum))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-dot-pattern dark:bg-dot-pattern-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 dark:from-background dark:via-background dark:to-background/50 pointer-events-none"></div>
      <Particles className="absolute inset-0 pointer-events-none" quantity={100} />

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40 dark:border-border/20">
        <div className="container mx-auto py-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="mr-3 bg-gradient-to-br from-primary to-purple-400 p-2 rounded-xl shadow-lg shadow-primary/20">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  SubScrypt
                </h1>
                {account && (
                  <p className="text-xs text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ThemeToggle />
              {account ? (
                <>
                  <Button
                    onClick={handleRefresh}
                    variant="ghost"
                    size="icon"
                    disabled={refreshing}
                    className="rounded-full hover:bg-primary/10"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  </Button>
                  <Button
                    onClick={handleAddSubscription}
                    className="rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Subscription
                  </Button>
                </>
              ) : (
                <ConnectWallet onConnect={handleConnect} />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 sm:px-6 relative">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(139, 92, 246, 0.15)"
        />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="mb-6 border border-destructive/20 animate-pulse">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="skeleton-pulse h-12 w-12 rounded-xl bg-primary/10"></div>
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-6 w-3/4 bg-primary/10" />
                          <Skeleton className="h-4 w-1/2 bg-primary/5" />
                        </div>
                      </div>
                      <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full bg-primary/5" />
                        <Skeleton className="h-4 w-full bg-primary/5" />
                        <Skeleton className="h-2 w-full bg-primary/10 rounded-full mt-2" />
                      </div>
                      <div className="pt-4 flex gap-2">
                        <Skeleton className="h-10 w-full bg-primary/10 rounded-lg" />
                        <Skeleton className="h-10 w-full bg-primary/10 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : account && subscriptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm overflow-hidden relative">
                <Meteors number={20} />
                <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center relative z-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-primary to-purple-400 p-6 rounded-full shadow-xl shadow-primary/20">
                      <Wallet className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    Start Managing Your Subscriptions
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Track all your subscriptions on the blockchain and never miss a payment again.
                  </p>
                  <Button
                    onClick={handleAddSubscription}
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  >
                    <Plus className="mr-2 h-5 w-5" /> Add Your First Subscription
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {subscriptions.map((subscription, index) => (
                <motion.div key={index} variants={item} layout>
                  <SubscriptionCard subscription={subscription} onRefresh={handleRefresh} />
                </motion.div>
              ))}
            </motion.div>
          )}
      </main>
    </div>
  )
}
