import axios from "axios";
import { IReportsHistoryResponse } from "../types/reports";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchReportHistory = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.get<IReportsHistoryResponse>(
    `${import.meta.env.VITE_API_URL}/api/reports?page=${pageParam}`,
  );
  return res.data;
};
