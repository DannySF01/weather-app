import { WeatherData } from "../lib/types/WeatherData";

const BASE_URL = "https://api.open-meteo.com/v1/forecast?";

interface getWeatherDataProps {
  lat: number;
  lon: number;
}

export async function getWeatherData({
  lat,
  lon,
}: getWeatherDataProps): Promise<WeatherData> {
  const params = new URLSearchParams({
    current:
      "temperature_2m,weather_code,windspeed_10m,winddirection_10m,uv_index,relative_humidity_2m",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(
    `${BASE_URL}&latitude=${lat}&longitude=${lon}&${params.toString()}`,
    {
      next: { revalidate: 3600 }, // Guardar em cache por 1h para evitar chamadas ao API
    },
  );

  if (!response.ok) {
    console.error("Error fetching weather data:", response.statusText);
    return {
      today: {
        temperature: 0,
        weather_code: 0,
        wind_speed: 0,
        wind_direction: 0,
        uv_index: 0,
        humidity: 0,
      },
      forecast: {
        time: [],
        temperature: [],
        weather_code: [],
      },
      week: {
        time: [],
        temperature_max: [],
        temperature_min: [],
        weather_code: [],
        sunset: [],
      },
    };
  }

  const data = await response.json();

  return {
    today: {
      temperature: Math.round(data.current.temperature_2m),
      weather_code: data.current.weather_code,
      wind_speed: data.current.windspeed_10m,
      wind_direction: data.current.winddirection_10m,
      uv_index: data.current.uv_index,
      humidity: data.current.relative_humidity_2m,
    },
    forecast: {
      // Pegamos as primeiras 24h
      time: data.hourly.time.slice(0, 24),
      temperature: data.hourly.temperature_2m
        .slice(0, 24)
        .map((temp) => Math.round(temp)),
      weather_code: data.hourly.weather_code.slice(0, 24),
    },
    week: {
      time: data.daily.time,
      temperature_max: data.daily.temperature_2m_max.map((temp) =>
        Math.round(temp),
      ),
      temperature_min: data.daily.temperature_2m_min.map((temp) =>
        Math.round(temp),
      ),
      weather_code: data.daily.weather_code,
      sunset: data.daily.sunset,
    },
  };
}
