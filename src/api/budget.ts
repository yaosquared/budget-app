import axios from "axios";
import { IBudgetsResponse } from "../types/budget";
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
