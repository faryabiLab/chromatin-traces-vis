import { createContext } from "react";
export const DataContext = createContext({
  dataBys: null,
  setDataBys: () => {},
  isDataLoaded: false,
});
