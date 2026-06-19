import React, { useState } from "react";
import {
  Building2, MapPin, Tag, DollarSign,
  ArrowLeft, CheckCircle, XCircle, FileText, CreditCard, Clock, AlertTriangle
} from "lucide-react";
import Swal from "sweetalert2";

import useUser from "../../../../../hooks/user/useUser";
import useClientDeals from "../../../../../hooks/deals/useClientDeals";
import { useRespondToProposal } from "../../../../../hooks/deals/useDealActions";
import { useClientSchedules } from "../../../../../hooks/rentSchedule/useRentSchedule";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";
import PaymentModal from "../../../../payment/PaymentModal";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

const getMonthString = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const MyDeals = () => {

  const { data: currentUser } = useUser();
  const clientId = currentUser?._id?.toString();
  const { deals, isLoading, refetch } = useClientDeals(clientId);
  const { respondToProposal, isPending } = useRespondToProposal();
  const { schedules } = useClientSchedules(clientId);

  const [paymentDeal, setPaymentDeal] = useState(null);

  const getScheduleForDeal = (dealId) =>
    (schedules || []).find(s => s.dealId === dealId);

  const handleRespond = async (dealId, response) => {
    const isAccept = response === "accepted";
    const result = await Swal.fire({
      title: isAccept ? "Accept Proposal?" : "Reject Proposal?",
      text: isAccept ? "You'll be able to proceed with payment after accepting." : "Are you sure you want to reject this proposal?",
      icon: isAccept ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isAccept ? "#4f46e5" : "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: isAccept ? "Yes, accept" : "Yes, reject",
      customClass: { popup: "rounded-2xl" },
    });
    if (!result.isConfirmed) return;
    try {
      await respondToProposal({ dealId, data: { response, clientName: currentUser?.name } });
      Swal.fire({
        icon: "success",
        title: isAccept ? "Proposal Accepted!" : "Proposal Rejected",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });
      refetch();
    } catch {
      Swal.fire("Error", "Failed to respond to proposal.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">

      <div className="flex items-center gap-1 mb-4">
        <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Deals :
        </h1>
        {deals.length > 0 && (
          <span className="px-2 mt-0.5 flex items-center text-indigo-600 text-xl md:text-2xl font-bold">{deals.length}</span>
        )}
      </div>

      {deals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No deals yet</h3>
          <p className="text-sm text-gray-400 mt-1">Your agent will close a deal and send you a proposal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => {

            const isAccepted = deal.proposalStatus === "accepted";
            const isPendingP = deal.proposalStatus === "pending";
            const isCompleted = deal.proposalStatus === "completed";
            const isRent = deal.listingType === "rent";

            // rent payment button state
            const schedule = isRent ? getScheduleForDeal(deal._id) : null;
            const currentMonth = getMonthString();
            const isPaidThisMonth = schedule?.currentMonth === currentMonth && schedule?.status === "active";
            const isOverdue = schedule?.status === "overdue";

            let rentBtnConfig = null;
            if (isAccepted && isRent) {
              if (!schedule) {
                rentBtnConfig = { label: "Pay First Month", color: "bg-indigo-600 hover:bg-indigo-700", disabled: false, icon: <CreditCard size={15} /> };
              } else if (isOverdue) {
                rentBtnConfig = { label: "Pay Now — Overdue", color: "bg-indigo-600 hover:bg-indigo-700", disabled: false, icon: <AlertTriangle size={15} /> };
              } else if (isPaidThisMonth) {
                rentBtnConfig = { label: "Paid", color: "bg-gray-100 text-gray-400", disabled: true, icon: <CheckCircle size={15} /> };
              } else {
                rentBtnConfig = {
                  label: `Pay This Month (due: ${formatDate(schedule.nextDueDate)})`,
                  color: "bg-indigo-600 hover:bg-indigo-700",
                  disabled: false,
                  icon: <CreditCard size={15} />,
                };
              }
            }

            return (
              <div key={deal._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  {deal.propertyImage
                    ? <img src={cloudinaryUrl(deal.propertyImage, { width: 600 })} alt={deal.propertyTitle} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Building2 size={32} className="text-gray-300" /></div>
                  }
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${deal.listingType === "rent" ? "bg-gray-100 text-blue-600 " : "bg-gray-100 text-emerald-600"
                    }`}>
                    {deal.listingType}
                  </span>

                </div>

                <div className="p-4">
                  <p className="font-semibold text-gray-900 line-clamp-1">{deal.propertyTitle}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={11} /> {deal.propertyCity}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                      <DollarSign size={13} /> {Number(deal.propertyPrice).toLocaleString()}
                      {deal.listingType === "rent" && <span className="text-xs font-normal text-gray-400">/mo</span>}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Tag size={11} /> {deal.propertyType}</p>
                  </div>

                  {/* Agent note */}
                  {deal.proposalNote ?
                    (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">

                        <p className="text-xs text-gray-700 italic"> Note : {deal.proposalNote} </p>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">

                        <p className="text-xs text-gray-400">No proposal note</p>
                      </div>
                    )
                  }

                  {/* Rent schedule info — accepted, rent, schedule */}
                  {isAccepted && isRent && schedule && (
                    <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${
                      isOverdue ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
                    }`}>
                      <div>
                        <p className={`text-xs font-semibold ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                          {isOverdue ? "Payment overdue" : "Total paid"}
                        </p>
                        <p className={`text-sm font-bold ${isOverdue ? "text-red-700" : "text-gray-800"}`}>
                          ${Number(schedule.totalPaid).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Next due</p>
                        <p className="text-xs font-semibold text-gray-600">{formatDate(schedule.nextDueDate)}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 space-y-2">

                    {/* pending - accept / reject */}
                    {isPendingP && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespond(deal._id, "accepted")}
                          disabled={isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700  text-white  rounded-xl text-sm font-semibold transition disabled:opacity-70"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleRespond(deal._id, "rejected")}
                          disabled={isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-50  text-indigo-600 hover:bg-gray-100  rounded-xl text-sm font-semibold border border-gray-200 transition disabled:opacity-70"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}

                    {/* accepted — sell → simple payment button */}
                    {isAccepted && !isRent && (
                      <button
                        onClick={() => setPaymentDeal(deal)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
                      >
                        <CreditCard size={15} />
                        Proceed to Payment
                      </button>
                    )}

                    {/* accepted — rent → dynamic schedule-aware button */}
                    {isAccepted && isRent && rentBtnConfig && (
                      <button
                        onClick={() => !rentBtnConfig.disabled && setPaymentDeal(deal)}
                        disabled={rentBtnConfig.disabled}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-xl text-sm font-semibold transition shadow-md disabled:shadow-none disabled:cursor-not-allowed ${rentBtnConfig.color}`}
                      >
                        {rentBtnConfig.icon}
                        {rentBtnConfig.label}
                      </button>
                    )}

                    {/* completed */}
                    {isCompleted && (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-indigo-600 rounded-xl border border-indigo-100 text-sm font-semibold">
                        <CheckCircle size={14} /> Payment Completed
                      </div>
                    )}

                    {/* none */}
                    {deal.proposalStatus === "none" && (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-500 rounded-xl  border border-indigo-100 text-sm ">
                        <Clock size={14} /> Waiting for agent's proposal
                      </div>
                    )}

                    {/* rejected */}
                    {deal.proposalStatus === "rejected" && (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-red-500 rounded-xl  border border-indigo-100 text-sm font-semibold">
                        <XCircle size={14} /> Proposal rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {paymentDeal && (
        <PaymentModal
          deal={paymentDeal}
          currentUser={currentUser}
          month={paymentDeal.listingType === "rent" ? new Date().toISOString().slice(0, 7) : null}
          onClose={() => setPaymentDeal(null)}
          onPaymentSuccess={() => {
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful!',
              text: 'The transaction has been completed.',
              timer: 2000,
              showConfirmButton: false,
              customClass: { popup: 'rounded-2xl' }
            });
            setPaymentDeal(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default MyDeals;