export const getSomeValueWithId = (key: string, lookuparr: [], id: string) => {
  let value = "";

  lookuparr?.map((data: any) => {
    if (data._id === id) {
      value = data[key];
    }
  });

  return value;
};

export const userRoles = ["Admin", "Super-user", "User"];

export function getFinancialYears(): string[] {
  const currentYear = new Date().getFullYear();
  return [
    `${currentYear - 2}-${currentYear - 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
  ];
}

export const getNextDeadline = (frequency: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let deadline = now;

  if (frequency === "monthly") {
    deadline = new Date(year, month + 1, 0);
  }
  if (frequency === "quarterly") {
    if (month <= 2) deadline = new Date(year, 3, 0);
    else if (month <= 5) deadline = new Date(year, 6, 0);
    else if (month <= 8) deadline = new Date(year, 9, 0);
    else deadline = new Date(year + 1, 1, 0);
  }
  if (frequency === "half-yearly") {
    if (month <= 5) deadline = new Date(year, 6, 0);
    else deadline = new Date(year, 11, 31);
  }
  if (frequency === "annually") deadline = new Date(year, 11, 31);
  return deadline;
};
