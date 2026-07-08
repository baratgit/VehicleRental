import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../context/AuthContext";
import { ShieldCheck, CreditCard, ChevronRight, AlertCircle, CheckCircle2, RefreshCw, XCircle, FileSpreadsheet } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";

export default function PaymentFlow() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invoice modal state
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Payment Status State
  const [paymentStep, setPaymentStep] = useState("summary");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Razorpay simulation input fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/bookings/");
        const found = response.data.find((b) => b.id === bookingId);
        if (!found) {
          setError("Booking not found or unauthorized.");
        } else {
          setBooking(found);
        }
      } catch (err) {
        console.error("Error fetching booking for payment", err);
        setError("Unable to load booking details. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full text-center shadow-sm">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-slate-900 text-xl font-bold mb-2">Checkout Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error || "This checkout link has expired or is invalid."}</p>
          <Link to="/" className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl inline-block text-sm hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Cost calculations
  const baseAmount = booking.totalAmount;
  const tax = parseFloat((baseAmount * 0.18).toFixed(2));
  const grandTotal = parseFloat((baseAmount + tax).toFixed(2));

  const handleCreateOrder = () => {
    setPaymentStep("razorpay");
  };

  const handleSimulatePayment = async (status) => {
    setProcessing(true);
    // Simulate minor gateway latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockTxn = `TXN_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    
    try {
      const response = await api.post("/api/payment/verify/", {
        bookingId: booking.id,
        orderId: `order_mock_${Math.random().toString(36).substring(2, 10)}`,
        paymentId: mockTxn,
        status,
      });

      setProcessing(false);
      if (status === "Success" && response.data.success) {
        setTransactionId(mockTxn);
        setPaymentStep("success");
      } else {
        setPaymentStep("failed");
      }
    } catch (err) {
      console.error(err);
      setProcessing(false);
      setPaymentStep("failed");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans" id="payment-page">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator */}
        <div className="flex justify-center items-center space-x-3 text-xs font-mono mb-12 uppercase text-slate-400">
          <span className={paymentStep === "summary" ? "text-indigo-600 font-bold" : "text-slate-400"}>1. Summary</span>
          <ChevronRight className="h-3 w-3" />
          <span className={paymentStep === "razorpay" ? "text-indigo-600 font-bold" : "text-slate-400"}>2. Gateway</span>
          <ChevronRight className="h-3 w-3" />
          <span className={(paymentStep === "success" || paymentStep === "failed") ? "text-indigo-600 font-bold" : "text-slate-400"}>3. Confirmation</span>
        </div>

        {paymentStep === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn" id="summary-stage">
            {/* Left: Booking Recap */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <h2 className="text-slate-900 font-extrabold text-lg border-b border-slate-100 pb-2">Review Booking Summary</h2>
                
                <div className="flex space-x-4 items-center">
                  <img
                    src={booking.vehicleImage}
                    alt={booking.vehicleName}
                    referrerPolicy="no-referrer"
                    className="w-24 h-16 object-cover rounded-lg border border-slate-100 bg-slate-50"
                  />
                  <div>
                    <h3 className="text-slate-900 font-bold">{booking.vehicleName}</h3>
                    <p className="text-xs text-indigo-600 font-mono uppercase">Reservation ID: {booking.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-1">RENTAL START</span>
                    <span className="text-slate-700 font-sans font-semibold">{booking.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">RENTAL END</span>
                    <span className="text-slate-700 font-sans font-semibold">{booking.endDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block mb-1">DURATION</span>
                    <span className="text-slate-700 font-sans font-semibold">{booking.totalDays} Rental Days</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start space-x-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-900 font-bold text-sm">Full Insured Travel Protection</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    This reservation is automatically covered under our standard fleet collision damage waiver. Zero deductible liability in case of minor scratch occurrences.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Bill Breakdown & Proceed */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl h-fit space-y-6 shadow-sm">
              <h3 className="text-slate-950 font-bold text-sm tracking-widest uppercase border-b border-slate-100 pb-2">Price Breakdown</h3>
              
              <div className="space-y-3 text-xs text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Base Fare ({booking.totalDays} Days):</span>
                  <span>${baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Goods & Services Tax (18%):</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-100 pt-3">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">${grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                id="proceed-payment-button"
              >
                Proceed to Gateway
              </button>
            </div>
          </div>
        )}

        {paymentStep === "razorpay" && (
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg max-w-md mx-auto relative overflow-hidden animate-scaleIn" id="gateway-stage">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 p-1.5 rounded text-white font-bold text-xs">RP</div>
                <span className="font-bold text-sm text-slate-900">Razorpay Secure Checkout</span>
              </div>
              <span className="text-indigo-600 font-mono text-sm font-bold">${grandTotal}</span>
            </div>

            {processing ? (
              <div className="py-12 flex flex-col items-center space-y-4">
                <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-400 font-mono animate-pulse">Contacting Razorpay Secure Nodes...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">SELECT PAYMENT MECHANISM</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer ${
                        paymentMethod === "card" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer ${
                        paymentMethod === "upi" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      <span>⚡ UPI Instant</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "card" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">CARD NUMBER</label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">EXPIRY (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/29"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">CVV CODE</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 text-center"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                    <p className="text-xs text-slate-500">Simulate direct merchant checkout using any standard UPI ID.</p>
                    <input
                      type="text"
                      placeholder="user@upi"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Confirmations */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleSimulatePayment("Success")}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-indigo-600/10 hover:bg-indigo-500"
                    id="simulate-success-btn"
                  >
                    Simulate Payment Success
                  </button>
                  <button
                    onClick={() => handleSimulatePayment("Failed")}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-rose-600 font-semibold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    id="simulate-failure-btn"
                  >
                    Simulate Payment Fail
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentStep === "success" && (
          <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md mx-auto text-center space-y-6 shadow-md animate-scaleIn" id="success-stage">
            <div className="bg-emerald-50 p-4 rounded-full text-emerald-600 inline-block">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            <div>
              <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Booking Confirmed!</h2>
              <p className="text-xs text-slate-400 font-mono mt-2">TRANSACTION ID: {transactionId}</p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Your rental of <span className="text-indigo-600 font-semibold">{booking.vehicleName}</span> was booked successfully. An invoice has been automatically filed in your dashboard activity logs.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 space-y-2 font-mono text-left border border-slate-100">
              <div className="flex justify-between">
                <span>RESERVATION NO:</span>
                <span className="text-slate-800 font-sans">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>RENTAL DURATION:</span>
                <span className="text-slate-800 font-sans">{booking.startDate} to {booking.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span>AMOUNT BILLED:</span>
                <span className="text-indigo-600 font-sans font-bold">${grandTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/dashboard"
                className="bg-indigo-600 text-white font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-indigo-500 transition-all text-center shadow-md shadow-indigo-600/10"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => setInvoiceOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
                <span>Invoice PDF</span>
              </button>
            </div>
          </div>
        )}

        {paymentStep === "failed" && (
          <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md mx-auto text-center space-y-6 shadow-md animate-scaleIn" id="failed-stage">
            <div className="bg-rose-50 p-4 rounded-full text-rose-600 inline-block">
              <XCircle className="h-12 w-12" />
            </div>

            <div>
              <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Payment Declined</h2>
              <p className="text-xs text-slate-400 font-mono mt-2">GATEWAY ERROR CODE: SEC_DEVR_8374</p>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              Your card issuer or UPI node refused authorization. No funds were subtracted from your account. Please check your credit ceiling limits or try a different transaction method.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setPaymentStep("razorpay")}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-indigo-500 transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Retry Transaction
              </button>
              <Link
                to="/vehicles"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-xs block text-center transition-colors"
              >
                Choose Another Vehicle
              </Link>
            </div>
          </div>
        )}

      </div>

      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        booking={booking}
        payment={{
          transactionId,
          amount: baseAmount,
          tax,
          grandTotal,
          status: "Success"
        }}
      />
    </div>
  );
}
