export interface IReportsHistoryData {
  id: string;
  user_id: string;
  type: string;
  format: string;
  exported_by: string;
  exported_date: string;
  status: "Success" | "Error" | "Pending";
}

export interface IReportsHistoryResponse {
  data: IReportsHistoryData[];
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
