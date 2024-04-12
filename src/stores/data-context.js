import { createContext } from "react";
export const DataContext = createContext({
  dataBys: null,
  keys:null,
  isPlotAll:false,
  setDataBysHandler: () => {},
  filterDataBysHandler: () => {},
  setPlotAllReadouts: () => {},
});
