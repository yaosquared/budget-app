import axios from "axios";

import { IMetricsResponse } from "../types/dashboard";
import { IBudgetsResponse } from "../types/budget";
import { ITransactionsResponse } from "../types/transactions";

export const fetchMetrics = async () => {
  const { data } = await axios.post<IMetricsResponse>(
    `${import.meta.env.VITE_API_URL}/api/dashboard/metrics`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return data.data;
};

export const fetchRecentBudgets = async () => {
  const { data } = await axios.post<IBudgetsResponse>(
    `${import.meta.env.VITE_API_URL}/api/budgets/recent`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return data.data;
};

export const fetchRecentTransactions = async () => {
  const { data } = await axios.post<ITransactionsResponse>(
    `${import.meta.env.VITE_API_URL}/api/transactions/recent`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return data.data;
};
