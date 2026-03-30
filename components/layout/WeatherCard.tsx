import getWeatherIcon from "../../util/getWeatherIcon";

interface WeatherCardProps {
  today: {
    temperature: number;
    weather_code: number;
  };
  location: string;
}

export default function WeatherCard({ today, location }: WeatherCardProps) {
  return (
    <div className="lg:col-span-2 p-6 ">
      <h1 className="text-2xl pb-8">{location}</h1>
      <p className="grid grid-cols-2 text-7xl">
        <span>{today?.temperature}°</span>
        <span className="text-center">
          {getWeatherIcon(today?.weather_code)}
        </span>
      </p>
    </div>
  );
}
