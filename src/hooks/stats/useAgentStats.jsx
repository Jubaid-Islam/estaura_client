import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {
  fetchAgentOverview,
  fetchAgentRevenue,
  fetchAgentAssignedPerMonth,
  fetchAgentProposalConversion,
  fetchAgentDealsPerMonth,
  fetchAgentRecentConversations,
} from "../../api/statsApi";

const useAgentStats = (agentId) => {
  const axios = useAxiosSecure();
  const enabled = !!agentId;

  const overview = useQuery({
    queryKey: ["agentOverview", agentId],
    queryFn: () => fetchAgentOverview(agentId, axios), enabled
  });

  const revenue = useQuery({
    queryKey: ["agentRevenue", agentId],
    queryFn: () => fetchAgentRevenue(agentId, axios), enabled
  });

  const assigned = useQuery({
    queryKey: ["agentAssigned", agentId],
    queryFn: () => fetchAgentAssignedPerMonth(agentId, axios), enabled
  });

  const proposal = useQuery({
    queryKey: ["agentProposal", agentId],
    queryFn: () => fetchAgentProposalConversion(agentId, axios), enabled
  });

  const dealsPerMonth = useQuery({
    queryKey: ["agentDealsPerMonth", agentId],
    queryFn: () => fetchAgentDealsPerMonth(agentId, axios), enabled
  });
  
  const recentConvs = useQuery({
    queryKey: ["agentRecentConvs", agentId],
    queryFn: () => fetchAgentRecentConversations(agentId, axios), enabled
  });

  const isLoading = overview.isLoading || revenue.isLoading || assigned.isLoading || proposal.isLoading;

  return {
    overview: overview.data,
    revenue: revenue.data,
    assigned: assigned.data,
    proposal: proposal.data,
    dealsPerMonth: dealsPerMonth.data,
    recentConvs: recentConvs.data || [],
    isLoading,
  };
};

export default useAgentStats;