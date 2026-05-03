export interface ITransactionsData {
  id: string;
  user_id: number;
  type: string;
  amount: number;
  currency: string;
}

export interface ITransactionsResponse {
  data: ITransactionsData[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface ITransactionForm {
  isOpen: boolean;
  transaction: ITransactionsData | null;
}

export interface ITransactionFormData {
  id?: string;
  type: string;
  amount: number | null;
}

export type TTransactionFormEmits = {
  submit: [payload: ITransactionFormData];
  close: [];
};
