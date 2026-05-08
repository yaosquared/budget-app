import axios from "axios";
import { IBudgetFormData, IBudgetsResponse } from "../types/budget";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchBudgets = async ({ pageParam = 1 }: QueryFunctionContext) => {
  const res = await axios.post<IBudgetsResponse>(
    `${import.meta.env.VITE_API_URL}/api/budgets?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return res.data;
};

export const createBudget = async (payload: IBudgetFormData) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/budgets/new`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      ...payload,
    },
  );

  return res.data;
};

export const updateBudget = async (payload: IBudgetFormData) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/budgets/edit`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      ...payload,
    },
  );

  return res.data;
};

export const deleteBudget = async (id: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/budgets/delete`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      id,
    },
  );

  return res.data;
};
