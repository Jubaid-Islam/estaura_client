import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getAllAgents } from "../../api/usersApi";


const useAllAgents = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: () => getAllAgents(axiosSecure),
  });

  return [data, isLoading];
};

export default useAllAgents;