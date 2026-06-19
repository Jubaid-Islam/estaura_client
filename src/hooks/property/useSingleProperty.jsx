import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getSingleProperty } from "../../api/PropertyApi";

const useSingleProperty = () => {
    const {id} = useParams()
    const axiosSecure = useAxiosSecure()

    return useQuery ({
        queryKey: ['property', id],
        queryFn: () => getSingleProperty(id, axiosSecure),
        enabled: !!id
    })
}

export default useSingleProperty;