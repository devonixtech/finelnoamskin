import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Calendar, User, RefreshCw, Loader2, Clock, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/services/api';
import { format } from "date-fns";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id') || searchParams.get('reference');
    const billcode = searchParams.get('billcode');
    const statusId = searchParams.get('status_id');
    const type = searchParams.get('type');

    const isSuccess = !statusId || statusId === '1';
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [loadingBooking, setLoadingBooking] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (isSuccess && billcode && !verified) {
            setVerifying(true);
            api.toyyibpay.verifyPayment({ billcode, reference: bookingId || undefined })
                .then((res: any) => {
                    if (res?.status === 'completed' || res?.status === 'already_completed') {
                        setVerified(true);
                    }
                })
                .catch((err: any) => {
                    console.error('Payment verification failed:', err);
                })
                .finally(() => {
                    setVerifying(false);
                });
        }
    }, [isSuccess, billcode, bookingId, verified]);

    useEffect(() => {
        if (isSuccess && bookingId) {
            setLoadingBooking(true);
            const firstId = bookingId.split(',')[0].trim();
            api.bookings.getById(firstId)
                .then((data: any) => {
                    setBookingDetails(data);
                })
                .catch((err: any) => {
                    console.error('Failed to fetch booking details:', err);
                })
                .finally(() => {
                    setLoadingBooking(false);
                });
        }
    }, [isSuccess, bookingId]);

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <Navbar />

            <main className="container mx-auto px-4 max-w-3xl pt-32 pb-20 text-center">
                <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-sm border border-slate-100 mt-10 space-y-8">
                    <div className="space-y-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500 ${isSuccess ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            {isSuccess ? (
                                <CheckCircle className="w-10 h-10 text-emerald-600" />
                            ) : (
                                <XCircle className="w-10 h-10 text-red-600" />
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {isSuccess ? "Appointment Confirmed!" : "Payment Failed!"}
                        </h1>
                        <p className="text-base text-slate-400 font-medium max-w-md mx-auto">
                            {isSuccess ? "Your payment went through and your treatment slot is locked." : "Your transaction could not be processed or was cancelled."}
                        </p>
                    </div>

                    {verifying && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-full border border-blue-100 text-blue-600 mx-auto">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-wider">Verifying transaction...</span>
                        </div>
                    )}

                    {/* Booking Details Card */}
                    {isSuccess && (loadingBooking ? (
                        <div className="p-8 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 border border-slate-100">
                            <Loader2 className="w-6 h-6 animate-spin mr-3 text-accent" />
                            <span className="font-bold text-sm uppercase tracking-wider">Retrieving booking info...</span>
                        </div>
                    ) : bookingDetails ? (
                        <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-6 md:p-8 text-left space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Bespoke Experience
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                        {bookingDetails.service_name}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900">MYR {bookingDetails.price}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bookingDetails.duration_minutes} Mins</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-sm">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-500">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                                            <p className="font-bold text-slate-800">
                                                {bookingDetails.booking_date ? format(new Date(bookingDetails.booking_date), "EEEE, d MMMM yyyy") : ""} at {bookingDetails.booking_time?.slice(0, 5)}
                                            </p>
                                        </div>
                                    </div>

                                    {bookingDetails.staff_name && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialist</p>
                                                <p className="font-bold text-slate-800">{bookingDetails.staff_name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-500 mt-0.5">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salon Location</p>
                                            <p className="font-bold text-slate-800 truncate">{bookingDetails.salon_name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 truncate">{bookingDetails.salon_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null)}

                    {isSuccess ? (
                        <div className="p-6 bg-slate-50/20 rounded-[2rem] border border-slate-100 text-left flex items-start gap-3.5">
                            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                We have sent a confirmation email with all the details of your appointment. You can also view and manage this booking at any time from your dashboard activity history.
                            </p>
                        </div>
                    ) : (
                        <div className="p-6 bg-red-50/20 rounded-[2rem] border border-red-100 text-left flex items-start gap-3.5">
                            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-500 flex-shrink-0">
                                <XCircle className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-red-600 leading-relaxed font-medium">
                                We could not process your booking because the payment transaction was unsuccessful. Please attempt checkout again or reach out to support.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        {isSuccess ? (
                            <Button asChild className="h-14 px-8 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-bold text-lg">
                                <Link to="/my-bookings" className="flex items-center gap-2">
                                    View My Bookings <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild className="h-14 px-8 rounded-full bg-[#1A1A1A] text-white hover:bg-black font-bold text-lg">
                                <Link to={type === 'order' ? "/checkout" : "/book"} className="flex items-center gap-2">
                                    Try Again <RefreshCw className="w-5 h-5" />
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="outline" className="h-14 px-8 rounded-full border-slate-200 text-[#1A1A1A] font-bold text-lg hover:bg-slate-50">
                            <Link to="/">Return Home</Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentSuccess;
