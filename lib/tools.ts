export const getSomeValueWithId = (key: string, lookuparr: [], id: string) => {
  let value = "";

  lookuparr?.map((data: any) => {
    if (data._id === id) {
      value = data[key];
    }
  });

  return value;
};

export const userRoles = ["Admin", "Super-admin", "User"];

export function getFinancialYears(): string[] {
  const currentYear = new Date().getFullYear();
  return [
    `${currentYear - 2}-${currentYear - 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
  ];
}
