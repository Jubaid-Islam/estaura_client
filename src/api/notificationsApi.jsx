export const getNotifications = async (recipientId, recipientRole, axiosSecure) => {
  const res = await axiosSecure.get(`/notifications/${recipientId}/${recipientRole}`);
  return res.data;
};


export const markAllNotificationsRead = async (recipientId, recipientRole, axiosSecure) => {
  const res = await axiosSecure.patch(`/notifications/read-all/${recipientId}/${recipientRole}`);
  return res.data;
};

export const markOneNotificationRead = async (id, axiosSecure) => {
  const res = await axiosSecure.patch(`/notifications/read-one/${id}`);
  return res.data;
};