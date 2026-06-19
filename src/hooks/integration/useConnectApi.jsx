import { useMutation, useQueryClient } from "@tanstack/react-query"
import { connectApi } from "../../api/integrationApi"
import useAxiosSecure from "../../axios/useAxiosSecure"


const useConnectApi = () => {

  const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (apiData) => connectApi(apiData, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] })
    }
  })
}

export default useConnectApi