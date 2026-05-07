export const REPORTS_COLUMNS = [
  { key: "type", label: "Report Type" },
  { key: "format", label: "Format" },
  { key: "status", label: "Status" },
  { key: "exported_date", label: "Date Exported" },
  { key: "exported_by", label: "Exported By" },
];

export const TYPE_OPTIONS = [
  { label: "Budgets Summary", value: "budget" },
  { label: "Transactions History", value: "transaction" },
  { label: "Attendance History", value: "attendance" },
];

export const FORMAT_OPTIONS = [
  { label: "CSV", value: "csv" },
  { label: "PDF", value: "pdf" },
];
