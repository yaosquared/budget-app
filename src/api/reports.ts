import axios from "axios";
import { QueryFunctionContext } from "@tanstack/vue-query";

import { IReportsHistoryResponse } from "../types/reports";

export const fetchReportHistory = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.post<IReportsHistoryResponse>(
    `${import.meta.env.VITE_API_URL}/api/reports?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return res.data;
};
