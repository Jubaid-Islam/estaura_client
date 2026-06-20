import React, { useState } from "react";
import {
  Building2, MapPin, Tag, DollarSign,
  ArrowLeft, Send, X, Clock, CheckCircle, FileText
} from "lucide-react";
import Swal from "sweetalert2";
import useUser from "../../../../../hooks/user/useUser";
import useAgentDeals from "../../../../../hooks/deals/useAgentDeals";
import { useSendProposal } from "../../../../../hooks/deals/useDealActions";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const PROPOSAL_STATUS = {
  none: { label: "No Proposal", color: "bg-gray-100 text-gray-500" },
  pending: { label: "Pending", color: "bg-gray-100 text-yellow-700" },
  accepted: { label: "Accepted", color: "bg-gray-100 text-emerald-700" },
  rejected: { label: "Rejected", color: "bg-gray-100 text-red-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-indigo-600" },
};

const AgentDeals = () => {
  const { data: currentUser } = useUser();
  const agentId = currentUser?._id?.toString();
  const { deals, isLoading, refetch } = useAgentDeals(agentId);
  const { sendProposal, isPending } = useSendProposal();

  const [selectedDeal, setSelectedDeal] = useState(null);
  const [proposalNote, setProposalNote] = useState("");

  const handleSendProposal = async () => {
    if (!selectedDeal) return;
    try {
      await sendProposal({
        dealId: selectedDeal._id,
        data: { proposalNote, agentName: currentUser?.name },
      });
      Swal.fire({ icon: "success", title: "Proposal Sent!", timer: 1500, showConfirmButton: false, customClass: { popup: "rounded-2xl" } });
      setSelectedDeal(null);
      setProposalNote("");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to send proposal.", "error");
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
    <div className="py-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">


      <div className="flex items-center gap-1 mb-4">
        <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Agent Deals :
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
          <p className="text-sm text-gray-400 mt-1">Close a deal in a conversation to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => {
            return (
              <div key={deal._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  {deal.propertyImage ? (
                    <img src={cloudinaryUrl(deal.propertyImage, { width: 600 })} alt={deal.propertyTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Building2 size={32} className="text-gray-300" /></div>
                  )}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase
                     ${deal.listingType === "rent" ? "bg-gray-100 text-blue-600" : "bg-gray-100 text-emerald-700"}`}>
                    {deal.listingType}
                  </span>

                </div>

                <div className="p-4">
                  <p className="font-semibold text-gray-900 line-clamp-1">{deal.propertyTitle}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={11} /> {deal.propertyCity}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-indigo-600 flex items-center gap-1"><DollarSign size={13} /> {Number(deal.propertyPrice).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Tag size={11} /> {deal.propertyType}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Client: <span className="font-medium text-gray-700">{deal.clientEmail}</span></p>
                  </div>
                  {deal.proposalNote ?
                    (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-xs text-gray-700 italic">Note :   {deal.proposalNote} </p>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-xs text-gray-400">No proposal note</p>
                      </div>
                    )
                  }
                  <div className="mt-3">
                    {deal.proposalStatus === "none" && (
                      <button onClick={() => setSelectedDeal(deal)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm  transition font-semibold">
                        <Send size={14} /> Send Proposal
                      </button>
                    )}
                    {deal.proposalStatus === "pending" && (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100/50 text-yellow-700 rounded-xl  border border-indigo-50 text-sm font-semibold">
                        <Clock size={14} /> Waiting for response
                      </div>
                    )}
                    {deal.proposalStatus === "accepted" && (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100/50 text-emerald-700 rounded-xl  border border-indigo-50 text-sm font-semibold ">
                        <CheckCircle size={14} /> Proposal Accepted
                      </div>
                    )}
                    {deal.proposalStatus === "completed" && (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100/50 text-indigo-600 rounded-xl  border border-indigo-50 text-sm font-semibold">
                        <CheckCircle size={14} /> Payment Completed
                      </div>
                    )}
                    {deal.proposalStatus === "rejected" && (
                      <button onClick={() => setSelectedDeal(deal)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white
                       hover:text-white rounded-xl text-sm hover:border-transparent transition font-semibold">
                        <Send size={14} /> Resend Proposal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Proposal Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedDeal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Send size={18} className="text-indigo-600" /> Send Proposal</h3>
              <button onClick={() => setSelectedDeal(null)} className="p-1 rounded-full hover:bg-gray-100 transition"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {selectedDeal.propertyImage
                    ? <img src={cloudinaryUrl(selectedDeal.propertyImage, { width: 120 })} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Building2 size={20} className="text-gray-300" /></div>
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedDeal.propertyTitle}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {selectedDeal.propertyCity}</p>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">${Number(selectedDeal.propertyPrice).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note (optional)</label>
                <textarea
                  rows={3}
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  placeholder="Add a note for the client..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-indigo-500 
                  focus:border-transparent outline-none transition"
                />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setSelectedDeal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSendProposal} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600
               hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-70">
                {isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={14} />}
                {isPending ? "Sending..." : "Send Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDeals;