import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "RentRide — Vehicle Rental Platform",
    description: "Rent cars, bikes and scooters near you",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.className} bg-background text-white min-h-screen`}
            >
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#1A1A1A",
                            color: "#fff",
                            border: "1px solid #2A2A2A",
                        },
                    }}
                />
            </body>
        </html>
    );
}