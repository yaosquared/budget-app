import axios from "axios";
import { IBudgetsResponse } from "../types/budget";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchBudgets = async ({ pageParam = 1 }: QueryFunctionContext) => {
  const res = await axios.get<IBudgetsResponse>(
    `${import.meta.env.VITE_API_URL}/api/budgets?page=${pageParam}`,
  );
  return res.data;
};
