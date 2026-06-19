// useQuery দিয়ে
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAgentInfo } from "../../api/PropertyApi";

const useAgentInfo = (propertyId) => {
  const axiosSecure = useAxiosSecure();

  const { data: agentInfo, isLoading } = useQuery({
    queryKey: ["agentInfo", propertyId],
    queryFn: () => getAgentInfo(propertyId, axiosSecure),
    enabled: !!propertyId,
  });

  return [agentInfo, isLoading];
};

export default useAgentInfo;