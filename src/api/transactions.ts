import axios from "axios";
import { ITransactionsResponse } from "../types/transactions";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchTransactions = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.post<ITransactionsResponse>(
    `${import.meta.env.VITE_API_URL}/api/transactions?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return res.data;
};
