import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knowledgebase.ai",
  description: "Redefining the way you crawn your knowledgebase. !",
  icons: {
    icon: "/logo.svg", 
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter">

        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          {children}
        </GoogleOAuthProvider>
        
      </body>
    </html>
  );
}
