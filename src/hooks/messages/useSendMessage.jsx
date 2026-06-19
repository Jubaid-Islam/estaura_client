import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { sendMessage } from "../../api/messageApi";

const useSendMessage = (conversationId) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => sendMessage(conversationId, data, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return { sendMessage: mutateAsync, isPending };
};

export default useSendMessage;