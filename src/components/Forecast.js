import React from "react";

const Forecast = ({ data }) => {
  const { forecast } = data;
  return (
    <div className="container forecast">
      {forecast && (
        <>
          {forecast.map((day, i) => {
            return (
              <div
                className={` lg={4} sm={12}col p-2 card forecast-day d-flex flex-column align-items-center forecast-${
                  i + 1
                }`}
              >
                <p className="date pt-2">{day.date}</p>
                <img src={day.icon} alt="" />
                <div className="tempratures d-flex justify-content-between mb-3">
                  <div className="d-flex flex-column mx-2 align-items-center">
                    <p>{day.maxtemp}</p>
                    <p>Max</p>
                  </div>
                  <div className="d-flex flex-column mx-2 align-items-center">
                    <p>{day.mintemp}</p>
                    <p>Min</p>
                  </div>
                </div>
                <div className="d-flex fluid justify-content-between">
                  <div className="d-flex flex-column mx-2 align-items-center">
                    <p>{day.humidity}</p>
                    <p>Humidity</p>
                  </div>
                  <div className="d-flex flex-column mx-2 align-items-center">
                    <p>{day.wind}</p>
                    <p>Wind</p>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Forecast;
