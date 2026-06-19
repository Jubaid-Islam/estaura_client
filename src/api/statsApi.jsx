// admin 
export const fetchAdminOverview = async (axios) => {
  const res = await axios.get("/stats/admin/overview");
  return res.data.data;
};

export const fetchAdminRevenue = async (axios) => {
  const res = await axios.get("/stats/admin/revenue");
  return res.data.data;
};

export const fetchAdminPropertyStatus = async (axios) => {
  const res = await axios.get("/stats/admin/property-status");
  return res.data.data;
};

export const fetchAdminDeals = async (axios) => {
  const res = await axios.get("/stats/admin/deals");
  return res.data.data;
};

export const fetchAdminPendingList = async (axios) => {
  const res = await axios.get("/stats/admin/pending-list");
  return res.data.data;
};



// agent
export const fetchAgentOverview = async (id, axios) => {
  const res = await axios.get(`/stats/agent/${id}/overview`);
  return res.data.data;
};

export const fetchAgentRevenue = async (id, axios) => {
  const res = await axios.get(`/stats/agent/${id}/revenue`);
  return res.data.data;
};

export const fetchAgentAssignedPerMonth = async (id, axios) => {
  const res = await axios.get(`/stats/agent/${id}/assigned-per-month`);
  return res.data.data;
};

export const fetchAgentProposalConversion = async (id, axios) => {
  const res = await axios.get(`/stats/agent/${id}/proposal-conversion`);
  return res.data.data;
};

export const fetchAgentDealsPerMonth = async (id, axios) => {
  const res = await axios.get(`/stats/agent/${id}/deals-per-month`);
  return res.data.data;
};

export const fetchAgentRecentConversations = async (id, axios) => {
  const res = await axios.get(`/stats/agent/${id}/recent-conversations`);
  return res.data.data;
};



// user
export const fetchUserOverview = async (id, axios) => {
  const res = await axios.get(`/stats/user/${id}/overview`);
  return res.data.data;
};

export const fetchUserPaymentHistory = async (id, axios) => {
  const res = await axios.get(`/stats/user/${id}/payment-history`);
  return res.data.data;
};

export const fetchUserDealProgress = async (id, axios) => {
  const res = await axios.get(`/stats/user/${id}/deal-progress`);
  return res.data.data;
};

export const fetchUserPropertyType = async (id, axios) => {
  const res = await axios.get(`/stats/user/${id}/property-type`);
  return res.data.data;
};

export const fetchUserSubmittedProperties = async (id, axios) => {
  const res = await axios.get(`/stats/user/${id}/submitted-properties`);
  return res.data.data;
};