import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { SITE_NAME, SITE_EMAIL } from "@/lib/constants";

export const metadata = {
    title: "Privacy Policy | RentRide — Vehicle Rental in Mathura & Vrindavan",
    description: "How RentRide collects, uses and protects your personal information.",
};

const SECTIONS = [
    {
        title: "1. Information we collect",
        body: "We collect the information you provide when creating an account or making a booking, including your name, email address, phone number and booking details. We may also collect technical data such as browser type and device information to improve our service.",
    },
    {
        title: "2. How we use your information",
        body: "Your information is used to create and manage your account, process and confirm bookings, communicate important updates about your rental, provide customer support, and improve our platform.",
    },
    {
        title: "3. Payment security",
        body: `Payments on ${SITE_NAME} are processed by Razorpay, a PCI-DSS compliant payment gateway. We never see or store your full card number, CVV or bank credentials.`,
    },
    {
        title: "4. Data sharing",
        body: "We share only the information necessary to complete your rental — such as your name and contact details with the vehicle owner and admin team for coordination. We never sell your personal data to third parties.",
    },
    {
        title: "5. Data retention",
        body: "We retain your account and booking information for as long as your account is active and as required by applicable law. You may request deletion of your data at any time.",
    },
    {
        title: "6. Cookies",
        body: "We use cookies and similar technologies to keep you signed in and to understand how visitors use the platform. You can control cookies through your browser settings.",
    },
    {
        title: "7. Your rights",
        body: "You have the right to access, correct or delete the personal information we hold about you. To exercise these rights, contact us using the details below.",
    },
    {
        title: "8. Contact us",
        body: `For any privacy-related questions, reach us at ${SITE_EMAIL}.`,
    },
];

export default function PrivacyPage() {
    return (
        <div className="container-page pb-10">
            <div className="mb-12 py-10 text-center">
                <span className="section-label">Legal</span>

                <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mt-3">
                    Privacy Policy
                </h2>
                <h3 className="section-desc text-base md:text-lg mt-2">
                    How {SITE_NAME} collects, uses and protects your personal information.
                </h3>
            </div>
            <section className="py-14 max-w-3xl mx-auto">
                <div className="space-y-6">
                    {SECTIONS.map((s) => (
                        <div key={s.title} className="card p-5 hover:border-primary transition-colors">
                            <h2 className="font-bold text-lg mb-2">{s.title}</h2>
                            <p className="text-text-secondary text-sm leading-relaxed">{s.body}</p>
                        </div>
                    ))}
                </div>
                <p className="text-center text-text-secondary text-sm mt-10">
                    Read our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> to understand the rules of booking.
                </p>
            </section>
        </div>
    );
}
