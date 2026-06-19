import { useQuery } from "@tanstack/react-query"
import { use } from "react"
import { AuthContext } from "../../contexts/AuthContext"

import useAxiosSecure from "../../axios/useAxiosSecure"
import { allUsers } from "../../api/usersApi"

const useAllUsers = () => {
  const axiosSecure = useAxiosSecure()
  const { user, loading } = use(AuthContext)

  return useQuery({
    queryKey: ["allUsers", user?.email],

    queryFn: () => allUsers(axiosSecure),
    
    enabled: !!user && !loading,
  })
}

export default useAllUsers