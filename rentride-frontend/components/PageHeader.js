import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

export default function PageHeader({ eyebrow, title, description, breadcrumbs }) {
    return (
        <section className="relative border-b border-border bg-gradient-to-b from-background to-card/50">
            <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="container-page relative py-12 md:py-16 lg:py-20">
                {breadcrumbs && breadcrumbs.length > 0 ? (
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-1.5 text-sm text-text-secondary flex-wrap">
                            <li className="flex items-center gap-1.5">
                                <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <Home size={14} />
                                    Home
                                </Link>
                            </li>
                            {breadcrumbs.map((crumb, i) => (
                                <li key={crumb.href} className="flex items-center gap-1.5">
                                    <ChevronLeft size={12} className="text-text-muted" />
                                    {crumb.href ? (
                                        <Link href={crumb.href} className="hover:text-primary transition-colors">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-foreground font-medium" aria-current="page">
                                            {crumb.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                ) : (
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors text-sm mb-6"
                    >
                        <ChevronLeft size={15} /> Back to home
                    </Link>
                )}
                {eyebrow && <span className="section-label">{eyebrow}</span>}
                <h1 className="section-title text-3xl md:text-5xl lg:text-6xl mt-3">
                    {title}
                </h1>
                {description && (
                    <p className="section-desc text-base md:text-lg mt-4 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}
