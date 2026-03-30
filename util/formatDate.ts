export const formatHour = (isoString: string) => {
  return isoString.split("T")[1].slice(0, 5);
};

export const formatDay = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) return "Hoje";

  return date.toLocaleDateString("pt-PT", { weekday: "short" });
};
