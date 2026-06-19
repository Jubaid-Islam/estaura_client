import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAgentTransactions } from "../../api/transactionApi";

const useAgentTransactions = (agentId) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["agentTransactions", agentId],
    queryFn: () => getAgentTransactions(agentId, axiosSecure),
    enabled: !!agentId,
    select: (data) => data.data,
  });

  const buyTransactions = data.filter(t => t.paymentType === "buy");
  const rentTransactions = data.filter(t => t.paymentType === "rent");

  return { transactions: data, buyTransactions, rentTransactions, isLoading, refetch };
};

export default useAgentTransactions;