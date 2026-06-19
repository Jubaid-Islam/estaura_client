import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAgentConversations, getClientConversations } from "../../api/conversationApi";


const useConversations = (userId, role) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["conversations", userId, role],
    queryFn: () =>
      role === "agent"
        ? getAgentConversations(userId, axiosSecure)
        : getClientConversations(userId, axiosSecure),
    enabled: !!userId && !!role,
    select: (data) => data.data,
    refetchInterval: 10000, 
  });

  return { conversations: data, isLoading, refetch };
};

export default useConversations;