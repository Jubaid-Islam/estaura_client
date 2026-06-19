import { useQuery } from "@tanstack/react-query"
import { use } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { getCurrentUser } from "../../api/usersApi"
import useAxiosSecure from "../../axios/useAxiosSecure"

const useUsers = () => {
  const axiosSecure = useAxiosSecure()
  const { user, loading } = use(AuthContext)
  
  return useQuery({
    queryKey: ["users", user?.email],
    queryFn: () => getCurrentUser(axiosSecure),
    enabled: !!user && !loading,
  })
}

export default useUsers