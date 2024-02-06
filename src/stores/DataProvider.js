import {useState} from 'react';
import {DataContext} from './data-context';
import * as d3 from 'd3';



export function DataProvider({children}){
  const [dataBys,setDataBys] = useState(null);
  const [keys,setKeys] = useState(null);
  // load sample datasets
  // useEffect(() => {
  //   d3.csv(
  //     process.env.PUBLIC_URL + '/230902_Granta519cl27_24hdTAG_MYC5p_30mHyb_4phBl_30step_allfits.csv'
  //   ).then((data) => {
  //     const dataBys = d3.group(
  //       data,
  //       (d) => d.fov,
  //       (d) => d.s
  //     );
  //     setDataBys(dataBys);
  //     setIsDataLoaded(true);
  //   });
  // }, []);

  const extractKeys=(data)=>{
    const result={};
    for(const fovKey of data.keys()){
      if(fovKey!==undefined){
        result[fovKey]=Array.from(data.get(fovKey).keys());
      }
    }
    return result;
  }

  const setDataBysHandler=(data)=>{
    const newDataBys = d3.group(
      data,
      (d)=>d.fov,
      (d)=>d.s
    );
    setKeys(extractKeys(newDataBys));
    setDataBys(newDataBys);
  }


  const dataContext={
    dataBys:dataBys,
    keys:keys,
    setDataBysHandler:setDataBysHandler,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}
