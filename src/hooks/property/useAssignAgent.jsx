import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignAgent } from "../../api/PropertyApi";
import useAxiosSecure from "../../axios/useAxiosSecure";


const useAssignAgent = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, agentId }) =>
      assignAgent(propertyId, agentId, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
    }
  });
};

export default useAssignAgent;