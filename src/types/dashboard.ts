export interface IMetricsData {
  income: string;
  expenses: string;
  current_balance: number;
}

export interface IMetricsResponse {
  data: IMetricsData;
}

export interface IMetricsTransformed {
  key: string;
  label: string;
  value: number;
  prefix: string;
}


export interface IRecentTransactions {
  id: number | string;
  type: string;
  currency: string;
  amount: number;
}

export interface IRecentBudgets {
  id: number | string;
  category: string;
  spent: number;
  budget: number;
}