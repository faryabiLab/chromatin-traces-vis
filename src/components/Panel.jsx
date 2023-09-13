import * as d3 from 'd3';
import { useEffect,useState } from 'react';
import {dataProcess} from '../utils/dataWrangler';
import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';

const Panel = () => {
  const [plotData,setPlotData]=useState([]);
  const [clicked,setClicked]=useState({a:null,b:null});
  const [selected,setSelected]=useState('1');
  const [selectedFov,setSelectedFov]=useState('1');
  const [dataBys,setDataBys]=useState(new Map());
  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL+'/230902_Granta519cl27_24hdTAG_MYC5p_30mHyb_4phBl_30step_allfits.csv').then((data) => {
      const dataBys=d3.group(data,d=>d.fov,d=>d.s);
      setDataBys(dataBys);
      //set default plot to be the first one
      const ret=dataProcess(dataBys.get('1').get('1'));
      setPlotData(ret);
    }); 
  }, []); 

  useEffect(()=>{
    if(!dataBys.get(selectedFov)) return;
    const ret=dataProcess(dataBys.get(selectedFov).get(selected));
    setPlotData(ret);

  },[selected]); 

  const updateClicked=(pointA,pointB)=>{

    setClicked({a:[pointA.x,pointA.y,pointA.z],b:[pointB.x,pointB.y,pointB.z]});
    
  }

  
  const updateS=(id)=>{
    setSelected(id.toString());
  }

  const updateFov=(id)=>{
    setSelectedFov(id.toString());
  }
  
  return (
    <>
    <CanvasWrapper component={Plot} data={plotData} clickHandler={updateClicked} selected={selected}/>
    <Dashboard data={plotData} clicked={clicked} selectHandler={updateS} fovHandler={updateFov}/>
    </>
  )
}
export default Panel;
