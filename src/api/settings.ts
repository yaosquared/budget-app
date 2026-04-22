import axios from "axios";
import { ISettingsResponse } from "../types/settings";

export const fetchSettings = async () => {
  const { data } = await axios.get<ISettingsResponse>(
    `${import.meta.env.VITE_API_URL}/settings`,
  );
  return data.data;
};
