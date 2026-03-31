"use client";
import { useEffect, useState } from "react";
import { formatHour, formatDay } from "../../util/formatDate";
import getWeatherIcon from "../../util/getWeatherIcon";
import getWindDirection from "../../util/getWindDirection";
import AirItem from "./AirItem";
import { GeoSearch } from "./GeoSearch";
import WeatherCard from "./WeatherCard";
import WeatherScroll from "./WeatherScroll";
import { WeatherData } from "../../lib/types/WeatherData";
import { getWeatherData } from "../../services/weatherService";
import { getCityName } from "../../services/reverseGeocoding";

interface WeatherDashboardProps {
  weatherData: WeatherData;
  initialLocation: {
    coordinates: {
      lat: number;
      lon: number;
    };
    name: string;
  };
}

export default function WeatherDashboard({
  weatherData,
  initialLocation,
}: WeatherDashboardProps) {
  const [location, setLocation] = useState(initialLocation);
  const [weather, setWeather] = useState<WeatherData>(weatherData);

  const { today, forecast, week } = weather;

  const [loading, setLoading] = useState(false);

  // Obter localizacao por GPS se disponivel
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          getCityName(latitude, longitude).then((name) => {
            setLocation({
              coordinates: { lat: latitude, lon: longitude },
              name,
            });
          });
        },
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  // Obter dados da localizacao sempre que a localizacao mudar
  useEffect(() => {
    if (location.coordinates === initialLocation.coordinates) return;

    setLoading(true);
    getWeatherData(location.coordinates)
      .then(setWeather)
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <main className="max-w-7xl mx-auto min-h-screen  text-white p-4 lg:p-8 overflow-x-hidden">
      <div className="flex justify-between items-center px-2">
        <GeoSearch
          onSelect={(city) =>
            setLocation({
              coordinates: {
                lat: city.latitude,
                lon: city.longitude,
              },
              name: city.name,
            })
          }
        />
        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
          {new Date().toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "long",
          })}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <WeatherCard today={today} location={location.name} />

          <div className="bg-[#1b2635] rounded-3xl p-6">
            <p className="text-slate-400 font-bold mb-4 text-xs uppercase tracking-wider">
              Previsão para 24 horas
            </p>

            <WeatherScroll forecast={forecast} />
          </div>

          <div className="@container bg-[#1b2635] rounded-3xl p-6">
            <p className="text-slate-400 font-bold mb-4 text-xs uppercase tracking-wider">
              Condições atmosféricas
            </p>
            <div className="grid grid-cols-2 gap-y-6">
              <AirItem
                label="Sensação Térmica"
                value={`${today?.temperature}°`}
                icon="🌡️"
              />
              <AirItem label="UV" value={today?.uv_index} icon="☀️" />
              <AirItem
                label="Vento"
                value={`${today?.wind_speed} m/s`}
                icon="💨"
              />
              <AirItem
                label="Direção"
                value={getWindDirection(today?.wind_direction)}
                icon="🌬️"
              />
              <AirItem
                label="Humidade"
                value={`${today?.humidity}%`}
                icon="💧"
              />
              <AirItem
                label="Pôr do Sol"
                value={formatHour(week?.sunset[0])}
                icon="🌅"
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1 bg-[#1b2635] rounded-3xl p-6 lg:sticky h-fit">
          <p className="text-slate-400 font-bold mb-6 text-xs uppercase tracking-wider">
            Previsão para 7 dias
          </p>
          <div className="flex flex-col gap-6">
            {week?.time.map((day, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0"
              >
                <span className="text-slate-400 w-16 capitalize">
                  {i === 0 ? "hoje" : formatDay(day)}
                </span>
                <span className="text-xl">
                  {getWeatherIcon(week?.weather_code[i])}
                </span>
                <div className="font-medium">
                  <span className="font-bold">{week.temperature_max[i]}°</span>
                  <span className="text-slate-500 ml-2">
                    /{week.temperature_min[i]}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
