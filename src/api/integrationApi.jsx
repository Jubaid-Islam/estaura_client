export const getConnectApi = async (axiosSecure) => {
    const res = await axiosSecure.get("/integration/connected-api")
    return res.data
}
export const getApiStatus = async (axiosSecure) => {
    const res = await axiosSecure.get("/integration/api-status")
    return res.data
}
export const getApiList = async (axiosSecure) => {
    const res = await axiosSecure.get("/integration/api-list")
    return res.data
}

export const syncApiData = async (axiosSecure, id) => {
  const res = await axiosSecure.post(`/integration/sync/${id}`)
  return res.data
}

export const connectApi = async (apiData, axiosSecure) => {
    const res = await axiosSecure.post("/integration/connect-api", apiData)
    return res.data
}

export const disconnectApi = async (axiosSecure, id) => {
  const res = await axiosSecure.delete(`/integration/disconnect-api/${id}`)
  return res.data
}