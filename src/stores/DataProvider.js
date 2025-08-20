import {useState} from 'react';
import {DataContext} from './data-context';
import * as d3 from 'd3';
import { calculatePairDistance } from '../utils/displayUtils';
import { dataProcess, sampleAllele } from '../utils/dataWrangler';
import { calculateTraceRg, calculateMedian } from '../utils/calculationUtils';
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
            const processedPoints = dataProcess(points, totalReadouts);
            if(processedPoints) rgValues.push(calculateTraceRg(processedPoints));
        });
    });


    return rgValues;

  }

  const medianDistanceHandler = () => {
    let isCancelled = false;

    const calculation= new Promise((resolve,reject) => {
      const result = {};
      for (const [fovKey, fovValue] of dataBys.entries()) {
        if (fovKey !== undefined) {
          result[fovKey] = Array.from(fovValue.entries());
        }
      }
  
      const distances = {};
      const allFovData = sampleAllele(Object.values(result).flat());
      let currentIndex = 0;
      const chunkSize = 5; // Process 5 items at a time to keep UI responsive
  
      const processChunk = () => {
        if (isCancelled) {
          reject(new Error('Calculation cancelled'));
          return;
        }

        const endIndex = Math.min(currentIndex + chunkSize, allFovData.length);
        
        for (let idx = currentIndex; idx < endIndex; idx++) {
          const [_, points] = allFovData[idx];
          //use non-interpolated data to calulate median distance map
          const processedPoints = dataProcess(points, totalReadouts,false);
          const pointsByReadout = {};
          // Skip if empty allele
          if (!processedPoints) {
            continue;
          }
          processedPoints.forEach(point => {
            pointsByReadout[point.readout] = point;
          });
          
          for (let i = 0; i < processedPoints.length; i++) {
            for (let j = i + 1; j < processedPoints.length; j++) {
              const readout1 = processedPoints[i].readout;
              const readout2 = processedPoints[j].readout;
              const key = `${readout1}&${readout2}`;
              if (!distances[key]) distances[key] = [];
              
              const point1 = pointsByReadout[readout1.toString()];
              const point2 = pointsByReadout[readout2.toString()];
              
              if (point1 && point2) {
                const distance = calculatePairDistance(point1, point2);
                distances[key].push(distance);
              }
            }
          }
        }
        
        currentIndex = endIndex;
        
        if (currentIndex < allFovData.length) {
          // Continue processing in next frame
          setTimeout(processChunk, 10); // Small delay to keep UI responsive
        } else {
          const medians = {};
          for (const [key, distanceArray] of Object.entries(distances)) {
            medians[key] = calculateMedian(distanceArray);
          }
          resolve(medians);
        }
      };
      
      processChunk();
    });

    return{
      promise: calculation,
      cancel: () => {
        isCancelled = true;
      }
    }
  };
  


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
