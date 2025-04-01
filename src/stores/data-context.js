import { createContext } from "react";
export const DataContext = createContext({
  dataBys: null,
  keys:null,
  isPlotAll:false,
  totalReadouts:0,
  setDataBysHandler: () => {},
  filterDataBysHandler: () => {},
  setPlotAllReadouts: () => {},
  setTotalReadouts: () => {},
});
