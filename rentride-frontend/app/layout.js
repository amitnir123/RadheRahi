import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { META } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: META.title,
    description: META.description,
    keywords: [
        "vehicle rental Mathura",
        "bike on rent Vrindavan",
        "car rental Braj",
        "scooter rental pilgrimage",
        "darshan yatra vehicle",
        "RentRide",
    ],
    openGraph: {
        title: META.title,
        description: META.description,
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={`${inter.className} bg-background text-foreground min-h-screen antialiased`}>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#FFFFFF",
                            color: "#1C1917",
                            border: "1px solid #E7E5E1",
                            borderRadius: "0.75rem",
                            padding: "1rem 1.25rem",
                            boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
                        },
                        duration: 4000,
                    }}
                />
            </body>
        </html>
    );
}