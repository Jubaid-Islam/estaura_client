import { useQuery } from "@tanstack/react-query";
import { getTopRatedAgents } from "../../api/dealApi";
import useAxiosSecure from "../../axios/useAxiosSecure";


export const useTopRatedAgents = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: agents = [],isLoading, refetch, } = useQuery({
        queryKey: ["topRatedAgents"],
     queryFn: () => getTopRatedAgents(axiosSecure),

    });

    return [agents, isLoading, refetch];
};