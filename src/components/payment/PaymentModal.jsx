import React, { useState } from "react";
import { Elements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { X, CreditCard, Shield, Building2, MapPin, DollarSign, Calendar, CheckCircle, Copy, Check } from "lucide-react";
import usePayment from "../../hooks/payment/usePayment";
import { cloudinaryUrl } from "../../hooks/cloudniaryUrl";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "#374151",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const TEST_CARD = {
  number: "4242 4242 4242 4242",
  exp: "04 / 44",
  cvc: "444",
  zip: "44444",
};

// ── Test card helper ──
const TestCardHelper = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const full = `${TEST_CARD.number} ${TEST_CARD.exp} ${TEST_CARD.cvc} ${TEST_CARD.zip}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-indigo-50 rounded-xl mb-3">
      <div className="text-xs text-indigo-800 leading-relaxed">
        <p className="font-semibold mb-0.5">Demo card</p>
        <p className="font-mono">{TEST_CARD.number} &nbsp;&nbsp; {TEST_CARD.exp} &nbsp; {TEST_CARD.cvc}
          &nbsp; {TEST_CARD.zip}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 px-2 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition flex-shrink-0"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

// ── Inner form
const PaymentForm = ({ deal, currentUser, amount, month, onSuccess, onClose }) => {
  const { handlePayment, isProcessing, error, setError } = usePayment({
    deal, currentUser, amount, month, onSuccess,
  });

  return (
    <div className="space-y-4">

      {/* Test card helper  */}
      <TestCardHelper />

      {/* Card input */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">Card Details</label>
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={() => error && setError("")}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Shield size={12} className="text-emerald-500 flex-shrink-0" />
        Secured by Stripe. Your card info is never stored.
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-70 shadow-md"
        >
          {isProcessing
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <CreditCard size={15} />
          }
          {isProcessing ? "Processing..." : `Pay $${Number(amount).toLocaleString()}`}
        </button>
      </div>
    </div>
  );
};

// Success Screen
const PaymentSuccess = ({ transactionRef, amount, onClose }) => (
  <div className="text-center py-6 space-y-3">
    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
      <CheckCircle size={32} className="text-emerald-600" />
    </div>
    <div>
      <p className="text-lg font-bold text-gray-900">Payment Successful!</p>
      <p className="text-sm text-gray-500 mt-1">Your payment of <span className="font-semibold text-indigo-600">${Number(amount).toLocaleString()}</span> has been processed.</p>
    </div>
    {transactionRef && (
      <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
        Ref: <span className="font-mono font-medium text-gray-600">{transactionRef}</span>
      </p>
    )}
    <button
      onClick={onClose}
      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition mt-2"
    >
      Done
    </button>
  </div>
);

// Main Modal
const PaymentModal = ({ deal, currentUser, month = null, onClose, onPaymentSuccess }) => {
  const [successRef, setSuccessRef] = useState(null);
  const amount = deal.propertyPrice;

  const handleSuccess = (paymentIntentId) => {
    setSuccessRef(paymentIntentId);
    if (onPaymentSuccess) onPaymentSuccess();
  };

  const monthLabel = month || new Date().toISOString().slice(0, 7);
  const isRent = deal.listingType === "rent";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !successRef && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={18} className="text-indigo-600" />
            {isRent ? "Monthly Rent Payment" : "Property Purchase"}
          </h3>
          {!successRef && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition">
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>

        <div className="p-6">
          {successRef ? (
            <PaymentSuccess transactionRef={successRef} amount={amount} onClose={onClose} />
          ) : (
            <>
              {/* Property summary */}
              <div className="flex gap-3 p-3 bg-gray-50 rounded-xl mb-5">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {deal.propertyImage
                    ? <img src={cloudinaryUrl(deal.propertyImage, { width: 120 })} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Building2 size={20} className="text-gray-300" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{deal.propertyTitle}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {deal.propertyCity}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                      <DollarSign size={13} /> {Number(amount).toLocaleString()}
                      {isRent && <span className="text-xs font-normal text-gray-400">/month</span>}
                    </p>
                    {isRent && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={10} /> {monthLabel}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment type badge */}
              <div className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold mb-4 ${isRent ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                }`}>
                {isRent ? "Monthly Recurring Payment" : "One-time Purchase Payment"}
              </div>

              {/* Stripe form */}
              <Elements stripe={stripePromise}>
                <PaymentForm
                  deal={deal}
                  currentUser={currentUser}
                  amount={amount}
                  month={isRent ? monthLabel : null}
                  onSuccess={handleSuccess}
                  onClose={onClose}
                />
              </Elements>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;