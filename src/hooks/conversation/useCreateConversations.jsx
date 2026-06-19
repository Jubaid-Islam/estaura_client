import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { createConversation } from "../../api/conversationApi";

const useCreateConversation = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => createConversation(data, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return { createConversation: mutateAsync, isPending };
};

export default useCreateConversation;