import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAllTransactions } from "../../api/transactionApi";

const useAllTransactions = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["allTransactions"],
    queryFn: () => getAllTransactions(axiosSecure),
    select: (data) => data.data,
  });

  const buyTransactions = data.filter(t => t.paymentType === "buy");
  const rentTransactions = data.filter(t => t.paymentType === "rent");
  const totalRevenue = data.reduce((sum, t) => sum + (t.amount || 0), 0);
  const buyRevenue = buyTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const rentRevenue = rentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return { transactions: data, buyTransactions, rentTransactions, totalRevenue, buyRevenue, rentRevenue, isLoading, refetch };
};

export default useAllTransactions;