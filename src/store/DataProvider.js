import {useState,useEffect} from 'react';
import {DataContext} from './data-context';
import * as d3 from 'd3';



export function DataProvider({children}){
  const [dataBys,setDataBys] = useState(new Map());
  useEffect(() => {
    d3.csv(
      process.env.PUBLIC_URL + '/230902_Granta519cl27_24hdTAG_MYC5p_30mHyb_4phBl_30step_allfits.csv'
    ).then((data) => {
      const dataBys = d3.group(
        data,
        (d) => d.fov,
        (d) => d.s
      );
      setDataBys(dataBys);
    });
  }, []);
  return (
    <DataContext.Provider value={dataBys}>
      {children}
    </DataContext.Provider>
  );
}
