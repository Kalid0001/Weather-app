// import { useEffect, useState } from "react";

// export const fetchData = (wrappedComponent, filter) => {
//   return (props) => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//       axios.get(url);
//     });

//     return <wrappedComponent data={data} {...props} />;
//   };
// };

export function getLocalCordinates() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

// async function fetchLocal() {
//     const coord = await getLocalCordinates()
//     let corX, corY;
//     try{
//         corX = coord.coords.latitude
//         corY =
//     }

//     const response = coord.coords
//   getLocalCordinates()
//     .then((res) => res.coords)
//     .then((c) => {
//       axios.get(
//         `${process.env.REACT_APP_API_URL}/current.json?key=${process.env.REACT_APP_API_KEY}&q=${c.longitude},${c.latitude}`
//       ).then(d => d.data)
//     });
// }
