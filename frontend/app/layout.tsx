import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SubScrypt | Blockchain Subscription Manager",
  description: "Manage your subscriptions on the blockchain with style",
}

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen">{children}</main>
          <Toaster 
            position="top-right" 
            closeButton 
            richColors 
            theme="system"
            toastOptions={{
              classNames: {
                toast: "group rounded-xl overflow-hidden border-border/30 backdrop-blur-sm",
                title: "font-medium text-foreground",
                description: "text-muted-foreground text-sm",
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
