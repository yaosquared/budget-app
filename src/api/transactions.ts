import axios from "axios";
import {
  ITransactionFormData,
  ITransactionsResponse,
} from "../types/transactions";
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

export const createTransaction = async (payload: ITransactionFormData) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/transactions/new`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      ...payload,
      currency: "php",
      amount: Number(payload.amount),
    },
  );

  return res.data;
};

export const updateTransaction = async (payload: ITransactionFormData) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/transactions/edit`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      ...payload,
      amount: Number(payload.amount),
    },
  );

  return res.data;
};

export const deleteTransaction = async (id: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/transactions/delete`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      id,
    },
  );

  return res.data;
};
