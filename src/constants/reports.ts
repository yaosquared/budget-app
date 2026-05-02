export const REPORTS_COLUMNS = [
  { key: "type", label: "Report Type" },
  { key: "format", label: "Format" },
  { key: "exported_by", label: "Exported By" },
  { key: "exported_date", label: "Date Exported" },
  { key: "status", label: "Status" },
];

export const TYPE_OPTIONS = [
  { label: "Transactions History", value: "transaction" },
  { label: "Attendance History", value: "attendance" },
];

export const FORMAT_OPTIONS = [
  { label: "CSV", value: "csv" },
  { label: "PDF", value: "pdf" },
];
