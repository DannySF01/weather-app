"use client";
import { useEffect, useRef } from "react";
import { useDraggableScroll } from "../../hooks/useDraggableScroll";
import { formatHour } from "../../util/formatDate";
import getWeatherIcon from "../../util/getWeatherIcon";
import { WeatherData } from "../../lib/types/WeatherData";

interface WeatherScrollProps {
  forecast: WeatherData["forecast"];
}

export default function WeatherScroll({ forecast }: WeatherScrollProps) {
  const { time } = forecast;
  const { scrollRef, events } = useDraggableScroll();
  const currentHourRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentHourRef.current) {
      currentHourRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [time]);

  return (
    <div
      ref={scrollRef}
      {...events}
      className="flex gap-9 overflow-x-auto no-scrollbar snap-x cursor-grab active:cursor-grabbing select-none"
      tabIndex={-1} // Remove focus from the tab
    >
      {time.map((item, i) => {
        const isNow = new Date().getHours() === parseInt(formatHour(item));

        return (
          <div
            key={i}
            ref={isNow ? currentHourRef : null}
            className={`
                snap-center shrink-0 min-w-[70px] px-3 rounded-xl flex flex-col items-center transition-all
                ${isNow ? "bg-accent-blue/20" : "opacity-60"}
            `}
          >
            <span className={isNow ? "font-bold mb-3" : "mb-3"}>
              {isNow ? "Agora" : formatHour(item)}
            </span>

            <img
              src={getWeatherIcon(forecast.weather_code[i]).icon}
              alt=""
              className="mb-3 w-12 h-12 pointer-events-none"
            />

            <span className="font-bold text-lg">
              {forecast.temperature[i]}°
            </span>
          </div>
        );
      })}
    </div>
  );
}
