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
import { getLocationDetails } from "../../services/reverseGeocoding";
import { Section, SectionHeader } from "../ui/Section";

interface WeatherDashboardProps {
  weatherData: WeatherData;
  initialLocation: {
    lat: number;
    lon: number;
    address: { city: string; country: string };
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
          getLocationDetails(latitude, longitude).then((name) => {
            setLocation({
              lat: latitude,
              lon: longitude,
              address: {
                city: name.city,
                country: name.country,
              },
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
    if (location.lat === initialLocation.lat) return;

    setLoading(true);
    getWeatherData({ lat: location.lat, lon: location.lon })
      .then(setWeather)
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-6 lg:p-8 overflow-x-hidden">
      <div className="flex justify-between items-center gap-4">
        <GeoSearch
          onSelect={(loc) =>
            setLocation({
              lat: loc.lat,
              lon: loc.lon,
              address: { city: loc.address.city, country: loc.address.country },
            })
          }
        />
        <p className="text-muted text-xs font-bold tracking-widest uppercase text-center">
          {new Date().toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "long",
          })}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <WeatherCard
            today={today}
            location={{
              city: location.address.city,
              country: location.address.country,
            }}
          />

          <Section>
            <SectionHeader>Previsão para 24 horas</SectionHeader>
            <WeatherScroll forecast={forecast} />
          </Section>

          <Section>
            <SectionHeader>Condições atmosféricas</SectionHeader>
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
          </Section>
        </div>

        <Section className="lg:col-span-1 lg:sticky h-fit">
          <SectionHeader> Previsão dos próximos 7 dias</SectionHeader>
          <div className="flex flex-col gap-6">
            {week?.time.map((day, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0"
              >
                <span className="text-muted w-16 capitalize">
                  {i === 0 ? "hoje" : formatDay(day)}
                </span>
                <img
                  className="w-12 h-12 pointer-events-none"
                  src={getWeatherIcon(week?.weather_code[i]).icon}
                  alt={getWeatherIcon(week?.weather_code[i]).description}
                />
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-hot">↑</span>
                    <span className="font-bold">
                      {week.temperature_max[i]}°
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cold">↓</span>
                    <span className="text-slate-300">
                      {week.temperature_min[i]}°
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
