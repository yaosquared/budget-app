import axios from "axios";
import { IGoalsResponse } from "../types/goals";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchGoals = async ({ pageParam = 1 }: QueryFunctionContext) => {
  const res = await axios.get<IGoalsResponse>(
    `${import.meta.env.VITE_API_URL}/api/goals?page=${pageParam}`,
  );
  return res.data;
};
