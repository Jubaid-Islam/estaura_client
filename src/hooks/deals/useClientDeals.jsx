import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getClientDeals } from "../../api/dealApi";

const useClientDeals = (clientId) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["clientDeals", clientId],
    queryFn: () => getClientDeals(clientId, axiosSecure),
    enabled: !!clientId,
    select: (data) => data.data,
    refetchInterval: 15000,
  });

  return { deals: data, isLoading, refetch };
};

export default useClientDeals;


