export const DEFAULT_CITY = "Mathura";
export const DEFAULT_STATE = "UP";

export const PICKUP_PLACES = [
    "Chhatikara",
    "Omax Apartment",
    "Train Station",
    "Govardhan Chauraha",
];

export const PLATFORM_CONTACT = {
    phone: "7007722955",
    email: "admin@rentride.com",
};

export const SITE_NAME = "RentRide";
export const SITE_TAGLINE =
    "Trusted vehicle rentals for pilgrims & travellers across Mathura, Vrindavan and the Braj region.";
export const SITE_EMAIL = PLATFORM_CONTACT.email;
export const SITE_PHONE = PLATFORM_CONTACT.phone;
export const SITE_ADDRESS = {
    line1: "RentRide Hub, Chhatikara",
    city: "Mathura",
    state: "Uttar Pradesh",
    pincode: "281004",
    country: "India",
};
export const SITE_HOURS = "Open all days · 6:00 AM – 10:00 PM";

export const SOCIAL_LINKS = [
    { label: "WhatsApp", href: `https://wa.me/${PLATFORM_CONTACT.phone}`, external: true },
    { label: "Instagram", href: "https://instagram.com", external: true },
    { label: "Facebook", href: "https://facebook.com", external: true },
    { label: "YouTube", href: "https://youtube.com", external: true },
];

