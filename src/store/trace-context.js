import React from "react";
export const TraceContext = React.createContext({
  selected: { fov: null, s: null },
  clicked: { a: null,a_id:null, b: null,b_id:null },
  selectedHandler: () => {},
  clickedHandler: () => {},
});

