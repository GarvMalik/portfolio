import type { Metadata } from "next"
import { Bebas_Neue, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import LoaderController from "./cinematic/LoaderController"
import { PageTransitionProvider } from "./cinematic/PageTransition"

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
  metadataBase: new URL("https://garvmalik.lol"),
  title: {
    default: "Garv Malik — UX/UI Designer",
    template: "%s — Garv Malik",
  },
  description:
    "Portfolio of Garv Malik, a UX/UI Designer based in Tampere, Finland. Pursuing an MSc in Human-Technology Interaction at Tampere University. Open to UX/UI internships in Finland and Europe.",
  authors: [{ name: "Garv Malik", url: "https://garvmalik.lol" }],
  keywords: [
    "Garv Malik",
    "UX designer",
    "UI designer",
    "portfolio",
    "Tampere",
    "Finland",
    "Human-Technology Interaction",
    "Tampere University",
    "interaction design",
    "Figma",
  ],
  creator: "Garv Malik",
  alternates: {
    canonical: "https://garvmalik.lol",
  },
  openGraph: {
    title: "Garv Malik — UX/UI Designer",
    description:
      "Portfolio of Garv Malik — UX/UI Designer based in Tampere, Finland. Research-led, accessible design across apps, services, and conversational AI.",
    url: "https://garvmalik.lol",
    siteName: "Garv Malik",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Garv Malik — UX/UI Designer portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Garv Malik — UX/UI Designer",
    description:
      "Portfolio of Garv Malik — UX/UI Designer based in Tampere, Finland.",
    images: ["/og-image.png"],
    creator: "@thegarvmalik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          LoaderController is a dynamic client component — it never runs on the
          server, so it cannot crash SSR or block hydration. The site renders
          normally underneath it while the loader plays on top.
        */}
        <LoaderController />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  )
}
