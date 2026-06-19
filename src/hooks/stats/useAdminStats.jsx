import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {
  fetchAdminOverview,
  fetchAdminRevenue,
  fetchAdminPropertyStatus,
  fetchAdminDeals,
  fetchAdminPendingList,
} from "../../api/statsApi";

const useAdminStats = () => {
  const ax = useAxiosSecure();

  const overview = useQuery({
    queryKey: ["adminOverview"],
    queryFn: () => fetchAdminOverview(ax)
  });

  const revenue = useQuery({
    queryKey: ["adminRevenue"],
    queryFn: () => fetchAdminRevenue(ax)
  });

  const propertyStatus = useQuery({
    queryKey: ["adminPropertyStatus"],
    queryFn: () => fetchAdminPropertyStatus(ax)
  });

  const deals = useQuery({
    queryKey: ["adminDeals"],
    queryFn: () => fetchAdminDeals(ax)
  });

  const pendingList = useQuery({
    queryKey: ["adminPendingList"],
    queryFn: () => fetchAdminPendingList(ax)
  });

  const isLoading = overview.isLoading || revenue.isLoading || propertyStatus.isLoading || deals.isLoading;

  return {
    overview: overview.data,
    revenue: revenue.data,
    propertyStatus: propertyStatus.data,
    deals: deals.data,
    pendingList: pendingList.data || [],
    isLoading,
  };
};

export default useAdminStats;