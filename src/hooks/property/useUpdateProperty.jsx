// hooks/property/useUpdateProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProperty } from '../../api/PropertyApi';
import useAxiosSecure from '../../axios/useAxiosSecure';

const useUpdateProperty = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => 
        updateProperty(id, data, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["pendingProperties"] });
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
    }
  })
  }
export default useUpdateProperty;