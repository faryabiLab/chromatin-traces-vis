import React from "react";
export const TraceContext = React.createContext({
  data:null,
  selected: { fov: null, s: null },
  clicked: { a: null, b: null },
  selectedHandler: () => {},
  clickedHandler: () => {},
});

