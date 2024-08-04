let headers = new Headers();
headers.set(
  "Authorization",
  "Basic " +
    btoa(
      process.env.WEATHER_API_USERNAME + ":" + process.env.WEATHER_API_PASSWORD
    )
);
async function getAccessToken() {
  const response = fetch("https://login.meteomatics.com/api/v1/token", {
    method: "GET",
    headers: headers,
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      return data.access_token;
    })
    .catch(function (err) {
      console.log("something went wrong", err);
    });

  return response;
}

const API_URL = "https://api.meteomatics.com";

async function getTodayWeather() {
  const today = new Date().toISOString().split("Z")[0];

  const response = await fetch(
    API_URL +
      "/" +
      today +
      "+01:00/t_2m:C,weather_symbol_1h:idx,wind_speed_10m:ms,uv:idx,wind_dir_10m:d,precip_1h:mm/41.0410042,-8.271775/json?model=mix",
    {
      method: "GET",
      headers: headers,
      next: { revalidate: 3600 },
    }
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      return {
        temperature: data.data[0].coordinates[0].dates[0].value.toFixed(),
        weather_icon: data.data[1].coordinates[0].dates[0].value,
        wind_speed: data.data[2].coordinates[0].dates[0].value.toFixed(),
        uv: data.data[3].coordinates[0].dates[0].value,
        wind_direction: data.data[4].coordinates[0].dates[0].value,
        precipitation: data.data[5].coordinates[0].dates[0].value.toFixed(),
      };
    })
    .catch(function (err) {
      console.log("something went wrong", err);
    });

  return response;
}

async function getTodayForecast() {
  const today = new Date(new Date().setHours(4, 0, 0, 0));
  const endDay = new Date(
    new Date(new Date().setHours(0, 0, 0, 0)).getTime() +
      1 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("Z")[0];

  const response = await fetch(
    API_URL +
      "/" +
      today.toISOString().split("Z")[0] +
      "+01:00" +
      "--" +
      endDay +
      "+01:00:PT4H/t_2m:C,precip_1h:mm,weather_symbol_1h:idx/41.0410042,-8.271775/json?model=mix",
    {
      method: "GET",
      headers: headers,
      next: { revalidate: 3600 },
    }
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      return {
        date: data.data[0].coordinates[0].dates,
        precipitation: data.data[1].coordinates[0].dates,
        weather_icon: data.data[2].coordinates[0].dates,
      };
    })
    .catch(function (err) {
      console.log("something went wrong", err);
    });

  return response;
}

async function getWeekForecast() {
  const today = new Date(new Date().setHours(1, 0, 0, 0));

  const URL =
    API_URL +
    "/" +
    today.toISOString() +
    "--" +
    new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString() +
    ":P1D/t_max_2m_24h:C,t_min_2m_24h:C,precip_1h:mm,weather_symbol_24h:idx/41.0410042,-8.271775/json?model=mix";

  const response = await fetch(URL, {
    method: "GET",
    headers: headers,
    next: { revalidate: 3600 },
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      return data.data[0].coordinates[0].dates.map(
        (date: any, index: number) => {
          return {
            date: date.date,
            max: date.value,
            min: data.data[1].coordinates[0].dates[index].value,
            precip: data.data[2].coordinates[0].dates[index].value,
            weather_icon: data.data[3].coordinates[0].dates[index].value,
          };
        }
      );
    })
    .catch(function (err) {
      console.log("something went wrong", err);
    });

  return response;
}

function displayWeatherIcon(weather_icon_code: number) {
  switch (weather_icon_code) {
    case 1:
      return "☀️";
    case 101:
      return "🌙";
    case 102:
      return "☁️";
    case 2:
      return "🌤️";
    case 3:
      return "🌥️";
    case 103:
      return "☁️";
    case 4:
      return "☁️";
    case 104:
      return "☁️";
    case 5:
      return "🌧️";
    case 105:
      return "🌧️";
    case 6 || 106:
      return "🌨️";
    case 7 || 107:
      return "❄";
    case 8:
      return "🌦️";
    case 108:
      return "🌧️";
    case 9:
      return "🌥️";
    case 109:
      return "☁️";
    case 10:
      return "🌦️";
    case 110:
      return "🌧️";
    case 11:
      return "🌫";
    case 12 || 112:
      return "🌫";
    case 13 || 113:
      return "🌨️";
    case 14 || 114:
      return "⛈️";
    case 15 || 115:
      return "🌧️";
    case 16 || 116:
      return "🌫";
  }
}

export default async function Home() {
  const LOCATION = "Castelo de Paiva";
  const ACCESS_TOKEN = await getAccessToken();

  const today_weather = await getTodayWeather();
  const today_forecast = await getTodayForecast();
  const week_forecast = await getWeekForecast();

  return (
    <main className="overflow-hidden">
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:grid-rows-3 lg:grid-flow-col gap-x-6 gap-y-4 py-6 px-4 lg:p-6 min-h-screen">
        <div className="lg:col-span-2 p-6">
          <h1 className="text-2xl pb-8">{LOCATION}</h1>
          <p className="grid grid-cols-2 text-7xl pb-8">
            <span>{today_weather?.temperature}°</span>
            <span className="text-center">
              {displayWeatherIcon(today_weather?.weather_icon)}
            </span>
          </p>
        </div>
        <div className="grid lg:col-span-2 bg-blue-950 bg-opacity-30 p-6 rounded-2xl gap-2">
          <p>TODAY FORECAST</p>
          <div className="grid grid-flow-col">
            {today_forecast?.date.map((day: any, index: number) => (
              <div
                className="lg:text-2xl grid justify-items-center"
                key={index}
              >
                <span className="font-bold">{day.value.toFixed()}°</span>
                <span>
                  {displayWeatherIcon(
                    today_forecast?.weather_icon[index].value
                  )}
                </span>
                <span>{new Date(day.date).getHours() + ":00"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:col-span-2 bg-blue-950 bg-opacity-30 p-6 rounded-2xl gap-2">
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
              <p>{today_weather?.uv}</p>
            </div>
            <div>
              <p>Precipitation</p>
              <p>{today_weather?.precipitation} %</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:row-span-3 bg-blue-950 bg-opacity-30 p-6 rounded-2xl gap-2">
          <p>7 DAYS FORECAST</p>
          <div className="flex-1 grid items-center grid-rows-7">
            {week_forecast?.map((day: any, index: number) => (
              <div className="grid grid-cols-3" key={index}>
                <span>
                  {new Date(day.date).toLocaleDateString("en-EN", {
                    weekday: "long",
                  })}
                </span>
                <span className="text-center">
                  {displayWeatherIcon(day.weather_icon)}
                </span>
                <span className="text-end">
                  {day.max.toFixed(0) + " / " + day.min.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
