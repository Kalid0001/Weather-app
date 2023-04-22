import Current from "./Current";
import Forecast from "./Forecast";
import Spinner from "./Spinner";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useState,
} from "react";
import axios from "axios";

const URLS = {
  loc: {
    current: `${process.env.REACT_APP_API_URL}/current.json?key=${process.env.REACT_APP_API_KEY}&q=`,
    forecast: `${process.env.REACT_APP_API_URL}/forecast.json?key=${process.env.REACT_APP_API_KEY}&q=`,
  },
  name: {
    forecast: `${process.env.REACT_APP_API_URL}/forecast.json?key=${process.env.REACT_APP_API_KEY}&q=`,
    current: `${process.env.REACT_APP_API_URL}/current.json?key=${process.env.REACT_APP_API_KEY}&q=`,
    search: `${process.env.REACT_APP_API_URL}/search.json?key=${process.env.REACT_APP_API_KEY}&q=`,
  },
};

const ACTIONS = {
  CURRENT: "current",
  FORECAST: "forcast",
  SEARCH: "search",
};

function filterCurrentData({ location, current }) {
  const filtered = { data: {} };
  filtered.name = location.name;
  filtered.country = location.country;
  const { data } = filtered;
  data.temp = current.temp_c;
  data.humidity = current.humidity;
  data.date = current.last_updated;
  data.condition = current.condition.text;
  data.icon = current.condition.icon;
  data.wind = current.wind_kph;

  return filtered;
}

function filterForecastData({ location, forecast }) {
  const filtered = { data: [] };
  filtered.name = location.name;
  filtered.country = location.country;
  forecast.forecastday.map((d) => {
    const data = {};
    data.date = d.date;
    data.maxtemp = d.day.maxtemp_c;
    data.mintemp = d.day.mintemp_c;
    data.humidity = d.day.avghumidity;
    data.condition = d.day.condition.text;
    data.icon = d.day.condition.icon;
    data.wind = d.day.maxwind_kph;
    filtered.data.push(data);
  });

  return filtered;
}

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FORECAST":
      return {
        ...state,
        name: action.payload.name,
        country: action.payload.country,
        forecast: action.payload.data,
        local: false,
      };
    case "UPDATE_CURRENT":
      return {
        ...state,
        name: action.payload.name,
        country: action.payload.country,
        current: action.payload.data,
        local: false,
      };

    case "UPDATE_CURRENT_LOCAL":
      return {
        ...state,
        name: action.payload.name,
        country: action.payload.country,
        current: action.payload.data,
        local: true,
      };

    case "UPDATE_FORECAST_LOCAL":
      return {
        ...state,
        name: action.payload.name,
        country: action.payload.country,
        forecast: action.payload.data,
        local: true,
      };

    default:
      return state;
  }
}
function getLocalCordinates() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

const Body = forwardRef((props, ref) => {
  const [data, dispatch] = useReducer(reducer, {
    id: undefined,
    name: "LOCAL",
    country: undefined,
    current: undefined,
    forecast: undefined,
    local: true,
  });

  useImperativeHandle(ref, (query) => ({
    searchCityWeather(query) {
      fetchData(query, "name");
    },
    searchLocalWeather() {
      setLocalWeather();
    },
    isLocal() {
      return data.local;
    },
  }));

  const [error, setError] = useState({
    local: null,
    forecast: null,
    current: null,
  });

  async function fetchWeatherData({ current, forecast }, local) {
    axios
      .get(forecast)
      .then((d) => filterForecastData(d.data))
      .then((d) => {
        dispatch({
          type: local ? "UPDATE_FORECAST_LOCAL" : "UPDATE_FORECAST",
          payload: d,
        });
        setError({ ...error, forecast: null, local: null });
      })
      .catch((error) => {
        setError({
          ...error,
          forecast: "Check your internet connetion or reload",
        });
      });

    axios
      .get(current)
      .then((d) => {
        return filterCurrentData(d.data);
      })
      .then((d) => {
        dispatch({
          type: local ? "UPDATE_CURRENT_LOCAL" : "UPDATE_CURRENT",
          payload: d,
        });
        setError({ ...error, current: null, local });
      })
      .catch((error) => {
        setError({
          ...error,
          current: "Chech your internet connetion or reload",
        });
      });
  }

  function fetchData(query, type = "loc") {
    let url = {};
    let local = false;
    if (type === "name") {
      url["current"] = URLS["name"]["current"] + query;
      url["forecast"] = URLS["name"]["forecast"] + query + "&days=8";
    } else {
      url["current"] = URLS["loc"]["current"] + `${query[0]},${query[1]}`;
      url["forecast"] =
        URLS["loc"]["forecast"] + `${query[0]},${query[1]}` + "&days=8";
      local = true;
    }

    if (type !== "loc") {
      setError({ ...error, local: null });
    }
    fetchWeatherData(url, local);
  }

  const setLocalWeather = async () => {
    getLocalCordinates()
      .then((res) => res.coords)
      .then((cor) => {
        fetchData([cor.longitude, cor.latitude]);
        setError({ ...error, local: null });
      })
      .catch((err) => {
        setError({
          ...error,
          local: "Please enable Location in your browser!",
        });
      });
  };
  useEffect(() => {
    setLocalWeather();
  }, []);

  return (
    <div className="container-fluid p-0 main">
      <div className="error-container container-fluid">
        <p className="text-center error-message mb-1"> {error.local}</p>
        <p className="text-center error-message mb-1">{error.current}</p>
        <p className="text-center error-message mb-1">{error.forecast}</p>
      </div>
      {!data.current & !data.forecast ? (
        <div className="m-5">
          <Spinner />
        </div>
      ) : (
        <>
          <Current data={data} error={error} />
          <Forecast data={data} error={error} />
        </>
      )}
    </div>
  );
});

export default Body;
