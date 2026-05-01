export interface IMetricsData {
  income: string;
  expenses: string;
  current_balance: number;
}

export interface IMetricsResponse {
  data: IMetricsData;
}

interface IMetricsTransformed {
  key: string;
  label: string;
  value: number;
  prefix: string;
}

export interface IMetrics {
  metrics: IMetricsTransformed[];
  isMetricsDataLoading: boolean;
  isMetricsDataError: boolean;
}

interface IRecentTransaction {
  id: number | string;
  type: string;
  currency: string;
  amount: number;
}

export interface IRecentTransactions {
  transactions: IRecentTransaction[];
  isRecentTransactionsLoading: boolean;
  isRecentTransactionsError: boolean;
}

interface IRecentBudget {
  id: number | string;
  category: string;
  spent: number;
  budget: number;
}

export interface IRecentBudgets {
  budgets: IRecentBudget[];
  isBudgetsDataLoading: boolean;
  isBudgetsDataError: boolean;
}
