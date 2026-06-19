export const createTransaction = async (data, axiosSecure) => {
  const res = await axiosSecure.post("/transactions", data);
  return res.data;
};

export const getClientTransactions = async (clientId, axiosSecure) => {
  const res = await axiosSecure.get(`/transactions/client/${clientId}`);
  return res.data;
};

export const getAgentTransactions = async (agentId, axiosSecure) => {
  const res = await axiosSecure.get(`/transactions/agent/${agentId}`);
  return res.data;
};

export const getAllTransactions = async (axiosSecure) => {
  const res = await axiosSecure.get("/transactions");
  return res.data;
};