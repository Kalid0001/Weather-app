import React from "react";
import Spinner from "./Spinner";

const Current = ({ data }) => {
  const { current } = data;
  return (
    <div className="container p-2 current d-flex flex-column align-items-center border bg-success">
      {current ? (
        <>
          <h2 className="text-center">{data.name}</h2>
          <h3 className="text-center">{data.country}</h3>

          <img className="current-icon" src={current.icon} alt="" />
          <p className="p-0 m-0">{current.condition}</p>

          <p className="max-temprature">
            <span>{current.temp} &deg;C</span>
          </p>

          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <p>Humidity</p>
              <p>{current.humidity}</p>
            </div>
            <div className="d-flex flex-column">
              <p>Wind</p>
              <p>{current.wind}KpH</p>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Current;
