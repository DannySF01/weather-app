const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search?";
const COUNT = 5;

export async function searchCity(query: string) {
  if (query.length < 3) return [];
  const response = await fetch(
    `${BASE_URL}name=${query}&count=${COUNT}&language=pt&format=json`,
  );

  const data = await response.json();

  return data.results || [];
}
