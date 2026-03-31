import { headers } from "next/headers";
import WeatherDashboard from "../components/weather/WeatherDashboard";
import { getWeatherData } from "../services/weatherService";

export default async function Home() {
  const initialLocation = {
    coordinates: {
      lat: Number(headers().get("x-vercel-ip-latitude")) || 41.15,
      lon: Number(headers().get("x-vercel-ip-longitude")) || -8.63,
    },
    name: "Porto",
  };

  const weatherData = await getWeatherData(initialLocation.coordinates);

  return (
    <WeatherDashboard
      weatherData={weatherData}
      initialLocation={initialLocation}
    />
  );
}
