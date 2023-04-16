import React from "react";
import Spinner from "./Spinner";

const Forecast = ({ data }) => {
  const { forecast } = data;
  return (
    <div className="container forecast">
      {forecast ? (
        <>
          {forecast.map((day, i) => {
            return (
              <div
                className={` col p-2 card forecast-day d-flex flex-column align-items-center forecast-${
                  i + 1
                }`}
              >
                <p className="date pt-2">{day.date}</p>
                <img src={day.icon} alt="" />
                <div className="tempratures d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <p>{day.maxtemp}</p>
                    <p>Max</p>
                  </div>
                  <div className="d-flex flex-column">
                    <p>{day.mintemp}</p>
                    <p>Min</p>
                  </div>
                </div>
                <div className="d-flex fluid justify-content-between">
                  <div className="d-flex flex-column">
                    <p>{day.humidity}</p>
                    <p>Humidity</p>
                  </div>
                  <div className="d-flex flex-column">
                    <p>{day.wind}</p>
                    <p>Wind</p>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Forecast;
