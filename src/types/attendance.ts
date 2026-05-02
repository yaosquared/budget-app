export interface IAttendanceData {
  id: number;
  date: string;
  status: "present" | "late" | "absent";
  time_in: string;
  time_out: string | null;
}

export interface IAttendanceResponse {
  data: IAttendanceData[];
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
