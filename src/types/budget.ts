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
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface IBudgetForm {
  isOpen: boolean;
  budget: IBudgetData | null;
}

export interface IBudgetFormData {
  id?: string;
  category: string;
  month: string;
  budget: number | null;
}

export type IBudgetFormEmits = {
  submit: [payload: IBudgetFormData];
  close: [];
};
