import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { SITE_NAME, SITE_EMAIL } from "@/lib/constants";

export const metadata = {
    title: "Terms of Service | RentRide — Vehicle Rental in Mathura & Vrindavan",
    description: "The terms and conditions that apply when you book a vehicle with RentRide.",
};

const SECTIONS = [
    {
        title: "1. About these terms",
        body: `These terms and conditions govern your use of ${SITE_NAME} and the booking of vehicles through our platform. By creating an account or making a booking, you agree to these terms.`,
    },
    {
        title: "2. Accounts & eligibility",
        body: "You must be at least 18 years old and hold a valid driving licence to book a vehicle. You are responsible for keeping your account credentials secure and for the accuracy of the information you provide.",
    },
    {
        title: "3. Bookings & confirmation",
        body: "Submitting a booking request does not guarantee availability. Every booking is reviewed and confirmed by our admin team before payment is taken. A booking is final only once it has been confirmed and paid for.",
    },
    {
        title: "4. Payments",
        body: "Payments are processed securely through Razorpay using UPI, cards or net banking. Your payment details are never stored on our servers. All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.",
    },
    {
        title: "5. Cancellations & refunds",
        body: "You may cancel a confirmed booking and receive a full refund, subject to our cancellation policy. Refunds are processed to the original payment method within 5–7 business days.",
    },
    {
        title: "6. Rental rules",
        body: "Vehicles must be returned on time and in the same condition they were provided. A valid driving licence must be shown at pickup. Any damage caused during the rental period may be charged to the renter.",
    },
    {
        title: "7. Acceptable use",
        body: "Vehicles must not be used for illegal activities, racing, or off-road driving. Passengers must not exceed the vehicle's permitted capacity.",
    },
    {
        title: "8. Limitation of liability",
        body: `${SITE_NAME} acts as a booking platform connecting renters with vehicle owners. While we verify all listings, we are not liable for indirect losses arising from your rental.`,
    },
    {
        title: "9. Changes to these terms",
        body: "We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms.",
    },
    {
        title: "10. Contact",
        body: `For any questions about these terms, contact us at ${SITE_EMAIL}.`,
    },
];

export default function TermsPage() {
    return (
        <div className="container-page pb-10">
            <PageHeader
                eyebrow="Legal"
                title="Terms of Service"
                description={`Please read these terms carefully before booking a vehicle with ${SITE_NAME}.`}
            />
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
                    Read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> to understand how we handle your data.
                </p>
            </section>
        </div>
    );
}
