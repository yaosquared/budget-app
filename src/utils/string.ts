export const capitalize = (val: string | number) => {
  if (typeof val !== "string" || !val.length) return val;
  return val.charAt(0).toUpperCase() + val.slice(1);
};
