import type React from "react"
import type { Metadata } from "next"
import "../src/index.css"

export const metadata: Metadata = {
  title: "Kartavya - Food Redistribution Platform",
  description: "Connecting food providers with NGOs to reduce waste and fight hunger",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
