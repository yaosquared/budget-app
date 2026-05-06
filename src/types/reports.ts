export interface IReportsHistoryData {
  id: string;
  user_id: string;
  type: string;
  format: string;
  status: "Success" | "Error" | "Pending";
  exported_by: string;
  created_at: string;
}

export interface IReportsHistoryResponse {
  data: IReportsHistoryData[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface IReportExportForm {
  isOpen: boolean;
}

export interface IReportExportFormData {
  type: string;
  format: string;
  dateFrom: string;
  dateTo: string;
}

export type IReportExportFormEmits = {
  submit: [payload: IReportExportFormData];
  close: [];
};
