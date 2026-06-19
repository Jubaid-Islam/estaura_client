import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getPendingProperties } from "../../api/PropertyApi";


const usePendingProperties = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["pendingProperties"],
    queryFn: () => getPendingProperties(axiosSecure),
    select: (data) => data.data,
  });

  return [data, isLoading, refetch];
};

export default usePendingProperties;