import axios from "axios";
import { IGoalsResponse } from "../types/goals";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchGoals = async ({ pageParam = 1 }: QueryFunctionContext) => {
  const res = await axios.post<IGoalsResponse>(
    `${import.meta.env.VITE_API_URL}/api/goals?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return res.data;
};
