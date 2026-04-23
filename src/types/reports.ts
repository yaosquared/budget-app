export interface IReportsHistoryData {
  id: string;
  user_id: string;
  type: string;
  format: string;
  exported_by: string;
  date_exported: Date;
  status: "Success" | "Error" | "Pending";
}

export interface IReportsHistoryResponse {
  data: IReportsHistoryData[];
}
