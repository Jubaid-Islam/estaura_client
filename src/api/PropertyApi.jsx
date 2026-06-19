// post
export const addProperty = async (axiosSecure, data) => {
  const formData = new FormData();

  const { images, ...rest } = data;

  images.forEach(img => {
    formData.append("images", img);
  });

  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const res = await axiosSecure.post("/property/add-property", formData);

  return res.data;
};

export const submitProperty = async (axiosSecure, data) => {
  const formData = new FormData();
  const { images, ...rest } = data;

  images.forEach(img => formData.append("images", img));
  Object.entries(rest).forEach(([key, value]) => formData.append(key, value));

  const res = await axiosSecure.post("/property/submit-property", formData);
  return res.data;
};


// get
export const getProperties = async (axiosSecure) => {
  const res = await axiosSecure.get("/property/get-properties")
  return res.data
}

export const getSingleProperty = async (id, axiosSecure) => {
  const res = await axiosSecure.get(`/property/${id}`)
  return res.data
}

export const getEditProperty = async (id, axiosSecure) => {
  const res = await axiosSecure.get(`/property/edit-property/${id}`)
  return res.data
}

export const getAgentInfo = async (id, axiosSecure) => {
  const res = await axiosSecure.get(`/property/${id}/agent-info`)
  return res.data
}

export const getPendingProperties = async (axiosSecure) => {
  const res = await axiosSecure.get("/property/pending-properties");
  return res.data;
}

export const getAssignedProperties = async (agentId, axiosSecure) => {
  const res = await axiosSecure.get(`/property/agent/${agentId}`)
  return res.data.data
}


// patch
export const assignAgent = async (propertyId, agentId, axiosSecure) => {
  const res = await axiosSecure.patch(`/property/assign-agent/${propertyId}`,
    { agentId }
  );
  return res.data;
};

export const approveProperty = async (id, axiosSecure) => {
  const res = await axiosSecure.patch(`/property/approve/${id}`);
  return res.data;
};

export const rejectProperty = async (id, axiosSecure) => {
  const res = await axiosSecure.patch(`/property/reject/${id}`);
  return res.data;
};

export const updatePropertyStatus = async (id, status, axiosSecure) => {
  const res = await axiosSecure.patch(`/property/status/${id}`, { status });
  return res.data;
};
 
export const updateDealStatus = async (id, dealStatus, axiosSecure) => {
  const res = await axiosSecure.patch(`/property/deal-status/${id}`, { dealStatus });
  return res.data;
};
 




// delete
export const deleteProperty = async (id, axiosSecure) => {
  const res = await axiosSecure.delete(`/property/${id}`)
  return res.data
}

export const deletePropertyByAgent = async (id, axiosSecure) => {
  const res = await axiosSecure.delete(`/property/agent/${id}`)
  return res.data
}


// put
export const updateProperty = async (id, data, axiosSecure) => {
  const res = await axiosSecure.put(`/property/update-property/${id}`, data);
  return res.data;
};