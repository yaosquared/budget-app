interface ITransactionsData {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  currency: string;
}

export interface ITransactionsResponse {
  data: ITransactionsData[];
}
