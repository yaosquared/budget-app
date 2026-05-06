import axios from "axios";
import { IAttendanceResponse } from "../types/attendance";
import { QueryFunctionContext } from "@tanstack/vue-query";

export const fetchAttendance = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.post<IAttendanceResponse>(
    `${import.meta.env.VITE_API_URL}/api/attendance?page=${pageParam}`,
    {
      user_id: "caab2291-99ba-41a2-ad76-107c3405e6e5",
    },
  );

  return res.data;
};
