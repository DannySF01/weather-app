import Card from "../components/Card";

const LOCATION = {
  coordinates: "latitude=41.063&longitude=-8.2647",
  name: "Castelo de Paiva",
};
const API_URL =
  "https://api.open-meteo.com/v1/forecast?" + LOCATION.coordinates;

type TodayWeather = {
  temperature: number;
  weather_code: number;
  wind_speed: number;
  wind_direction: number;
  uv_index: number;
  humidity: number;
};

type TodayForecastHourly = {
  time: string[];
  temperature: number[];
  weather_code: number[];
};

type WeekForecast = {
  time: string[];
  temperature_max: number[];
  temperature_min: number[];
  weather_code: number[];
};

async function getTodayWeather(): Promise<TodayWeather> {
  const response = await fetch(
    API_URL +
      "&current=temperature_2m,weather_code,windspeed,winddirection,uv_index,relativehumidity_2m&timezone=auto",
    {
      method: "GET",
      next: { revalidate: 3600 }, // Guardar em cache por 1h para evitar chamadas ao API
    },
  );

  if (!response.ok) {
    console.log(response);
  }

  const data = await response.json();

  return {
    temperature: data?.current.temperature_2m,
    weather_code: data?.current.weather_code,
    wind_speed: data?.current.windspeed,
    wind_direction: data?.current.winddirection,
    uv_index: data?.current.uv_index,
    humidity: data?.current.relativehumidity_2m,
  };
}

async function getTodayForecast(): Promise<TodayForecastHourly> {
  const response = await fetch(
    API_URL +
      "&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1",
    {
      method: "GET",
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    console.log(response);
  }

  const data = await response.json();

  return {
    time: data?.hourly.time,
    temperature: data?.hourly.temperature_2m,
    weather_code: data?.hourly.weather_code,
  };
}

async function getWeekForecast(): Promise<WeekForecast> {
  const response = await fetch(
    API_URL +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto",
    {
      method: "GET",
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    console.log(response);
  }

  const data = await response.json();

  return {
    time: data?.daily.time,
    temperature_max: data?.daily.temperature_2m_max,
    temperature_min: data?.daily.temperature_2m_min,
    weather_code: data?.daily.weather_code,
  };
}

function displayWeatherIcon(weather_code: number) {
  /*  Code	Description
    0	Clear sky
    1, 2, 3	Mainly clear, partly cloudy, and overcast
    45, 48	Fog and depositing rime fog
    51, 53, 55	Drizzle: Light, moderate, and dense intensity
    56, 57	Freezing Drizzle: Light and dense intensity
    61, 63, 65	Rain: Slight, moderate and heavy intensity
    66, 67	Freezing Rain: Light and heavy intensity
    71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
    77	Snow grains
    80, 81, 82	Rain showers: Slight, moderate, and violent
    85, 86	Snow showers slight and heavy
    95 *	Thunderstorm: Slight or moderate
    96, 99 *	Thunderstorm with slight and heavy hail 
  */
  switch (weather_code) {
    case 0:
      return "☀️";
    case 1:
    case 2:
    case 3:
      return "🌤️";
    case 45:
    case 48:
      return "🌫️";
    case 51:
    case 53:
    case 55:
      return "🌦️";
    case 56:
    case 57:
      return "🌧️";
    case 61:
    case 63:
    case 65:
      return "🌧️";
    case 66:
    case 67:
      return "🌨️";
    case 71:
    case 73:
    case 75:
      return "🌨️";
    case 77:
      return "🌨️";
    case 80:
    case 81:
    case 82:
      return "🌧️";
    case 85:
    case 86:
      return "🌨️";
    case 95:
    case 96:
    case 99:
      return "⛈️";
  }
}

export default async function Home() {
  const LOCATION = "Castelo de Paiva";

  const today_weather = await getTodayWeather();
  const today_forecast = await getTodayForecast();
  const week_forecast = await getWeekForecast();

  return (
    <main className="overflow-hidden lg:text-2xl md:text-xl">
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:grid-rows-3 lg:grid-flow-col gap-x-6 gap-y-4 py-6 px-4 lg:p-6 min-h-screen">
        <div className="lg:col-span-2 p-6 ">
          <h1 className="text-2xl pb-8">{LOCATION}</h1>
          <p className="grid grid-cols-2 text-7xl">
            <span>{today_weather?.temperature}°</span>
            <span className="text-center">
              {displayWeatherIcon(today_weather?.weather_code)}
            </span>
          </p>
        </div>
        <Card>
          <p>TODAY FORECAST</p>
          <div className="grid grid-flow-col gap-6 overflow-x-scroll">
            {today_forecast?.time.map((time: any, index: number) => (
              <div className="grid justify-items-center" key={index}>
                <span className="font-bold">
                  {today_forecast.temperature[index]}°
                </span>
                <span>
                  {displayWeatherIcon(today_forecast?.weather_code[index])}
                </span>
                <span>{time.split("T")[1]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p>AIR CONDITIONS</p>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div>
              <p>Wind</p>
              <p>{today_weather?.wind_speed} m/s</p>
            </div>
            <div>
              <span>Wind Direction</span>
              <div className="text-end relative">
                <div className="absolute">
                  <p
                    style={{
                      transform: `rotate(${today_weather?.wind_direction}deg)`,
                    }}
                  >
                    ⬆
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p>UV Index</p>
              <p>{today_weather?.uv_index}</p>
            </div>
            <div>
              <p>Humidade</p>
              <p>{today_weather?.humidity} %</p>
            </div>
          </div>
        </Card>
        <div className="flex flex-col lg:row-span-3 bg-blue-950 bg-opacity-30 p-6 rounded-2xl gap-2">
          <p>7 DAYS FORECAST</p>
          <div className="flex-1 grid items-center grid-rows-7">
            {week_forecast?.time.map((day: any, index: number) => (
              <div className="grid grid-cols-3" key={index}>
                <span>
                  {new Date(day).toLocaleDateString("en-EN", {
                    weekday: "long",
                  })}
                </span>
                <span className="text-center">
                  {displayWeatherIcon(week_forecast?.weather_code[index])}
                </span>
                <span className="text-end">
                  {week_forecast.temperature_max[index] + "°"} /{" "}
                  {week_forecast.temperature_min[index] + "°"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
