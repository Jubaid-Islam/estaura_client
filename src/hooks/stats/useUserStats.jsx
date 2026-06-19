import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {
   fetchUserOverview,
   fetchUserPaymentHistory,
   fetchUserDealProgress,
   fetchUserPropertyType,
   fetchUserSubmittedProperties,
} from "../../api/statsApi";

const useUserStats = (clientId) => {
   const ax = useAxiosSecure();
   const enabled = !!clientId;

   const overview = useQuery({
      queryKey: ["userOverview", clientId],
      queryFn: () => fetchUserOverview(clientId, ax), enabled
   });

   const payments = useQuery({
      queryKey: ["userPayments", clientId],
      queryFn: () => fetchUserPaymentHistory(clientId, ax), enabled
   });

   const dealProgress = useQuery({
      queryKey: ["userDealProgress", clientId],
      queryFn: () => fetchUserDealProgress(clientId, ax), enabled
   });

   const propType = useQuery({
      queryKey: ["userPropType", clientId],
      queryFn: () => fetchUserPropertyType(clientId, ax), enabled
   });

   const submitted = useQuery({
      queryKey: ["userSubmitted", clientId],
      queryFn: () => fetchUserSubmittedProperties(clientId, ax), enabled
   });

   const isLoading = overview.isLoading || payments.isLoading;

   return {
      overview: overview.data,
      payments: payments.data,
      dealProgress: dealProgress.data || [],
      propType: propType.data,
      submitted: submitted.data || [],
      isLoading,
   };
};

export default useUserStats;