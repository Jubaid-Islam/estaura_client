import React, { useState } from "react";
import { ArrowLeft, Building2, CreditCard, Calendar, Dot, Tag } from "lucide-react";
import useAllTransactions from "../../../../../hooks/transactions/useAllTransactions";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const TxRow = ({ transaction, isLast }) => {
  const isRent = transaction.paymentType === "rent";
  const dateStr = transaction.paidAt || transaction.createdAt;

  return (
    <>
      {/* Desktop */}
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
            <p className="text-xs text-gray-400 truncate mt-0.5">{transaction.clientEmail}</p>
          </div>
        </div>

        <div className="col-span-2">
          <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase ${isRent ? "text-blue-600" : "text-emerald-600"}`}>
            <Tag size={12} />
            {isRent ? "Rent" : "Buy"}
          </span>
        </div>

        <div className="col-span-2">
          <p className="text-sm text-gray-700">{formatDate(dateStr)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatTime(dateStr)}</p>
        </div>

        <div className="col-span-2">
          <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-lg inline-block truncate max-w-full">
            {transaction.transactionRef || transaction.stripePaymentId?.slice(-12) || "—"}
          </p>
        </div>

        <div className="col-span-2 text-right">
          <p className="text-sm font-bold text-indigo-600">${Number(transaction.amount).toLocaleString()}</p>
          <span className="text-xs font-semibold text-emerald-700 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
            {transaction.status || "paid"}
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div className={`md:hidden px-4 py-3.5 hover:bg-gray-50 transition ${!isLast ? "border-b border-gray-200/50" : ""}`}>

        {/* Top row — type + amount | date */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
          <div className="flex items-center gap-5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              isRent ? "bg-gray-50 text-blue-700" : "bg-gray-50 text-emerald-700"
            }`}>
              {isRent ? "Rent" : "Buy"}
            </span>
            <span className="text-xs font-bold text-indigo-600">
              ${Number(transaction.amount).toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(dateStr)}
          </span>
        </div>

        {/* Bottom row — image and info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {transaction.propertyImage ? (
              <img src={cloudinaryUrl(transaction.propertyImage, { width: 96 })} alt="" loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Building2 size={16} className="text-gray-300" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{transaction.propertyTitle || "Property"}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{transaction.clientEmail}</p>
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
};

const Transactions = () => {
  const { buyTransactions, rentTransactions, transactions, totalRevenue, buyRevenue, rentRevenue, isLoading } = useAllTransactions();
  const [activeFilter, setActiveFilter] = useState("all");

  const displayedBuy = activeFilter === "rent" ? [] : buyTransactions;
  const displayedRent = activeFilter === "buy" ? [] : rentTransactions;
  const allFiltered = [...displayedBuy, ...displayedRent];

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-7 w-40 bg-gray-200 rounded-lg" />
          <div className="h-24 bg-white rounded-2xl border border-gray-100" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 dm-sans">
      <div className="max-w-5xl mx-auto">

       

        {/* Header and filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Transactions :</h1>
            {transactions.length > 0 && (
              <span className="text-indigo-600 text-xl md:text-2xl font-bold">
                {transactions.length}
              </span>
            )}
          </div>
          <div className="flex items-center max-w-[190px] bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1 ml-auto sm:ml-0">
            {[{ key: "all", label: "All" }, { key: "buy", label: "Buy" }, { key: "rent", label: "Rent" }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeFilter === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={28} className="text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">No transactions yet</h3>
            <p className="text-sm text-gray-400 mt-1">Payments will appear here once clients start paying.</p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Stats*/}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="border-b border-gray-100 pb-2 mb-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total revenue</p>
                <p className="text-xl font-bold text-indigo-600">
                  ${Number(totalRevenue).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:gap-6">
                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <Dot size={30} className="text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">${Number(buyRevenue).toLocaleString()}</span> from sales
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <Dot size={30} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">${Number(rentRevenue).toLocaleString()}</span> from rent
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
                <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Property / Client</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reference</div>
                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</div>
              </div>

              {allFiltered.length === 0 ? (
                <div className="text-center py-14">
                  <p className="text-sm text-gray-400">No transactions for this filter.</p>
                </div>
              ) : (
                allFiltered
                  .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt))
                  .map((t, i, arr) => <TxRow key={t._id} transaction={t} isLast={i === arr.length - 1} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;