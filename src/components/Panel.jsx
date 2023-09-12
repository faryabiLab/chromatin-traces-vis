import * as d3 from 'd3';
import { useEffect,useState } from 'react';
import {dataProcess} from '../utils/dataWrangler';
import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';
const Panel = () => {
  const [plotData,setPlotData]=useState([]);
  const [clicked,setClicked]=useState([0,0,0]);
  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL+'/fov011_AllFits.csv').then((data) => {
      const dataBys=d3.group(data,d=>d.s);
      const ret=dataProcess(dataBys.get('17'));
      setPlotData(ret);
    }); 
  }, []); 
  const updateClicked=(point)=>{
    setClicked([point.x,point.y,point.z]);
  }
  return (
    <>
    <CanvasWrapper component={Plot} data={plotData} clickHandler={updateClicked}/>
    <Dashboard clicked={clicked}/>
    </>
  )
}
export default Panel;
