import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getClientTransactions } from "../../api/transactionApi";

const useClientTransactions = (clientId) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["clientTransactions", clientId],
    queryFn: () => getClientTransactions(clientId, axiosSecure),
    enabled: !!clientId,
    select: (data) => data.data,
  });

  const buyTransactions  = data.filter(t => t.paymentType === "buy");
  const rentTransactions = data.filter(t => t.paymentType === "rent");

  return { transactions: data, buyTransactions, rentTransactions, isLoading, refetch };
};

export default useClientTransactions;