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
