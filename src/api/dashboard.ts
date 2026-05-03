import axios from "axios";
import { IMetricsResponse } from "../types/dashboard";
import { IBudgetsResponse } from "../types/budget";
import { ITransactionsResponse } from "../types/transactions";

export const fetchMetrics = async () => {
  const { data } = await axios.post<IMetricsResponse>(
    `${import.meta.env.VITE_API_URL}/api/dashboard/metrics`,
    {
      user_id: "24f98e8a-2938-40b8-bf82-a0e5fa01a962",
    },
  );

  return data.data;
};

export const fetchRecentBudgets = async () => {
  const { data } = await axios.get<IBudgetsResponse>(
    `${import.meta.env.VITE_API_URL}/api/budgets/recent`,
  );
  return data.data;
};

export const fetchRecentTransactions = async () => {
  const { data } = await axios.get<ITransactionsResponse>(
    `${import.meta.env.VITE_API_URL}/api/transactions/recent`,
  );
  return data.data;
};
