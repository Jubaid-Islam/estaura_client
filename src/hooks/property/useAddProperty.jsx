import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { addProperty } from "../../api/PropertyApi";

const useAddProperty = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => addProperty(axiosSecure, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["pendingProperties"] });
    }
  });
};

export default useAddProperty;