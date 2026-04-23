import axios from "axios";
import { IReportsHistoryResponse } from "../types/reports";

export const fetchReportHistory = async () => {
  const { data } = await axios.get<IReportsHistoryResponse>(
    `${import.meta.env.VITE_API_URL}/reports`,
  );
  return data.data;
};
