import {useState} from 'react';
import {DataContext} from './data-context';
import * as d3 from 'd3';
import { calculatePairDistance } from '../utils/displayUtils';
import { dataProcess } from '../utils/dataWrangler';

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
  const filterHandler=(fov,a,b,distance)=>{
    const alleles=dataBys.get(fov);
    const keysDict=keys;
    const newKeys=[];
    for(const alleleKey of alleles.keys()){
      const allele=dataProcess(alleles.get(alleleKey));
      const nodeA=allele[a];
      const nodeB=allele[b];
      
      if(nodeA&&nodeB&&calculatePairDistance(nodeA,nodeB)<distance){
        newKeys.push(alleleKey);
      }
    }
    keysDict[fov]=newKeys;
    setKeys(keysDict);
  }

  const dataContext={
    dataBys:dataBys,
    keys:keys,
    setDataBysHandler:setDataBysHandler,
    filterDataBysHandler:filterHandler,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}
