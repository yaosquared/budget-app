export 
const fetchReportHistory = async () => {
  return [
    {
      id: 1,
      type: "Sales Report",
      format: "CSV",
      exported_by: "Admin",
      created_at: "2026-04-20 10:30",
      status: "Completed",
    },
    {
      id: 2,
      type: "Inventory Report",
      format: "Excel",
      exported_by: "Manager",
      created_at: "2026-04-21 14:10",
      status: "Completed",
    },
  ];
};