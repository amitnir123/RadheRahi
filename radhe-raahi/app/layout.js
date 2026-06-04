import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Radhe Raahi Rentals | Vrindavan Vehicle Marketplace",
  description: "Premium temple travel and vehicle rentals in Vrindavan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between antialiased">
        {/* Dynamic background lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-goldGlow rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-cyanGlow rounded-full blur-[180px] pointer-events-none -z-10" />

        <Navbar />
        
        <main className="flex-grow w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}