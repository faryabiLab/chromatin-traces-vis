import React from "react";
export const TraceContext = React.createContext({
  data:null,
  selected: { fov: null, s: null },
  clicked: { a: null, b: null },
  triplets: {a: null, b: null, c: null},
  selectedHandler: () => {},
  clickedHandler: () => {},
  isPlotAll:false,
});

