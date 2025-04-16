"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { toast } from "sonner"

export function ConnectWallet({ onConnect }) {
  const [connecting, setConnecting] = useState(false)

  const connectWallet = async () => {
    if (connecting) return // Prevent multiple simultaneous requests

    try {
      setConnecting(true)

      if (!window.ethereum) {
        toast.error("Wallet not found", {
          description: "Please install MetaMask or another Ethereum wallet",
        })
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // Use a single request instead of multiple
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts && accounts.length > 0) {
        const signer = await provider.getSigner()
        onConnect(signer._address)

        toast.success("Wallet connected", {
          description: `Connected to ${signer._address.slice(0, 6)}...${signer._address.slice(-4)}`,
        })
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)

      // More user-friendly error messages
      if (err.code === -32002) {
        toast.error("Connection pending", {
          description: "A wallet connection request is already pending. Please check your wallet.",
        })
      } else if (err.code === 4001) {
        toast.error("Connection rejected", {
          description: "You rejected the connection request.",
        })
      } else {
        toast.error("Connection failed", {
          description: "Failed to connect to your wallet. Please try again.",
        })
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
        <div className="flex items-center">
          <div className="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="ml-2">Connecting</span>
        </div>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}
