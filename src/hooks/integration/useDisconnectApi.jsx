import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosSecure from "../../axios/useAxiosSecure"
import { disconnectApi } from "../../api/integrationApi"


export default function useDisconnectApi() {

  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => disconnectApi(axiosSecure, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["apis"])
      queryClient.invalidateQueries(["api-data"])
    }
  })

}