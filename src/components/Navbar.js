import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const AutoCompleteResult = ({ alternatives, onSelectHandler }) => {
  return (
    <>
      {alternatives.length ? (
        <>
          {alternatives.map((c) => {
            return (
              <li
                className="dropdown-item"
                key={c.id}
                url={c.url}
                onClick={(c) => onSelectHandler(c)}
              >
                {c.name} - {c.country}
              </li>
            );
          })}
        </>
      ) : (
        <li className="px-2">No match is found</li>
      )}
    </>
  );
};

const Navbar = (props) => {
  const [query, setQuery] = useState("");
  const [alternatives, setAlternative] = useState([]);
  const [conceal, setConceal] = useState(true);
  const [value, setValue] = useState(true);

  function changeHandler(e) {
    setQuery(e.target.value);
    if (!e.target.value) {
      return;
    }
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/search.json?key=${process.env.REACT_APP_API_KEY}&q=${e.target.value}`
      )
      .then((d) => d.data)
      .then((d) => {
        setAlternative(d);
      });
  }

  async function searchHandler(e) {
    e.preventDefault();
    if (!query) {
      return;
    }
    props.onSearch(query);
    setQuery("");
    setValue(!value);
  }

  function onSelectHandler(c) {
    setQuery("");
    props.onSearch(c.target.attributes.url.nodeValue);
    setValue(!value);
  }

  function localHandler() {
    props.onSearchLocal();
    setQuery("");
    setValue(!value);
  }
  useEffect(() => {
    const local = props.isLocal();
    setConceal(local);
  }, [value]);

  return (
    <>
      <nav className="navbar text-light bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light">Get Weather Info</a>
          <div className="d-flex">
            <form className="d-flex nav-item dropdown" onSubmit={searchHandler}>
              <input
                onChange={changeHandler}
                className="form-control me-2 dropdown-toggle"
                type="search"
                placeholder="City"
                aria-label="Search"
                value={query}
                id="navbarScrollingDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              />

              <ul
                className="dropdown-menu"
                aria-labelledby="navbarScrollingDropdown"
              >
                <AutoCompleteResult
                  alternatives={alternatives}
                  onSelectHandler={onSelectHandler}
                />
              </ul>

              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            {!conceal && (
              <button
                className="btn btn-outline-success mx-2"
                onClick={localHandler}
              >
                Local
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
