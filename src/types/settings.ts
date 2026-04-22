export interface ISettingsData {
  code: string;
  user_id: string;
  description: string;
  value: string;
  created_at: Date;
  updated_at: Date;
  modified_by: string;
}

export interface ISettingsResponse {
  data: ISettingsData[];
}
