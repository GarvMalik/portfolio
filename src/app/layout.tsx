import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garv Malik — UX/UI Designer & Creative Developer",
  description: "Portfolio of Garv Malik, a UX/UI Designer based in Tampere, Finland. Pursuing a Master's in Human-Technology Interaction at Tampere University.",
  authors: [{ name: "Garv Malik" }],
  openGraph: {
    title: "Garv Malik — UX/UI Designer",
    description: "Portfolio of Garv Malik — UX/UI Designer based in Tampere, Finland.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // return (
  //   <html lang="en" className="h-full">
  //     <body className="min-h-full flex flex-col antialiased">{children}</body>
  //   </html>  );
    return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );

}
