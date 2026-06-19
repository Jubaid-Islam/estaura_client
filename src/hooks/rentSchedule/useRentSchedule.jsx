// useRentSchedule.jsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../axios/useAxiosSecure";
import {
  createOrUpdateSchedule,
  getClientSchedules,
  checkOverdueSchedules,
  sendDueReminders,
} from "../../api/rentScheduleApi";

// get rent schedules
export const useClientSchedules = (clientId) => {
  const axiosSecure = useAxiosSecure();
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["clientSchedules", clientId],
    queryFn: () => getClientSchedules(clientId, axiosSecure),
    select: (data) => data.data,
    enabled: !!clientId,
  });
  return { schedules: data, isLoading, refetch };
};

// post - schedule create or update
export const useCreateOrUpdateSchedule = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => createOrUpdateSchedule(data, axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientSchedules"] });
    },
  });
  return { createOrUpdateSchedule: mutateAsync, isPending };
};

// post - overdue check 
export const useCheckOverdueSchedules = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => checkOverdueSchedules(axiosSecure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientSchedules"] });
    },
  });
  return { checkOverdueSchedules: mutateAsync, isPending };
};

// post - due reminder trigger 
export const useSendDueReminders = () => {
  const axiosSecure = useAxiosSecure();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => sendDueReminders(axiosSecure),
  });
  return { sendDueReminders: mutateAsync, isPending };
};