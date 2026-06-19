import useAxiosSecure from '../../axios/useAxiosSecure'
import { syncApiData } from '../../api/integrationApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'


export default function useSyncApiData() {
    const queryClient = useQueryClient()
    const axiosSecure = useAxiosSecure()
    return useMutation({
        mutationFn: (id) => syncApiData(axiosSecure, id),
        onSuccess: () => {
            queryClient.invalidateQueries(["data"])
            queryClient.invalidateQueries(["api-status"])
        }
    })
}
