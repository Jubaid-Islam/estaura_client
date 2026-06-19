
export const createConversation = async (data, axiosSecure) => {
  const res = await axiosSecure.post("/conversations", data);
  return res.data;
};


export const getAgentConversations = async (agentId, axiosSecure) => {
  const res = await axiosSecure.get(`/conversations/agent/${agentId}`);
  return res.data;
};


export const getClientConversations = async (clientId, axiosSecure) => {
  const res = await axiosSecure.get(`/conversations/client/${clientId}`);
  return res.data;
};


export const checkConversation = async (propertyId, clientId, axiosSecure) => {
  const res = await axiosSecure.get(`/conversations/check/${propertyId}/${clientId}`);
  return res.data;
};


export const deleteConversation = async (conversationId, axiosSecure) => {
  const res = await axiosSecure.delete(`/conversations/${conversationId}`);
  return res.data;
};