export type Option = {
  label: string;
  value: string;
};

type TRangeType = "date" | "time";

export interface IDateTimeRange {
  type?: TRangeType;
  label?: string;
  icon?: string;
  fromLabel?: string;
  toLabel?: string;
  fromValue: string;
  toValue: string;
  options?: Option[];
}

export interface IDropdown {
  modelValue: string;
  options?: Option[];
  label?: string;
  placeholder?: string;
  open: boolean;
  type?: "select" | "date" | "time";
  error?: string;
}

export interface IButton {
  text: string;
  icon: string;
}

export interface IInput {
  modelValue: string | number | null;
  label: string;
  type?: "text" | "number" | "email" | "password";
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

type TOption = {
  text: string;
  color: string;
  bgColor: string;
  isActive: {
    color: string;
    bgColor: string;
  };
};

export interface IMultiSelectChips {
  data: TOption[];
  modelValue: string[];
}

export interface IProgressBar {
  value: number;
  color: string;
  height: number;
}

export interface ITable {
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
  isLoading: boolean;
  isError: boolean;
  page: string;
}

export interface ITitle {
  text: string;
}
