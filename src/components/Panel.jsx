import * as d3 from 'd3';
import { useEffect,useState } from 'react';
import {dataProcess} from '../utils/dataWrangler';
import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';

const Panel = () => {
  const [plotData,setPlotData]=useState([]);
  const [clicked,setClicked]=useState([0,0,0]);
  const [selected,setSelected]=useState('1');
  const [dataBys,setDataBys]=useState(new Map());
  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL+'/fov011_AllFits.csv').then((data) => {
      const dataBys=d3.group(data,d=>d.s);
      setDataBys(dataBys);
      //set default plot to be the first one
      const ret=dataProcess(dataBys.get('1'));
      setPlotData(ret);
    }); 
  }, []); 

  useEffect(()=>{
    const ret=dataProcess(dataBys.get(selected));
    setPlotData(ret);
  },[selected]);

  const updateClicked=(point)=>{
    setClicked([point.x,point.y,point.z]);
  }
  const updateSelected=(id)=>{
    setSelected(id.toString());
  }
  
  return (
    <>
    <CanvasWrapper component={Plot} data={plotData} clickHandler={updateClicked}/>
    <Dashboard clicked={clicked} selectHandler={updateSelected}/>
    </>
  )
}
export default Panel;
