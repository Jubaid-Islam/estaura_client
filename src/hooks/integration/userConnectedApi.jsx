
import { useQuery } from '@tanstack/react-query'
import { getConnectApi } from '../../api/integrationApi'
import useAxiosSecure from '../../axios/useAxiosSecure'


export default function useUserConnectedApi() {
  const axiosSecure = useAxiosSecure()

  return useQuery({
    queryKey: ["apis"],
    queryFn: () => getConnectApi(axiosSecure)
  })
}
