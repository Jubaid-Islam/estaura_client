import React, { useState } from 'react';
import useApiList from "../../../../../hooks/integration/useApiList";
import { RefreshCw, Database } from 'lucide-react';

export default function ApiList() {
  const { data: records = [], isLoading, refetch, isFetching } = useApiList();
  const [isRotating, setIsRotating] = useState(false);

  const handleRefetch = async () => {
    setIsRotating(true);
    await refetch();
    setTimeout(() => setIsRotating(false), 600);
  };

  if (isLoading) return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-8 w-48 bg-gray-100 rounded-lg" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-gray-900">Synced data</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-medium">
                {records.length}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">Monitor all synchronized API records</p>
          </div>

          <button
            onClick={handleRefetch}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={isFetching || isRotating ? 'animate-spin' : ''}
            />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          {/* Desktop thead */}
          <div className="hidden md:grid grid-cols-[60px_1fr_1fr_90px_90px_100px] px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            {['ID', 'Name', 'Product', 'Price', 'Discount', 'Payment'].map((h, i) => (
              <span key={h} className={`text-[11px] uppercase tracking-wider text-gray-400 font-medium ${i >= 3 ? 'text-right' : ''}`}>
                {h}
              </span>
            ))}
          </div>

          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                <Database size={18} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No records found</p>
              <p className="text-xs text-gray-400">Click refresh to sync data.</p>
            </div>
          ) : records.map((item, i) => (
            <div
              key={item._id}
              className={`flex flex-col md:grid md:grid-cols-[60px_1fr_1fr_90px_90px_100px] items-start md:items-center gap-2 md:gap-0 px-4 py-3 hover:bg-gray-50 transition-colors ${i < records.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              {/* ID */}
              <span className="text-[11px] font-mono text-gray-400">
                {item.id || item._id?.slice(-6)}
              </span>

              {/* Name */}
              <span className="text-[13px] font-medium text-gray-900">
                {item.name}
              </span>

              {/* Product */}
              <span className="text-[13px] text-gray-500">
                {item.product}
              </span>

              {/* Price */}
              <span className="text-[13px] text-gray-800 md:text-right">
                ${item.prize?.toLocaleString()}
              </span>

              {/* Discount */}
              <div className="md:text-right">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  -{item.discount}%
                </span>
              </div>

              {/* Payment */}
              <span className="text-[13px] font-medium text-purple-700 md:text-right">
                ${item.paid?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}