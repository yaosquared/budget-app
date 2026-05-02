export interface ISettingsData {
  id: string;
  user_id: string;
  code?: string;
  value?: string;
  data: Record<string, ISettingValue>;
  created_at: Date;
  updated_at: Date;
  modified_by: string;
}

export interface ISettingsResponse {
  data: ISettingsData[];
}

export interface ISettingForm {
  isOpen: boolean;
  setting: ISettingsData | null;
}

export interface ISettingFormData {
  id?: string;
  code: string;
  value: string;
}

export interface ISettingFormEmits {
  submit: [payload: ISettingFormData];
  close: [];
}

export interface ISettingValue {
  value: string | number;
  description: string;
}
