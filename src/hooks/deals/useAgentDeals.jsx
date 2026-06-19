import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAgentDeals } from "../../api/dealApi";

const useAgentDeals = (agentId) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["agentDeals", agentId],
    queryFn: () => getAgentDeals(agentId, axiosSecure),
    enabled: !!agentId,
    select: (data) => data.data,
    refetchInterval: 15000,
  });

  return { deals: data, isLoading, refetch };
};

export default useAgentDeals;