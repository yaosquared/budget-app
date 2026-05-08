import axios from "axios";
import { QueryFunctionContext } from "@tanstack/vue-query";

import { ISettingsResponse } from "../types/settings";

export const fetchSettings = async ({
  pageParam = 1,
}: QueryFunctionContext) => {
  const res = await axios.get<ISettingsResponse>(
    `${import.meta.env.VITE_API_URL}/api/settings?page=${pageParam}`,
  );
  return res.data;
};
