import axios from "axios";
import { IAttendanceResponse } from "../types/attendance";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchAttendance = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.get<IAttendanceResponse>(
    `${import.meta.env.VITE_API_URL}/api/attendance?page=${pageParam}`,
  );
  return res.data;
};
