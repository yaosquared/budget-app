export type TGoalStatus = "pending" | "in_progress" | "completed";

export interface IGoalsData {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TGoalStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface IGoalsResponse {
  data: IGoalsData[];
}

export interface IGoalForm {
  isOpen: boolean;
  goal: IGoalsData | null;
}

export interface IGoalFormData {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
}

export type IGoalFormEmits = {
  submit: [payload: IGoalFormData];
  close: [];
};
