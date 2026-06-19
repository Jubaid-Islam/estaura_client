import { Navigate } from "react-router"
import useUsers from "../../../../hooks/user/useUser"
import LoaderUi from "../../../loading/LoaderUi"


export default function Dashboard() {

  const { data: me, isLoading } = useUsers()

  if (isLoading) return <LoaderUi />

  if (me?.role === "admin") {
    return <Navigate to="/dashboard/admin-dashboard" replace />
  }

  if (me?.role === "agent") {
    return <Navigate to="/dashboard/agent-dashboard" replace />
  }

  return <Navigate to="/dashboard/user-dashboard" replace />
}