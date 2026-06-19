import useApiStatus from "../../../../../hooks/useApiStatusjsx"
import useSyncApiData from "../../../../../hooks/useSyncApiData"
import useDisconnectApi from "../../../../../hooks/useDisconnectApi"



export default function ApiStatus() {

  const { mutateAsync: syncApiData, isPending } = useSyncApiData()
  const { data: apis = [], isLoading, refetch } = useApiStatus()
  const { mutateAsync: disconnectApi } = useDisconnectApi()

  const handleUpdate = async (id) => {
    try {
      await syncApiData(id)
      alert("API Updated Successfully")
      refetch()
    } catch (error) {
      console.error(error)
      alert("Update failed")
    }
  }


   const handleDisconnect = async (id) => {

    try {

      await disconnectApi(id)

      alert("API Disconnected")

    } catch (error) {

      console.error(error)

      alert("Failed to disconnect API")

    }

  }


  if (isLoading) {
    return <p>Loading APIs...</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        Connected APIs
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">API Name</th>
              <th className="p-3 text-left">Endpoint</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {apis.map((api) => (

              <tr key={api._id} className="border-t">

                <td className="p-3 font-medium">
                  {api.name}
                </td>

                <td className="p-3 text-sm text-gray-600">
                  {api.endpoint}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {api.status}
                  </span>
                </td>

                <td className="p-3 text-sm text-gray-500">
                  {new Date(api.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 text-right">

                  <button
                    onClick={() => handleUpdate(api._id)}
                    disabled={isPending}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {isPending ? "Syncing..." : "Update API"}
                  </button>

                  <button
                    onClick={() => handleDisconnect(api._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded"
                  >
                    Disconnect
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}