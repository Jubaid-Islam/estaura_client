export const getAgentDeals = async (agentId, axiosSecure) => {
  const res = await axiosSecure.get(`/deals/agent/${agentId}`);
  return res.data;
};

export const getClientDeals = async (clientId, axiosSecure) => {
  const res = await axiosSecure.get(`/deals/client/${clientId}`);
  return res.data;
};

export const getTopRatedAgents = async (axiosSecure) => {
  const res = await axiosSecure.get(`/deals/top-agents`);
  return res.data.data;
};

export const sendProposal = async (dealId, data, axiosSecure) => {
  const res = await axiosSecure.patch(`/deals/${dealId}/proposal`, data);
  return res.data;
};

export const respondToProposal = async (dealId, data, axiosSecure) => {
  const res = await axiosSecure.patch(`/deals/${dealId}/respond`, data);
  return res.data;
};

export const updateConversationDealStatus = async (conversationId, data, axiosSecure) => {
  const res = await axiosSecure.patch(`/messages/deal-status/${conversationId}`, data);
  return res.data;
};