import type { Metadata } from "next"
import { Bebas_Neue, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import LoaderWrapper from "./LoaderWrapper"

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Garv Malik — UX/UI Designer",
  description: "Portfolio of Garv Malik, a UX/UI Designer based in Tampere, Finland. Pursuing a Master's in Human-Technology Interaction at Tampere University.",
  authors: [{ name: "Garv Malik" }],
  openGraph: {
    title: "Garv Malik — UX/UI Designer",
    description: "Portfolio of Garv Malik — UX/UI Designer based in Tampere, Finland.",
    type: "website",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${bebasNeue.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        {/*
          LoaderWrapper is a dynamic client component — it never runs on the
          server, so it cannot crash SSR or block hydration. The site renders
          normally underneath it while the loader plays on top.
        */}
        <LoaderWrapper />
        {children}
      </body>
    </html>
  )
}
