"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { toast } from "sonner"

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: unknown // You can replace `any` with a stricter type if desired
  }
}

interface ConnectWalletProps {
  onConnect: (address: string) => void
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  const [connecting, setConnecting] = useState(false)

  const showToast = (title: string, description: string, variant?: "destructive") =>
    toast(
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>,
      {
        ...(variant === "destructive" && { className: "bg-destructive text-destructive-foreground" }),
      }
    )

  const connectWallet = async () => {
    if (connecting) return

    try {
      setConnecting(true)

      if (!window.ethereum) {
        showToast(
          "Wallet not found",
          "Please install MetaMask or another Ethereum wallet.",
          "destructive"
        )
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts && accounts.length > 0) {
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        onConnect(address)

        showToast(
          "Wallet connected",
          `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
        )
      }
    } catch (err: unknown) {
      console.error("Error connecting wallet:", err)

      if ((err as { code?: number }).code === -32002) {
        showToast(
          "Connection pending",
          "A wallet connection request is already pending. Please check your wallet.",
          "destructive"
        )
      } else if ((err as { code?: number }).code === 4001) {
        showToast(
          "Connection rejected",
          "You rejected the connection request.",
          "destructive"
        )
      } else {
        showToast(
          "Connection failed",
          "Failed to connect to your wallet. Please try again.",
          "destructive"
        )
      }
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={connecting}
      className="relative rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connecting ? (
        <>
          <span className="mr-2">Connecting</span>
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}
