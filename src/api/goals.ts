import axios from "axios";
import { IGoalsResponse } from "../types/goals";

export const fetchGoals = async () => {
  const { data } = await axios.get<IGoalsResponse>(
    `${import.meta.env.VITE_API_URL}/goals`,
  );
  return data.data;
};
