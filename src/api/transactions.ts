import axios from "axios";
import { ITransactionsResponse } from "../types/transactions";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchTransactions = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.get<ITransactionsResponse>(
    `${import.meta.env.VITE_API_URL}/api/transactions?page=${pageParam}`,
  );
  return res.data;
};
