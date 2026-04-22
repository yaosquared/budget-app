import axios from "axios";
import { IAttendanceResponse } from "../types/attendance";

export const fetchAttendance = async () => {
  const { data } = await axios.get<IAttendanceResponse>(
    `${import.meta.env.VITE_API_URL}/attendance`,
  );
  return data.data;
};
