import getWeatherIcon from "../../util/getWeatherIcon";
const background = "/backgrounds/sky.png";

interface WeatherCardProps {
  today: {
    temperature: number;
    weather_code: number;
    temperature_min: number;
    temperature_max: number;
  };
  location: {
    city: string;
    country: string;
  };
}

export default function WeatherCard({ today, location }: WeatherCardProps) {
  const { icon, description } = getWeatherIcon(today.weather_code);
  return (
    <section className="lg:col-span-2 pt-6 pl-2 flex pointer-events-none">
      {/* Main weather */}
      <div className="flex flex-col gap-2">
        {/* Location */}
        <h1 className="text-3xl font-medium">{location.city}</h1>

        <p className="flex gap-1 text-secondary">
          <span>📍</span>
          {location.country}
        </p>

        {/* Temperature */}
        <div>
          <p className="text-[80px] font-light leading-none tracking-[-4px]">
            {today.temperature}°
          </p>

          <p className="mt-3 text-base text-muted">{description}</p>

          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-hot">↑</span>
              <span className="text-slate-300">{today.temperature_max}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cold">↓</span>
              <span className="text-slate-300">{today.temperature_min}°</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <div className="relative flex h-64 w-64 translate-x-1/6 md:translate-x-1/2">
          {/* Sky atmosphere */}
          <div
            className="absolute -inset-25 md:-inset-52 bg-center bg-cover opacity-70 blur-[2px] [mask-image:radial-gradient(ellipse_at_center,black_20%,rgba(0,0,0,0.8)_40%,transparent_75%)]"
            style={{ backgroundImage: `url(${background})` }}
          />
          {/* Blue atmospheric glow */}
          <img
            src={icon}
            alt={description}
            className="relative z-10 h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
