// Curated country + city lists focused on where South Sudanese live (home + main
// diaspora hubs). Every city list ends with "Other…" so anything can still be typed.

export const OTHER = "Other…";

export const COUNTRIES = [
  "South Sudan",
  "Kenya",
  "Uganda",
  "Ethiopia",
  "Sudan",
  "Egypt",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "Norway",
  "Sweden",
  "Netherlands",
  "United Arab Emirates",
  OTHER,
];

const CITIES: Record<string, string[]> = {
  "South Sudan": ["Juba", "Wau", "Malakal", "Bor", "Bentiu", "Yei", "Aweil", "Rumbek", "Torit", "Yambio"],
  Kenya: ["Nairobi", "Mombasa", "Eldoret", "Nakuru", "Kakuma"],
  Uganda: ["Kampala", "Gulu", "Arua", "Jinja", "Adjumani"],
  Ethiopia: ["Addis Ababa", "Gambela"],
  Sudan: ["Khartoum", "Omdurman"],
  Egypt: ["Cairo", "Alexandria"],
  "United States": ["Omaha", "Minneapolis", "Des Moines", "Kansas City", "Phoenix", "Dallas", "Seattle", "Nashville", "Syracuse"],
  Canada: ["Calgary", "Edmonton", "Toronto", "Winnipeg", "Ottawa", "Hamilton"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds"],
  Australia: ["Melbourne", "Sydney", "Brisbane", "Perth", "Adelaide"],
  Germany: ["Berlin", "Frankfurt", "Munich"],
  Norway: ["Oslo", "Bergen"],
  Sweden: ["Stockholm", "Gothenburg"],
  Netherlands: ["Amsterdam", "Rotterdam"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
};

export function citiesForCountry(country: string): string[] {
  return [...(CITIES[country] ?? []), OTHER];
}
