const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search?";
const COUNT = 5;

interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  admin3_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
  admin3: string;
}

export async function searchCity(query: string): Promise<City[]> {
  if (query.length < 3) return [];
  const response = await fetch(
    `${BASE_URL}name=${query}&count=${COUNT}&language=pt&format=json`,
  );

  const data = await response.json();

  return data.results || [];
}
