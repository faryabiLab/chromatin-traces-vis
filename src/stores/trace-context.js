import React from "react";
export const TraceContext = React.createContext({
  data:null,
  selected: { fov: null, s: null },
  clicked: { a: null, b: null },
  triplets: {a: null, b: null, c: null},
  radius:200,
  selectedHandler: () => {},
  clickedHandler: () => {},
  resetHandler:()=>{},
  tripletHandler:()=>{},
  radiusHandler:()=>{},
});

