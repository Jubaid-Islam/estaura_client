import React, { useState } from "react";
import {
  ArrowLeft, Building2, CreditCard,
  Calendar, Home, Key,
  Tag,
  Dot
} from "lucide-react";
import useUser from "../../../../../hooks/user/useUser";
import useClientTransactions from "../../../../../hooks/transactions/useClientTransactions";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const MyTransactions = () => {
  const { data: currentUser } = useUser();
  const clientId = currentUser?._id?.toString();
  const { buyTransactions, rentTransactions, transactions, isLoading } = useClientTransactions(clientId);

  const [activeFilter, setActiveFilter] = useState("all");

  const totalBuy = buyTransactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalRent = rentTransactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalAll = totalBuy + totalRent;

  const displayedBuy = activeFilter === "rent" ? [] : buyTransactions;
  const displayedRent = activeFilter === "buy" ? [] : rentTransactions;

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dm-sans">
        <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-7 w-40 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100"></div>)}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dm-sans">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-6">


          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold text-gray-900">My Transactions : </h1>
            {transactions.length > 0 && (
              <span className="px-2 py-0.5 text-indigo-600 text-xl md:text-2xl mt-1 font-bold">
                {transactions.length}
              </span>
            )}
          </div>

          {/* filter */}
          <div className="flex items-center max-w-[190px] bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1 ml-auto sm:ml-0">
            {[
              { key: "all", label: "All" },
              { key: "buy", label: "Purchases" },
              { key: "rent", label: "Rent" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeFilter === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>


        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={28} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">No transactions yet</h3>
            <p className="text-sm text-gray-400 mt-1">Your payment history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

              {/* Total Spent — primary highlight */}
              <div className="border-b border-gray-100 pb-3 mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total spent</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${Number(totalAll).toLocaleString()}
                </p>
              </div>

              {/* stats */}
              <div className="flex flex-col md:flex-row md:gap-6 space-y-3 md:space-y-0">

                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <Dot size={30} className="text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-700 ">
                    <span className="font-semibold text-gray-900 ">${Number(totalBuy).toLocaleString()} </span> purchases
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <Dot size={30} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">${Number(totalRent).toLocaleString()}</span> rent paid
                  </span>
                </div>

              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
                <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reference</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</div>
              </div>

              {[...displayedBuy, ...displayedRent].length === 0 ? (
                <div className="text-center py-14">
                  <p className="text-sm text-gray-400">No transactions for this filter.</p>
                </div>
              ) : (
                [...displayedBuy, ...displayedRent]
                  .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt))
                  .map((t, i, arr) => (
                    <TxRow key={t._id} transaction={t} isLast={i === arr.length - 1} showClient={false} />
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TxRow = ({ transaction, isLast, showClient = true }) => (
  <>
    <div className={`hidden md:grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50/60 transition ${!isLast ? "border-b border-gray-50" : ""}`}>
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {transaction.propertyImage ? (
            <img src={cloudinaryUrl(transaction.propertyImage, { width: 90 })} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Building2 size={16} className="text-gray-300" /></div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{transaction.propertyTitle || "Property"}</p>
          {showClient && <p className="text-xs text-gray-400 truncate mt-0.5">{transaction.clientEmail}</p>}
        </div>
      </div>

      {/* Listing type */}
      <div className="col-span-2">
        <span className={`inline-flex items-center py-1 gap-2 rounded-full text-xs font-semibold uppercase ${transaction.paymentType === "rent"
          ? " text-blue-600"
          : "text-emerald-600"
          }`}>
          <Tag size={12} />
          {transaction.paymentType === "rent" ? "Rent" : "Buy"}
        </span>
      </div>
      <div className="col-span-2">
        <p className="text-sm text-gray-700">{formatDate(transaction.paidAt || transaction.createdAt)}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatTime(transaction.paidAt || transaction.createdAt)}</p>
      </div>

      <div className="col-span-2">
        <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-lg inline-block truncate max-w-full">
          {transaction.transactionRef || transaction.stripePaymentId?.slice(-12) || "—"}
        </p>
        {transaction.month && <p className="text-xs text-blue-500 font-medium mt-1">{transaction.month}</p>}
      </div>

      <div className="col-span-2 text-right">
        <p className="text-sm font-bold text-indigo-600">${Number(transaction.amount).toLocaleString()}</p>
        <span className="text-xs font-semibold text-emerald-700 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
          {transaction.status || "paid"}
        </span>
      </div>
    </div>

    {/* mobile */}
    <div className={`md:hidden px-4 py-4.5 hover:bg-gray-50 transition ${!isLast ? "border-b border-gray-100" : ""}`}>

      {/* Top row — type, amount, date */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2.5">
        <div className="flex items-center gap-5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${transaction.paymentType === "rent"
              ? "bg-gray-50 text-blue-700"
              : "bg-gray-50 text-emerald-700"
            }`}>
            {transaction.paymentType === "rent" ? "Rent" : "Buy"}
          </span>
          <span className="text-sm font-bold text-indigo-600">
            ${Number(transaction.amount).toLocaleString()}
          </span>
        </div>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar size={11} />
          {formatDate(transaction.paidAt || transaction.createdAt)}
        </span>
      </div>

      {/* Bottom row — image, info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {transaction.propertyImage ? (
            <img
              src={cloudinaryUrl(transaction.propertyImage, { width: 96 })}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 size={16} className="text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-900 truncate">
            {transaction.propertyTitle || "Property"}
          </p>
          {showClient && (
            <p className="text-[11px] text-gray-400 truncate mt-0.5">
              {transaction.clientEmail}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-50 text-emerald-700 capitalize">
              {transaction.status || "paid"}
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              #{transaction.transactionRef || transaction.stripePaymentId?.slice(-10) || "—"}
            </span>
          </div>
        </div>
      </div>

    </div>
  </>
);
export default MyTransactions;