export const PUBLIC_NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Vehicles", href: "/vehicles" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
    explore: [
        { label: "Browse Vehicles", href: "/vehicles" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Popular Destinations", href: "/#destinations" },
        { label: "Special Offers", href: "/#offers" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Safety & Trust", href: "/safety" },
        { label: "Contact Us", href: "/contact" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
    ],
    support: [
        { label: "Call us", href: `tel:+91${PLATFORM_CONTACT.phone}` },
        { label: "WhatsApp us", href: `https://wa.me/${PLATFORM_CONTACT.phone}` },
        { label: "Email us", href: `mailto:${PLATFORM_CONTACT.email}` },
    ],
};

// Image/video carousel slides shown on the homepage for advertisements.
// Set `media` to a local or hosted image/video URL. If `type` is "video"
// the media is played as a muted looping video. When no media is set, a
// branded gradient fallback is shown.
export const HERO_SLIDES = [
    {
        id: 1,
        type: "image",
        media: "/ads/carousel-mathura.svg",
        gradient: "from-[#042F2E] via-[#0F766E] to-[#D97706]",
        eyebrow: "Mathura · The Land of Lord Krishna",
        headline: "Your Darshan Yatra, Your Ride",
        sub: "Cars, bikes and scooters — verified, sanitised and ready for your holy journey across Braj.",
        cta: { label: "Browse Vehicles", href: "/vehicles" },
        ctaSecondary: { label: "How it works", href: "/how-it-works" },
    },
    {
        id: 2,
        type: "image",
        media: "/ads/carousel-vrindavan.svg",
        gradient: "from-[#022C22] via-[#0F766E] to-[#D97706]",
        eyebrow: "Vrindavan · Galiyan of Love",
        headline: "Roam Every Gali of Vrindavan",
        sub: "Book a bike or e-scooter and explore the lanes where the rasleela lives.",
        cta: { label: "Explore Bikes", href: "/vehicles?type=bike" },
        ctaSecondary: { label: "See Vehicles", href: "/vehicles" },
    },
    {
        id: 3,
        type: "image",
        media: "/ads/carousel-fleet.svg",
        gradient: "from-[#134E4A] via-[#0F766E] to-[#F59E0B]",
        eyebrow: "Trusted by thousands of pilgrims",
        headline: "Book in Minutes, Ride in Seconds",
        sub: "Transparent pricing, no hidden charges and 24×7 support on your journey.",
        cta: { label: "Create Account", href: "/register" },
        ctaSecondary: { label: "Talk to us", href: "/contact" },
    },
];

export const STATS = [
    { value: "500+", label: "Verified Vehicles" },
    { value: "12,000+", label: "Happy Pilgrims" },
    { value: "4.8★", label: "Average Rating" },
    { value: "24×7", label: "On-Road Support" },
];

export const VEHICLE_TYPES = [
    { key: "car", label: "Cars", desc: "Comfortable AC rides for family darshan trips", href: "/vehicles?type=car" },
    { key: "bike", label: "Bikes", desc: "Fast and fuel-efficient for temple hopping", href: "/vehicles?type=bike" },
    { key: "scooter", label: "Scooters", desc: "Perfect for crowded galiyas and short hops", href: "/vehicles?type=scooter" },
];

export const HOW_IT_WORKS = [
    { step: "01", title: "Browse & Pick", desc: "Choose from verified cars, bikes and scooters near you." },
    { step: "02", title: "Choose Dates & Pickup", desc: "Select your rental dates and a pickup place in Mathura." },
    { step: "03", title: "Admin Confirms", desc: "Our team verifies availability and confirms your booking." },
    { step: "04", title: "Pay Securely", desc: "Complete payment via Razorpay. Card details never stored." },
    { step: "05", title: "Ride with Peace", desc: "Pick up, enjoy your yatra, and return on time." },
];

export const TRUST_FEATURES = [
    {
        title: "Verified Vehicles",
        desc: "Every vehicle is inspected, sanitised and listed only after admin verification.",
    },
    {
        title: "Transparent Pricing",
        desc: "Clear per-day rates with no hidden charges or last-minute surprises.",
    },
    {
        title: "Secure Payments",
        desc: "Payments processed safely via Razorpay. Your details are never stored.",
    },
    {
        title: "24×7 Support",
        desc: "Our local team in Mathura is available round the clock for assistance.",
    },
    {
        title: "Admin Confirmed Bookings",
        desc: "A real person reviews every request so you never land at an empty lot.",
    },
    {
        title: "Refund Friendly",
        desc: "Full refund on cancellation — your money is always protected.",
    },
];

export const DESTINATIONS = [
    { name: "Mathura Krishnajanmabhoomi", desc: "Birthplace of Lord Krishna", time: "20 min from pickup" },
    { name: "Vrindavan Temples", desc: "Banke Bihari, ISKCON & Prem Mandir", time: "35 min from pickup" },
    { name: "Govardhan Parikrama", desc: "21 km sacred circumambulation", time: "Ideal on scooter/bike" },
    { name: "Barsana Radha Rani", desc: "Home of Radha Rani", time: "1 hr from pickup" },
    { name: "Gokul", desc: "Where Krishna spent his childhood", time: "40 min from pickup" },
    { name: "Radha Kund & Kusum Sarovar", desc: "Sacred lakes near Govardhan", time: "50 min from pickup" },
];

export const TESTIMONIALS = [
    {
        name: "Ramesh Sharma",
        place: "Delhi",
        text: "Booked a car for our family's Mathura darshan. The vehicle was clean, the price was exactly as shown, and pickup was on time. Highly recommended!",
    },
    {
        name: "Priya Verma",
        place: "Agra",
        text: "I rented a scooter for the Govardhan parikrama. The booking was confirmed quickly and the scooter was in great condition. Felt safe throughout.",
    },
    {
        name: "Mohit Gupta",
        place: "Jaipur",
        text: "The best part is that a real person confirms your booking. No surprises on pickup day. Great support on call whenever I needed help.",
    },
];

export const FAQS = [
    {
        q: "Do I need a licence to rent a vehicle?",
        a: "Yes. A valid driving licence is required for cars, bikes and scooters, and is verified at pickup.",
    },
    {
        q: "How do I pay for my booking?",
        a: "After the admin accepts your booking, you pay securely through Razorpay using UPI, cards or net banking. Your card details are never stored on our servers.",
    },
    {
        q: "Where can I pick up the vehicle?",
        a: "You can choose from our pickup places in Mathura — including near the railway station and Govardhan Chauraha.",
    },
    {
        q: "Can I cancel my booking?",
        a: "Yes. You get a full refund on cancellation, so your money is always protected.",
    },
];

export const META = {
    title: "RentRide | Trusted Vehicle Rental in Mathura & Vrindavan",
    description:
        "Book verified cars, bikes and scooters in Mathura, Vrindavan and the Braj region. Transparent pricing, secure payments and 24×7 support for your darshan yatra.",
};
