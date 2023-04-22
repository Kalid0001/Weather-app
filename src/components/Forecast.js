import React from "react";
import Humidity from "../img/humidity.png";
import Wind from "../img/wind.png";

const Forecast = ({ data }) => {
  const { forecast } = data;
  return (
    <>
      {forecast && (
        <div class="container-fluid overflow-hidden forecast">
          <div class="row forecast-row gy-5 justify-content-center">
            {forecast.map((day, i) => {
              return (
                <div className="col-lg-4 col-md-6 col-sm-7" key={i}>
                  <div className="d-flex flex-column align-items-center forecast-day p-2">
                    <p className="date pt-2">{day.date}</p>
                    <img src={day.icon} alt="" />
                    <div className="tempratures d-flex w-100 justify-content-between">
                      <p>
                        Max: <span>{day.maxtemp}</span>
                      </p>
                      <p>
                        Min: <span>{day.mintemp}</span>
                      </p>
                    </div>
                    <div className="d-flex w-100 justify-content-between">
                      <div className="d-flex ">
                        <img src={Humidity} className="humidity-icon" />

                        <p className="mx-2">{day.humidity}</p>
                        <p></p>
                      </div>
                      <div className="d-flex">
                        <img src={Wind} alt="" className="wind-icon" />

                        <p className="mx-2">{day.wind}KpH</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Forecast;
