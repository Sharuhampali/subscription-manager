"use client"

import { useState } from "react"

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: unknown
  }
}
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, ArrowLeft, Calendar, Clock, CreditCard, Wallet } from 'lucide-react'
import { contractABI, contractAddress } from "@/lib/contract"
import { motion } from "framer-motion"
import { Spotlight } from "@/components/ui/spotlight"
import { Particles } from "@/components/ui/particles"

export default function NewSubscription() {
  const router = useRouter()
  const [serviceName, setServiceName] = useState("")
  const [duration, setDuration] = useState("30")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError("")

    if (!serviceName) {
      setError("Please enter a service name")
      return
    }

    try {
      setLoading(true)

      if (!window.ethereum) {
        toast.error("Wallet not found", {
          description: "Please install MetaMask or another Ethereum wallet",
        })
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      // Convert duration from days to seconds
      const durationInSeconds = Number.parseInt(duration) * 24 * 60 * 60

      toast.loading("Adding subscription", {
        description: "Please confirm the transaction in your wallet",
      })

      const tx = await contract.subscribe(serviceName, durationInSeconds)
      
      toast.loading("Transaction submitted", {
        description: "Please wait for the transaction to be confirmed",
      })
      
      await tx.wait()

      toast.success("Subscription added", {
        description: `You've successfully added ${serviceName} to your subscriptions`,
      })

      router.push("/")
    } catch (err) {
      console.error("Error adding subscription:")
      
        console.error(err)
      
      toast.error("Failed to add subscription", {
        description: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dot-pattern dark:bg-dot-pattern-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 dark:from-background dark:via-background dark:to-background/50 pointer-events-none"></div>
      <Particles className="absolute inset-0 pointer-events-none" quantity={100} />

      <div className="container mx-auto py-10 px-4 sm:px-6 relative">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(139, 92, 246, 0.15)"
        />
        
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-8 group rounded-full hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-400/5"></div>

            <div className="relative p-6 pb-0">
              <div className="flex items-center mb-4">
                <div className="mr-3 bg-gradient-to-br from-primary to-purple-400 p-2 rounded-xl shadow-lg shadow-primary/20">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  New Subscription
                </h2>
              </div>

              <p className="text-muted-foreground mb-6">
                Enter the details of your subscription to track it on the blockchain
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 p-6 pt-4 relative">
                {error && (
                  <Alert variant="destructive" className="border border-destructive/20 animate-pulse">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="serviceName" className="text-sm font-medium">
                    Service Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="serviceName"
                      placeholder="Netflix, Spotify, etc."
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-300"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="duration" className="flex items-center text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2 text-primary" /> Billing Cycle
                    </Label>
                    <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">{duration} days</span>
                  </div>

                  <div className="relative pt-2">
                    <Slider
                      id="duration"
                      min={1}
                      max={365}
                      step={1}
                      value={[Number.parseInt(duration)]}
                      onValueChange={(value) => setDuration(value[0].toString())}
                      disabled={loading}
                      className="py-2"
                    />
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                      <span>Daily</span>
                      <span>Monthly</span>
                      <span>Yearly</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 rounded-xl border border-primary/20 p-4 bg-primary/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-primary">Subscription Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    You are adding a subscription for <span className="font-medium">{serviceName || "..."}</span> with a
                    billing cycle of <span className="font-medium">{duration} days</span>.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This information will be stored on the blockchain and can be managed through your dashboard.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="loader-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="ml-2">Adding Subscription</span>
                    </div>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Add Subscription
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
