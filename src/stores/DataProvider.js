import {useState} from 'react';
import {DataContext} from './data-context';
import * as d3 from 'd3';
import { calculatePairDistance } from '../utils/displayUtils';
import { dataProcess } from '../utils/dataWrangler';
import { calculateTraceRg,calculate3DDistance,calculateMedian } from '../utils/calculationUtils';
export function DataProvider({children}){
  const [dataBys,setDataBys] = useState(null);
  const [filename,setFilename] = useState(null);
  const [keys,setKeys] = useState(null);
  const [totalKeys,setTotalKeys] = useState(null);
  const [totalReadouts,setTotalReadouts] = useState(0);
  const [info,setInfo] = useState({});

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
    const newKeys=extractKeys(newDataBys);
    setKeys(newKeys);
    setTotalKeys(newKeys);
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

  const medianDistanceHandler=()=>{
    const result={};
    for(const fovKey of dataBys.keys()){
      if(fovKey!==undefined){
        result[fovKey]=Array.from(dataBys.get(fovKey));
      }
    }

    const distances = {};
    
    // Iterate through each FOV
    Object.values(result).forEach(fovData => {
        // Iterate through each allele in the FOV
        fovData.forEach(([_, points]) => {
            const processedPoints=dataProcess(points,totalReadouts);
            // Get points by readout number
            const pointsByReadout = {};
            processedPoints.forEach(point => {
                pointsByReadout[point.readout] = point;
            });
            // Calculate distances between readout pairs
            for (let i = 1; i < processedPoints.length; i++) {
                for (let j = i + 1; j <= processedPoints.length; j++) {
                    const key = `${i}&${j}`;
                    if (!distances[key]) distances[key] = [];
                    
                    const point1 = pointsByReadout[i.toString()];
                    const point2 = pointsByReadout[j.toString()];
                    
                    if (point1 && point2) {
                        const distance = calculatePairDistance(point1, point2);
                        distances[key].push(distance);
                    }
                }
            }
        });
    });

    const medians = {};
    for (const [key, distanceArray] of Object.entries(distances)) {
        medians[key] = calculateMedian(distanceArray);
    }
    
    return medians;

  }

  const resetHandler=()=>{
    setKeys(extractKeys(dataBys));
    setTotalKeys(extractKeys(dataBys));
  }

  const dataContext={
    dataBys:dataBys,
    keys:keys,
    totalKeys:totalKeys,
    totalReadouts:totalReadouts,
    filename:filename,
    info:info,
    setFilename:setFilename,
    setDataBysHandler:setDataBysHandler,
    filterDataBysHandler:filterHandler,
    resetHandler:resetHandler,
    setTotalReadouts:setTotalReadouts,
    radiusOfGyrationHandler:radiusOfGyrationHandler,
    setInfo:setInfo,
    medianDistanceHandler:medianDistanceHandler
  };

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}
