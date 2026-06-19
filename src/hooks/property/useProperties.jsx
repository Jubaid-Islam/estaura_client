import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getProperties } from "../../api/PropertyApi";

const useProperties = () => {
  const axiosSecure = useAxiosSecure();

  const { data: properties = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const data = await getProperties(axiosSecure);
      return data?.data || data;
    },
  });
  return [properties, isLoading, refetch, isError];

};

export default useProperties;

