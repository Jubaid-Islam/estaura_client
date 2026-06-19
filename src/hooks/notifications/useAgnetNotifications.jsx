import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {getAgentNotifications, markNotificationsRead } from "../../api/notificationsApi";

const useAgentNotifications = (agentId) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["notifications", agentId],
    queryFn: () => getAgentNotifications(agentId, axiosSecure),
    enabled: !!agentId,
    select: (data) => data.data,
    refetchInterval: 3000,
  });

  const { mutate: markRead } = useMutation({
    mutationFn: () => markNotificationsRead(agentId, axiosSecure),
    onSuccess: () => queryClient.invalidateQueries(["notifications", agentId]),
  });

  const unreadCount = data?.filter((n) => !n.isRead).length || 0;

  return { notifications: data, isLoading, refetch, markRead, unreadCount };
};

export default useAgentNotifications;