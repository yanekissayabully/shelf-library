export function formatYear(year: number): string {
  return year < 0 ? `${-year} BC` : String(year);
}
