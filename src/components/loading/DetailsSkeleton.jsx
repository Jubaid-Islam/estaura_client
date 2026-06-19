import React from 'react'

export default function DetailsSkeleton() {
  return (
    <div>
           <div className="max-w-7xl mx-auto px-4 py-10 dm-sans mt-20">
    <div className="animate-pulse">
      {/* Image  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 h-[400px] bg-gray-200 rounded-2xl"></div>
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
        </div>
      </div>

      {/* Title & price */}
      <div className="h-8 w-2/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-7 w-32 bg-gray-200 rounded mb-6"></div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-6 bg-gray-200 rounded"></div>)}
      </div>

      {/* Description block */}
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Contact card placeholder */}
      <div className="bg-gray-100 rounded-2xl p-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>
        <div className="h-10 bg-gray-200 rounded mb-3"></div>
        <div className="h-10 bg-gray-200 rounded mb-3"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
    </div>
  )
}
