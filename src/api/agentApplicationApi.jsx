export const submitApplication = async (data, axiosSecure) => {
  const res = await axiosSecure.post("/agent-applications", data);
  return res.data;
};

export const getMyApplication = async (axiosSecure) => {
  const res = await axiosSecure.get("/agent-applications/my-application");
  return res.data;
};

export const getAllApplications = async (axiosSecure) => {
  const res = await axiosSecure.get("/agent-applications/all");
  return res.data;
};

export const getPendingApplications = async (axiosSecure) => {
  const res = await axiosSecure.get("/agent-applications/pending");
  return res.data;
};

export const approveApplication = async (id, axiosSecure) => {
  const res = await axiosSecure.patch(`/agent-applications/approve/${id}`);
  return res.data;
};

export const rejectApplication = async (id, axiosSecure) => {
  const res = await axiosSecure.patch(`/agent-applications/reject/${id}`);
  return res.data;
};

export const deleteApplication = async (id, axiosSecure) => {
  const res = await axiosSecure.delete(`/agent-applications/${id}`);
  return res.data;
};
