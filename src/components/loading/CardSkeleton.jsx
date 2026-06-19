import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CardSkeleton = () => {
    return (
        <div className='mt-40 max-w-7xl mx-auto'>

            {/* filter */}
            <div>
                <Skeleton
                    height={220}
                    borderRadius="0px" />
            </div>

            {/*  card */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[...Array(9)].map((_, i) => (
                <div
                 key={i}
                 className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mt-10">
                    <Skeleton
                        height={220}
                        borderRadius="0px" />
                    <div className="p-4">

                        {/* Badge */}
                        <div className="flex gap-2 mb-4">
                            <Skeleton width={70} height={22} borderRadius={999} />
                            <Skeleton width={80} height={22} borderRadius={999} />
                        </div>

                        {/* Title */}
                        <Skeleton
                            height={28}
                            width="75%"
                            className="mb-3"
                        />

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-5">
                            <Skeleton circle width={14} height={14} />
                            <Skeleton width="60%" height={16} />
                        </div>

                        {/* Divider */}
                        <div className="mb-4">
                            <Skeleton height={1} />
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between">

                            {/* Stats */}
                            <div className="flex items-center gap-4">
                                <Skeleton width={20} height={16} />
                                <Skeleton width={20} height={16} />
                                <Skeleton width={20} height={16} />
                            </div>

                            {/* Price */}
                            <Skeleton width={80} height={24} />
                        </div>
                    </div>

                </div>
            ))}
        </div>
        </div>
    )
}

export default CardSkeleton