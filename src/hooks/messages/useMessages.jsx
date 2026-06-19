import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getMessages } from "../../api/messageApi";

const useMessages = (conversationId) => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId, axiosSecure),
    enabled: !!conversationId,
    select: (data) => data.data,
    refetchInterval: 5000, 
  });

  return { messages: data, isLoading, refetch };
};

export default useMessages;