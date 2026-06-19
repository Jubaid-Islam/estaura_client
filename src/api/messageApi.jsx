export const getMessages = async (conversationId, axiosSecure) => {
  const res = await axiosSecure.get(`/messages/${conversationId}`);
  return res.data;
};

export const sendMessage = async (conversationId, data, axiosSecure) => {
  const res = await axiosSecure.post(`/messages/${conversationId}`, data);
  return res.data;
};

export const markMessagesRead = async (conversationId, recipientId, axiosSecure) => {
  const res = await axiosSecure.patch(`/messages/read/${conversationId}`, { recipientId });
  return res.data;
};

export const updateConversationDealStatus = async (conversationId, data, axiosSecure) => {
  const res = await axiosSecure.patch(`/messages/deal-status/${conversationId}`, data);
  return res.data;
};