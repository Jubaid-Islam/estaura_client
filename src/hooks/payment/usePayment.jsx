import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { createPaymentIntent } from "../../api/paymentApi";
import { createTransaction } from "../../api/transactionApi";
import { createOrUpdateSchedule } from "../../api/rentScheduleApi";

const usePayment = ({ deal, currentUser, amount, month = null, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError("");

    try {
      // create PaymentIntent from backend 
      const { clientSecret } = await createPaymentIntent({
        amount,
        currency: "usd",
        dealId: deal._id,
        paymentType: deal.listingType,
      }, axiosSecure);

      // confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: currentUser?.name || "Client",
            email: currentUser?.email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // save transaction
        await createTransaction({
          dealId: deal._id,
          propertyId: deal.propertyId,
          propertyTitle: deal.propertyTitle,
          propertyImage: deal.propertyImage,
          paymentType: deal.listingType,
          agentId: deal.agentId,
          clientId: currentUser._id.toString(),
          clientEmail: currentUser.email,
          amount,
          month,
          stripePaymentId: paymentIntent.id,
          status: "completed",
        }, axiosSecure);

        if (deal.listingType === "rent") {
          await createOrUpdateSchedule({
            dealId: deal._id,
            propertyId: deal.propertyId,
            propertyTitle: deal.propertyTitle,
            clientId: currentUser._id.toString(),
            clientEmail: currentUser.email,
            agentId: deal.agentId,
            monthlyAmount: amount,
          }, axiosSecure);
        }

        queryClient.invalidateQueries({ queryKey: ["clientTransactions"] });
        queryClient.invalidateQueries({ queryKey: ["agentTransactions"] });
        queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
        queryClient.invalidateQueries({ queryKey: ["clientDeals"] });
        queryClient.invalidateQueries({ queryKey: ["rentSchedules"] });

        if (onSuccess) onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing, error, setError };
};

export default usePayment;