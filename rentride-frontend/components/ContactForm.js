"use client";
import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { SITE_EMAIL } from "@/lib/constants";

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const subject = encodeURIComponent(`Enquiry from ${form.name || "website visitor"}`);
            const body = encodeURIComponent(
                `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
            );
            window.location.href = `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
            toast.success("Opening your email app to send the message");
        } catch {
            toast.error("Could not open email app");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="lg:col-span-3 card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Send size={20} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Send us a message</h2>
                    <p className="text-text-secondary text-sm">
                        We usually respond within a few hours.
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="label label-required" htmlFor="contact-name">Full name</label>
                    <input
                        id="contact-name"
                        className="input-field"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <label className="label" htmlFor="contact-phone">Phone</label>
                    <input
                        id="contact-phone"
                        className="input-field"
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="label label-required" htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="label label-required" htmlFor="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        rows="5"
                        className="input-field resize-none"
                        placeholder="How can we help?"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        required
                    />
                </div>
                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        className="btn-primary btn-lg w-full sm:w-auto inline-flex items-center justify-center gap-2"
                        disabled={sending}
                    >
                        {sending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Preparing...
                            </>
                        ) : (
                            <>
                                <Send size={16} /> Send message
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
