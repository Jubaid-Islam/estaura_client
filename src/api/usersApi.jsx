export const saveGoogleUser = async (user, axiosSecure) => {
  const response = await axiosSecure.post('/users/google', {
    name: user.displayName,
    email: user.email,
  },
    {
      withCredentials: true
    }
  );
  return response.data;
};

export const getCurrentUser = async (axiosSecure) => {
  const res = await axiosSecure.get("/users/me")
  return res.data
}

export const allUsers = async (axiosSecure) => {
  const res = await axiosSecure.get("/users/all-users")
  return res.data
}

export const updateRole = async (id, role, axiosSecure) => {
  const res = await axiosSecure.patch(`/users/role/${id}`, { role })
  return res.data
}

export const deleteUser = async (id, axiosSecure) => {
  const res = await axiosSecure.delete(`/users/${id}`)
  return res.data
}

export const getAllAgents = async (axiosSecure) => {
  const res = await axiosSecure.get("/users/all-agents");
  return res.data;
};