import axios from "axios";
import { QueryFunctionContext } from "@tanstack/vue-query";
import {
  IAttendanceFilterFormData,
  IAttendanceResponse,
} from "../types/attendance";

export const fetchAttendance = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext) => {
  const [, attendanceFilters] = queryKey as [string, IAttendanceFilterFormData];

  const res = await axios.post<IAttendanceResponse>(
    `${import.meta.env.VITE_API_URL}/api/attendance?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      status: attendanceFilters.status,
      date_from: attendanceFilters.dateFrom,
      date_to: attendanceFilters.dateTo,
      time_in_from: attendanceFilters.timeInFrom,
      time_in_to: attendanceFilters.timeInTo,
      time_out_from: attendanceFilters.timeOutFrom,
      time_out_to: attendanceFilters.timeOutTo,
    },
  );

  return res.data;
};

export const timeIn = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/attendance/time-in`,
    { user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5" },
  );
  return res.data;
};

export const timeOut = async (id: string) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/attendance/time-out`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
      id,
    },
  );

  return res.data;
};
