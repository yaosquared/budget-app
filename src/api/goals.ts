import axios from "axios";
import { QueryFunctionContext } from "@tanstack/vue-query";

import { IGoalFormData, IGoalsResponse, IGoalUpdateData } from "../types/goals";

export const fetchGoals = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext) => {
  const [, statusFilter] = queryKey;

  const res = await axios.post<IGoalsResponse>(
    `${import.meta.env.VITE_API_URL}/api/goals?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      status: statusFilter,
    },
  );

  return res.data;
};

export const createGoal = async (payload: IGoalFormData) => {
  const { dueDate, ...rest } = payload;

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/goals/new`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      ...rest,
      due_date: dueDate,
    },
  );

  return res.data;
};

export const updateGoal = async (payload: IGoalUpdateData) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/goals/edit`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      ...payload,
    },
  );

  return res.data;
};
