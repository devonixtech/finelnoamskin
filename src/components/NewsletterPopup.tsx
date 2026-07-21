import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Gift, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const NewsletterPopup = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Only show for guest users (not logged in)
        if (user) return;

        const isDismissed = localStorage.getItem("newsletter_popup_dismissed");
        if (isDismissed) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [user]);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem("newsletter_popup_dismissed", "true");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) { handleDismiss(); return; }
            setIsOpen(true);
        }}>
            <DialogContent className="w-[92vw] sm:max-w-4xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl bg-transparent">
                <DialogTitle className="sr-only">First-visit RM50 offer</DialogTitle>
                <DialogDescription className="sr-only">
                    Promotional dialog — register as a member to get RM50 off your first visit.
                </DialogDescription>

                <div className="flex flex-col md:flex-row h-full md:min-h-[480px]">

                    {/* Left Side — Image */}
                    <div className="relative w-full md:w-1/2 h-44 sm:h-52 md:h-auto overflow-hidden">
                        <img
                            src="https://i.ibb.co/PvFZFCdQ/IMG-7766-JPG.jpg"
                            alt="Noam Skin Experience"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/15" />
                    </div>

                    {/* Right Side — Content */}
                    <div className="flex flex-col justify-center w-full md:w-1/2 p-7 md:p-12 bg-[#F8F5F2]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="space-y-5"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit">
                                <Gift className="w-3 h-3" />
                                Exclusive First Visit Offer
                            </div>

                            {/* Headline */}
                            <div className="space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                    RM50 OFF Your First Visit — No Code Needed!
                                </h2>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    Register as a member and your{" "}
                                    <span className="font-bold text-black">RM50 discount is applied automatically</span>{" "}
                                    on your very first invoice. Nothing to claim, nothing to type.
                                </p>
                            </div>

                            {/* How it works */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">How It Works</p>
                                <ol className="space-y-1.5 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="font-black text-black min-w-[16px]">1.</span>
                                        <span>Sign up as a member using the button below</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-black text-black min-w-[16px]">2.</span>
                                        <span>Visit the salon and book your first treatment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-black text-black min-w-[16px]">3.</span>
                                        <span className="text-green-700 font-semibold">RM50 is auto-deducted from your invoice — done! ✓</span>
                                    </li>
                                </ol>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3 pt-1">
                                <a
                                    href="https://wa.me/601123198819"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full uppercase tracking-wide transition-all text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Contact Us on WhatsApp
                                </a>

                                <a
                                    href="/signup"
                                    className="flex items-center justify-center gap-2 w-full h-12 bg-black hover:bg-black/90 text-white font-semibold rounded-full uppercase tracking-wide transition-all text-sm"
                                >
                                    <Gift className="w-4 h-4" />
                                    Register & Get RM50 Off
                                </a>

                                <button
                                    onClick={handleDismiss}
                                    className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                                >
                                    No thanks, maybe later
                                </button>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewsletterPopup;
