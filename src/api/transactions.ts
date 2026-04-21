import axios from "axios";
import { ITransactionsResponse } from "../types/transactions";

export const fetchTransactions = async () => {
  const { data } = await axios.get<ITransactionsResponse>(
    `${import.meta.env.VITE_API_URL}/transactions`,
  );
  return data.data;
};
