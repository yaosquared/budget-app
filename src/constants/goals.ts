import { ITabBtn } from "../types/goals";

export const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export const TAB_BTN_PROPERTIES: ITabBtn[] = [
  {
    key: "pending",
    label: "Pending / In Progress",
    icon: "lucide:loader-circle",
  },
  {
    key: "completed",
    label: "Completed",
    icon: "lucide:circle-check",
  },
];
