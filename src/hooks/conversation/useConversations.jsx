import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAgentConversations, getClientConversations, markConversationAsRead } from "../../api/conversationApi";


export const useConversations = (userId, role) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["conversations", userId, role],
    queryFn: () =>
      role === "agent"
        ? getAgentConversations(userId, axiosSecure)
        : getClientConversations(userId, axiosSecure),
    enabled: !!userId && !!role,
    select: (data) => data.data,
    refetchInterval: 5000, 
  });

  return { conversations: data, isLoading, refetch };
};



export const useMarkConversationAsRead =() => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {mutateAsync, isPending } = useMutation({
    mutationFn: (conversationId) => markConversationAsRead(conversationId, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  })
  return { markConversationAsRead: mutateAsync, isPending}
} 

