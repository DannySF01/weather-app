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
    API_URL + "/" + today + "+01:00/t_2m:C/41.0410042,-8.271775/json?model=mix",
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
      return data.data[0].coordinates[0].dates[0].value.toFixed();
    })
    .catch(function (err) {
      console.log("something went wrong", err);
    });

  return response;
}

async function getTodayForecast() {
  const today = new Date(new Date().setHours(1, 0, 0, 0));
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
      "+01:00:PT4H/t_2m:C/41.0410042,-8.271775/json?model=mix",
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
      return data.data[0].coordinates[0].dates;
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
    ":P1D/t_max_2m_24h:C,t_min_2m_24h:C/41.0410042,-8.271775/json?model=mix";

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
          };
        }
      );
    })
    .catch(function (err) {
      console.log("something went wrong", err);
    });

  return response;
}

export default async function Home() {
  const LOCATION = "Castelo de Paiva, Portugal";
  const ACCESS_TOKEN = await getAccessToken();

  const today_weather = await getTodayWeather();
  const today_forecast = await getTodayForecast();
  const week_forecast = await getWeekForecast();

  return (
    <main className="flex min-h-screen p-8 bg-white text-black gap-8">
      <div className="w-2/3">
        <h1 className="text-2xl font-bold pb-12">{LOCATION}</h1>
        <p className="text-4xl font-bold pb-12">{today_weather}°C</p>

        <div className="flex flex-col bg-gray-100 p-6 rounded-2xl">
          <p className="pb-4">TODAY FORECAST</p>
          <div className="flex justify-between">
            {today_forecast?.map((day: any, index: number) => (
              <p className="text-2xl font-bold" key={index}>
                {day.value.toFixed()}°C
                <br />
                {new Date(day.date).getHours() + ":00"}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-gray-100 p-6 w-1/3 rounded-2xl justify-between">
        7 DAYS FORECAST
        {week_forecast?.map((day: any, index: number) => (
          <p className="p-2" key={index}>
            {new Date(day.date).toLocaleDateString("pt-PT", {
              weekday: "long",
            }) +
              " : " +
              day.max +
              "/ " +
              day.min}
          </p>
        ))}
      </div>
    </main>
  );
}
