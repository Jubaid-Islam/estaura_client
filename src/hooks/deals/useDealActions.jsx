import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { sendProposal, respondToProposal } from "../../api/dealApi";

export const useSendProposal = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ dealId, data }) => sendProposal(dealId, data, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentDeals"] });
    },
  });

  return { sendProposal: mutateAsync, isPending };
};

export const useRespondToProposal = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ dealId, data }) => respondToProposal(dealId, data, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientDeals"] });
    },
  });

  return { respondToProposal: mutateAsync, isPending };
};