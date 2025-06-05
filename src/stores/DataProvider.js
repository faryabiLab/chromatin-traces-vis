import {useState} from 'react';
import {DataContext} from './data-context';
import * as d3 from 'd3';
import { calculatePairDistance } from '../utils/displayUtils';
import { dataProcess } from '../utils/dataWrangler';
import { calculateTraceRg } from '../utils/calculationUtils';
export function DataProvider({children}){
  const [dataBys,setDataBys] = useState(null);
  const [keys,setKeys] = useState(null);
  const [totalReadouts,setTotalReadouts] = useState(0);
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
      const allele=dataProcess(alleles.get(alleleKey),totalReadouts);
      const nodeA=allele[a];
      const nodeB=allele[b];
      
      if(nodeA&&nodeB&&calculatePairDistance(nodeA,nodeB)<distance){
        newKeys.push(alleleKey);
      }
    }
    keysDict[fov]=newKeys;
    setKeys(keysDict);
  }

  const radiusOfGyrationHandler=()=>{
    const result={};
    for(const fovKey of dataBys.keys()){
      if(fovKey!==undefined){
        result[fovKey]=Array.from(dataBys.get(fovKey));
      }
    }
    const rgValues = [];
    
    Object.values(result).forEach(fovGroup => {
        fovGroup.forEach(([_, points]) => {
            rgValues.push(calculateTraceRg(dataProcess(points,totalReadouts)));
        });
    });


    return rgValues;

  }

  const resetHandler=()=>{
    setKeys(extractKeys(dataBys));
  }

  const dataContext={
    dataBys:dataBys,
    keys:keys,
    totalReadouts:totalReadouts,
    setDataBysHandler:setDataBysHandler,
    filterDataBysHandler:filterHandler,
    resetHandler:resetHandler,
    setTotalReadouts:setTotalReadouts,
    radiusOfGyrationHandler:radiusOfGyrationHandler,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}
