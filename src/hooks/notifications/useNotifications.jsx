import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {
  getNotifications, markAllNotificationsRead, markOneNotificationRead,
} from "../../api/notificationsApi";

 
const useNotifications = (recipientId, recipientRole) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const queryKey = ["notifications", recipientId, recipientRole];

  const { data = [], isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => getNotifications(recipientId, recipientRole, axiosSecure),
    enabled: !!recipientId && !!recipientRole,
    select: (data) => data.data,
    refetchInterval: 3000,
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => markAllNotificationsRead(recipientId, recipientRole, axiosSecure),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const { mutate: markOneRead } = useMutation({
    mutationFn: (id) => markOneNotificationRead(id, axiosSecure),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const unreadCount = data?.filter((n) => !n.isRead).length || 0;

  return { notifications: data, isLoading, refetch, markAllRead, markOneRead, unreadCount };
};

export default useNotifications;