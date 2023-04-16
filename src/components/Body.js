import Current from "./Current";
import Forecast from "./Forecast";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useState,
} from "react";
import { getLocalCordinates } from "../fetchData";
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
  console.log(forecast);
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

const Body = forwardRef((props, ref) => {
  useImperativeHandle(ref, (query) => ({
    searchCityWeather(query) {
      fetchData(query, "name");
    },
  }));

  const [data, dispatch] = useReducer(reducer, {
    id: undefined,
    name: "LOCAL",
    country: undefined,
    current: undefined,
    forecast: undefined,
    local: undefined,
  });
  const [position, setPosition] = useState([undefined, undefined]);
  const [error, setError] = useState(null);

  async function fetchWeatherData({ current, forecast }, local) {
    axios
      .get(forecast)
      .then((d) => filterForecastData(d.data))
      .then((d) => {
        dispatch({
          type: local ? "UPDATE_FORECAST_LOCAL" : "UPDATE_FORECAST",
          payload: d,
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

    fetchWeatherData(url, local);
  }

  useEffect(() => {
    if (data.name === "LOCAL") {
      getLocalCordinates()
        .then((res) => res.coords)
        .then((cor) => {
          setPosition([cor.longitude, cor.latitude]);
          setError(null);
        })
        .catch((err) => {
          setError("Please enable Location in your browser!");
          console.log(err);
        });
      if (position[0]) {
        fetchData(position);
      }
    }
  }, position);

  return (
    <>
      <div className="container">
        <Current data={data} error={error} />
        <Forecast data={data} />
      </div>
    </>
  );
});

export default Body;
