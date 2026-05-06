export const capitalize = (val: string | number) => {
  if (typeof val !== "string" || !val.length) return val;
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const formatLabel = (value: string) => {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
