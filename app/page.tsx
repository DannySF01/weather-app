import { headers } from "next/headers";
import WeatherDashboard from "../components/weather/WeatherDashboard";
import { getWeatherData } from "../services/weatherService";

export default async function Home() {
  const initialLocation = {
    lat: Number(headers().get("x-vercel-ip-latitude")) || 41.15,
    lon: Number(headers().get("x-vercel-ip-longitude")) || -8.63,
    address: {
      city: "Porto",
      country: "Portugal",
    },
  };

  const weatherData = await getWeatherData({
    lat: initialLocation.lat,
    lon: initialLocation.lon,
  });

  return (
    <WeatherDashboard
      weatherData={weatherData}
      initialLocation={initialLocation}
    />
  );
}
