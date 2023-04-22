import React from "react";
import Humidity from "../img/humidity.png";
import Wind from "../img/wind.png";
import Spinner from "./Spinner";

const Current = ({ data, error }) => {
  const { current } = data;
  return (
    <div className="container p-2 current d-flex flex-column align-items-center border bg-success">
      {current ? (
        <>
          <h2 className="text-center">{data.name}</h2>
          <h3 className="text-center country-name">{data.country}</h3>
          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <img className="current-icon" src={current.icon} alt="" />
            <p className="mx-2">{current.condition}</p>
          </div>

          <p className="max-temprature p-0">
            <h3>{current.temp} &deg;C</h3>
          </p>

          <div className="d-flex w-100 justify-content-between px-5 flex-wrap justify-content-center">
            <div className="d-flex mb-1">
              <img src={Humidity} className="humidity-icon" />
              <span className="mx-2">{current.humidity}</span>
            </div>
            <div className="d-flex mb-1">
              <img src={Wind} alt="" className="wind-icon" />
              <p className="mx-2">{current.wind}KpH</p>
            </div>
          </div>
        </>
      ) : (
        <div>
          <Spinner className={"current-spinner"} />
        </div>
      )}
    </div>
  );
};

export default Current;
