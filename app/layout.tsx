import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TeamProvider } from "@/contexts/team-context"
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Women TechMakers IWD 2025 Event Planner",
  description: "Planning tool for Women TechMakers International Women's Day 2025 event",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ThemeProvider enableSystem disableTransitionOnChange>
          <TeamProvider>{children}</TeamProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

