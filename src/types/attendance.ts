export interface IAttendanceData {
  id: number;
  date: string;
  status: "present" | "late" | "absent";
  time_in: string;
  time_out: string;
  attendance_date: string;
}

export interface IAttendanceResponse {
  data: IAttendanceData[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface IAttendanceFilterForm {
  isOpen: boolean;
}

export interface IAttendanceFilterFormData {
  status: string[];
  dateFrom: string;
  dateTo: string;
  timeInFrom: string;
  timeInTo: string;
  timeOutFrom: string;
  timeOutTo: string;
}

export type IAttendanceFilterFormEmits = {
  submit: [payload: IAttendanceFilterFormData];
  close: [];
};
