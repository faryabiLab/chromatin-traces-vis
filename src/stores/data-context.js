import { createContext } from "react";
export const DataContext = createContext({
  dataBys: null,
  keys:null,
  totalReadouts:0,
  setDataBysHandler: () => {},
  filterDataBysHandler: () => {},
  setTotalReadouts: () => {},
});
