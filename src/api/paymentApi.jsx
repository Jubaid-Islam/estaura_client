export const createPaymentIntent = async (data, axiosSecure) => {
  const res = await axiosSecure.post("/payments/create-intent", data);
  return res.data;
};