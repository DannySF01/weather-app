export type WeatherData = {
  today: {
    temperature: number;
    weather_code: number;
    wind_speed: number;
    wind_direction: number;
    uv_index: number;
    humidity: number;
    temperature_min: number;
    temperature_max: number;
  };
  forecast: {
    time: string[];
    temperature: number[];
    weather_code: number[];
  };
  week: {
    time: string[];
    temperature_max: number[];
    temperature_min: number[];
    weather_code: number[];
    sunset: string[];
  };
};
