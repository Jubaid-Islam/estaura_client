import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axiosSecure from "./axiosSecure";


const useAxiosSecure = () => {
    const { logOut } = useContext(AuthContext);

    useEffect(() => {
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (res) => res,
            async (err) => {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    await logOut();
                    window.location.href = '/signin';
                }
                return Promise.reject(err);
            }
        );

        return () => {
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut]);

    return axiosSecure;
};

export default useAxiosSecure;