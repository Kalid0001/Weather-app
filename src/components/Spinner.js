import React from "react";
import spinner from "./spinner.gif";

export default ({ className }) => {
  return (
    <div>
      <img
        src={spinner}
        alt="Loading..."
        style={{ width: "200px", margin: "40px auto", display: "block" }}
        className={`${className} spinner`}
      />
    </div>
  );
};
