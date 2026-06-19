import { useQuery } from "@tanstack/react-query"
import useAxiosSecure from "../../axios/useAxiosSecure"
import useUser from "../user/useUser"
import { getAssignedProperties } from "../../api/PropertyApi"

const useAssignedProperties = () => {

  const axiosSecure = useAxiosSecure()
  const { data: currentUser } = useUser()

  const {
    data: properties = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['assignedProperties', currentUser?._id],

    queryFn: async () => {
      return await getAssignedProperties(
        currentUser._id,
        axiosSecure
      )
    },

    enabled: !!currentUser?._id
  })

  return [properties, isLoading, refetch]
}

export default useAssignedProperties