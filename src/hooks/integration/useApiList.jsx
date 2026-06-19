import React, { use } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../axios/useAxiosSecure'
import { getApiList } from '../../api/integrationApi'

export default function useApiList() {
    const axiosSecure = useAxiosSecure()
    const { loading } = use(AuthContext)
    return useQuery({
        queryKey: ["api-data"],
        queryFn: () => getApiList(axiosSecure),
        enabled: !loading,

    })
}
