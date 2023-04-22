import { useRef, useState } from "react";
import "./App.css";
import Body from "./components/Body";
import Navbar from "./components/Navbar";

function App() {
  const body = useRef(null);
  return (
    <div className="App">
      <Navbar
        onSearch={(query, id) => {
          body.current.searchCityWeather(query, id);
        }}
        onSearchLocal={() => body.current.searchLocalWeather()}
        isLocal={() => body?.current?.isLocal()}
      />
      <Body ref={body} />
    </div>
  );
}

export default App;
