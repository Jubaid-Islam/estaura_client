// api/rentScheduleApi.js

export const createOrUpdateSchedule = async (data, axiosSecure) => {
  const res = await axiosSecure.post("/rent-schedules", data);
  return res.data;
};

export const getClientSchedules = async (clientId, axiosSecure) => {
  const res = await axiosSecure.get(`/rent-schedules/client/${clientId}`);
  return res.data;
};

export const checkOverdueSchedules = async (axiosSecure) => {
  const res = await axiosSecure.post("/rent-schedules/check-overdue");
  return res.data;
};

export const sendDueReminders = async (axiosSecure) => {
  const res = await axiosSecure.post("/rent-schedules/send-reminders");
  return res.data;
};