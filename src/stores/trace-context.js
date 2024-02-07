import React from "react";
export const TraceContext = React.createContext({
  data:null,
  selected: { fov: null, s: null },
  clicked: { a: null, b: null },
  mode:2,
  selectedHandler: () => {},
  clickedHandler: () => {},
  modeHandler: () => {},
  isPlotAll:false,
});

