export interface IBudgetData {
  id: string;
  user_id: string;
  category: string;
  month: string;
  budget: string;
  spent: string;
  remaining: string;
  created_at: Date;
  updated_at: Date;
}

export interface IBudgetsResponse {
  data: IBudgetData[];
}
