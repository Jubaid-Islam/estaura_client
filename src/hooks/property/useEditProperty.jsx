import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { getEditProperty } from "../../api/PropertyApi";


const useEditProperty = () => {
    const {id} = useParams()
    const axiosSecure = useAxiosSecure()

    return useQuery ({
        queryKey: ['property', id],
        queryFn: () => getEditProperty(id, axiosSecure),
        enabled: !!id
    })
}

export default useEditProperty;