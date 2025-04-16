"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { format, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, CheckCircle, Clock, DollarSign, XCircle } from "lucide-react"
import { contractABI, contractAddress } from "@/lib/contract"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function SubscriptionCard({ subscription, onRefresh }) {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState("")

  const formatDate = (timestamp) => {
    return format(new Date(Number(timestamp) * 1000), "PPP")
  }

  const formatDuration = (durationInSeconds) => {
    const days = Math.floor(Number(durationInSeconds) / (24 * 60 * 60))
    return `${days} days`
  }

  const getTimeUntilNextPayment = (timestamp) => {
    const nextPaymentDate = new Date(Number(timestamp) * 1000)
    return formatDistanceToNow(nextPaymentDate, { addSuffix: true })
  }

  const getProgressUntilNextPayment = () => {
    const now = Date.now() / 1000
    const nextPaymentDue = Number(subscription.nextPaymentDue)
    const previousPaymentDue = nextPaymentDue - Number(subscription.duration)

    // If next payment is in the past, return 100%
    if (now > nextPaymentDue) return 100

    // Calculate progress
    const totalDuration = nextPaymentDue - previousPaymentDue
    const elapsed = now - previousPaymentDue
    return Math.min(Math.floor((elapsed / totalDuration) * 100), 100)
  }

  const isPaymentDue = () => {
    const now = Date.now() / 1000
    return now > Number(subscription.nextPaymentDue)
  }

  const getServiceColor = () => {
    // Generate a consistent color based on the service name
    const hash = subscription.serviceName.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    const h = Math.abs(hash) % 360
    return `hsl(${h}, 70%, 60%)`
  }

  const getServiceInitial = () => {
    return subscription.serviceName.charAt(0).toUpperCase()
  }

  const handleCancel = async () => {
    try {
      setLoading(true)
      setAction("cancel")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      toast.loading("Cancelling subscription", {
        description: "Please confirm the transaction in your wallet",
      })

      const tx = await contract.cancelSubscription(subscription.serviceName)

      toast.loading("Transaction submitted", {
        description: "Please wait for the transaction to be confirmed",
      })

      await tx.wait()

      toast.success("Subscription cancelled", {
        description: `You've successfully cancelled your ${subscription.serviceName} subscription`,
      })

      onRefresh()
    } catch (err) {
      console.error("Error cancelling subscription:", err)
      toast.error("Failed to cancel subscription", {
        description: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogPayment = async () => {
    try {
      setLoading(true)
      setAction("payment")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      toast.loading("Processing payment", {
        description: "Please confirm the transaction in your wallet",
      })

      const tx = await contract.logPayment(subscription.serviceName)

      toast.loading("Transaction submitted", {
        description: "Please wait for the transaction to be confirmed",
      })

      await tx.wait()

      toast.success("Payment logged", {
        description: `Payment for ${subscription.serviceName} has been recorded`,
      })

      onRefresh()
    } catch (err) {
      console.error("Error logging payment:", err)
      toast.error("Failed to log payment", {
        description: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  const serviceColor = getServiceColor()
  const serviceInitial = getServiceInitial()

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300",
        subscription.active ? "" : "opacity-75",
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${serviceColor}, var(--primary))` }}
      ></div>

      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)` }}
          >
            {serviceInitial}
          </motion.div>

          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{subscription.serviceName}</h3>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Started {formatDate(subscription.startTime)}
                </p>
              </div>

              <Badge
                variant={subscription.active ? (isPaymentDue() ? "destructive" : "default") : "secondary"}
                className={cn(
                  "transition-all duration-300",
                  subscription.active && !isPaymentDue()
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "",
                  isPaymentDue() ? "animate-pulse" : "",
                )}
              >
                {subscription.active ? (isPaymentDue() ? "Payment Due" : "Active") : "Cancelled"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Billing Cycle:
            </span>
            <span className="font-medium">{formatDuration(subscription.duration)}</span>
          </div>

          {subscription.active && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" /> Next Payment:
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={cn("font-medium", isPaymentDue() ? "text-destructive" : "")}>
                        {getTimeUntilNextPayment(subscription.nextPaymentDue)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatDate(subscription.nextPaymentDue)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative pt-1">
                <Progress
                  value={getProgressUntilNextPayment()}
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    background: "rgba(var(--primary), 0.2)",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${getProgressUntilNextPayment()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            {subscription.active ? (
              isPaymentDue() ? (
                <div className="flex items-center text-destructive text-sm">
                  <XCircle className="h-4 w-4 mr-1" /> Payment overdue
                </div>
              ) : (
                <div className="flex items-center text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" /> Subscription active
                </div>
              )
            ) : (
              <div className="flex items-center text-muted-foreground text-sm">
                <XCircle className="h-4 w-4 mr-1" /> Subscription cancelled
              </div>
            )}
          </div>
        </div>

        {subscription.active && (
          <div className="flex justify-between gap-3 mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-lg border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
                  disabled={loading && action === "cancel"}
                >
                  {loading && action === "cancel" ? (
                    <div className="flex items-center">
                      <div className="loader-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="ml-2">Cancelling</span>
                    </div>
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card/95 backdrop-blur-md border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel your subscription to {subscription.serviceName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-lg">No, keep it</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="rounded-lg bg-destructive hover:bg-destructive/90"
                  >
                    Yes, cancel it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              className={cn(
                "w-full rounded-lg transition-all duration-300",
                isPaymentDue()
                  ? "bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg hover:shadow-primary/25"
                  : "bg-secondary hover:bg-secondary/80",
              )}
              disabled={loading && action === "payment"}
              onClick={handleLogPayment}
            >
              {loading && action === "payment" ? (
                <div className="flex items-center">
                  <div className="loader-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="ml-2">Processing</span>
                </div>
              ) : (
                "Log Payment"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
