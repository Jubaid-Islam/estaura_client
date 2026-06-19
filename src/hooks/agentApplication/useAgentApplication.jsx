import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {
  submitApplication,
  getMyApplication,
  getAllApplications,
  getPendingApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
} from "../../api/agentApplicationApi";

// current user - application
export const useMyApplication = () => {
  const axiosSecure = useAxiosSecure();

  const { data = null, isLoading, refetch } = useQuery({
    queryKey: ["myApplication"],
    queryFn: () => getMyApplication(axiosSecure),
    select: (data) => data.data,
    refetchInterval: 15000,
  });

  return { application: data, isLoading, refetch };
};

// admin — all application
export const useAllApplications = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["allApplications"],
    queryFn: () => getAllApplications(axiosSecure),
    select: (data) => data.data,
  });

  return { applications: data, isLoading, refetch };
};

// admin — pending application 
export const usePendingApplications = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["pendingApplications"],
    queryFn: () => getPendingApplications(axiosSecure),
    select: (data) => data.data,
    refetchInterval: 15000,
  });

  return { applications: data, isLoading, refetch };
};

// application submit
export const useSubmitApplication = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (applicationData) => submitApplication(applicationData, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplication"] });
      queryClient.invalidateQueries({ queryKey: ["pendingApplications"] });
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });

  return { submitApplication: mutateAsync, isPending };
};

// admin — approve
export const useApproveApplication = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => approveApplication(id, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApplications"] });
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });

  return { approveApplication: mutateAsync, isPending };
};

// admin — reject
export const useRejectApplication = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => rejectApplication(id, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApplications"] });
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });

  return { rejectApplication: mutateAsync, isPending };
};


export const useDeleteApplication = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => deleteApplication(id, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
      queryClient.invalidateQueries({ queryKey: ["pendingApplications"] });
    },
  });
  return { deleteApplication: mutateAsync, isPending };
};