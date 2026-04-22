import axios from "axios";
import { IBudgetsResponse } from "../types/budget";

export const fetchBudgets = async () => {
  const { data } = await axios.get<IBudgetsResponse>(
    `${import.meta.env.VITE_API_URL}/budgets`,
  );
  return data.data;
};
