import React,{useContext,useEffect,useState} from 'react';
import { DataContext } from '../../stores/data-context';
const MedianHeatmap = ({width, height,geoInfo }) => {
  const dataCtx = useContext(DataContext);
  const [medianDistanceMap, setMedianDistanceMap] = useState(null);

  useEffect(() => {
    // Only calculate if we haven't calculated before
    if (!medianDistanceMap) {
      const result = dataCtx.medianDistanceHandler();
      setMedianDistanceMap(result);
    }
  }, []); 

  useEffect(() => {
    if (medianDistanceMap) {
      console.log('Median Distance Map:', medianDistanceMap);
    }
  }, [medianDistanceMap]);
  
  return (
    <div>
      <h1>Median Heatmap</h1>
    </div>
  );
}
export default MedianHeatmap;
