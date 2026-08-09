import {
    MapPin, Phone, Mail, Clock, MessageCircle, ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import {
    SITE_PHONE, SITE_EMAIL, SITE_ADDRESS, SITE_HOURS,
} from "@/lib/constants";

export const metadata = {
    title: "Contact Us | RentRide — Vehicle Rental in Mathura & Vrindavan",
    description: "Reach the RentRide team in Mathura. Call, email, WhatsApp or send us a message — we are here 24×7.",
};

const CARDS = [
    { icon: Phone, title: "Call us", value: `+91 ${SITE_PHONE}`, href: `tel:+91${SITE_PHONE}` },
    {
        icon: MessageCircle,
        title: "WhatsApp us",
        value: "Chat on WhatsApp",
        href: `https://wa.me/${SITE_PHONE}`,
        external: true,
    },
    { icon: Mail, title: "Email us", value: SITE_EMAIL, href: `mailto:${SITE_EMAIL}` },
    { icon: MapPin, title: "Visit us", value: `${SITE_ADDRESS.line1}, ${SITE_ADDRESS.city}, ${SITE_ADDRESS.state} ${SITE_ADDRESS.pincode}` },
    { icon: Clock, title: "Working hours", value: SITE_HOURS },
];

export default function ContactPage() {
    return (
        <div className="container-page pb-10">
            <PageHeader
                eyebrow="Contact Us"
                title="We are here for you, 24×7"
                description="Questions about a vehicle, a booking, or your yatra? Our Mathura-based team is always happy to help."
            />

            <section className="py-14">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {CARDS.map(({ icon: Icon, title, value, href, external }, i) => (
                            <Reveal key={title} delay={i * 60}>
                                <div className="card card-hover flex items-center justify-between gap-4 p-5">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Icon size={20} className="text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold mb-0.5">{title}</p>
                                            {href ? (
                                                <a
                                                    href={href}
                                                    target={external ? "_blank" : undefined}
                                                    rel={external ? "noopener noreferrer" : undefined}
                                                    className="text-text-secondary text-sm hover:text-primary transition-colors break-words"
                                                >
                                                    {value}
                                                </a>
                                            ) : (
                                                <p className="text-text-secondary text-sm">{value}</p>
                                            )}
                                        </div>
                                    </div>
                                    {href && <ChevronRight size={16} className="text-border flex-shrink-0" />}
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <ContactForm />
                </div>
            </section>
        </div>
    );
}
