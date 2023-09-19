import * as d3 from 'd3';
import { useEffect, useState,useContext } from 'react';
import { dataProcess } from '../utils/dataWrangler';
import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';
import { DataContext } from '../store/data-context';
import { TraceContext } from '../store/trace-context';
const Panel = () => {
  const [plotData, setPlotData] = useState([]);
  const [clicked, setClicked] = useState({ a: null, b: null });
  const [selected, setSelected] = useState('1');
  const [selectedFov, setSelectedFov] = useState('1');
  const [dataBys, setDataBys] = useState(new Map());
  const ddd = useContext(DataContext);
  const ttt = useContext(TraceContext);
  console.log("HIHIHIHIHI",ttt.selected);
  useEffect(() => {
    //on mount, load data
    //group rows by fov and s
    d3.csv(
      process.env.PUBLIC_URL + '/230902_Granta519cl27_24hdTAG_MYC5p_30mHyb_4phBl_30step_allfits.csv'
    ).then((data) => {
      const dataBys = d3.group(
        data,
        (d) => d.fov,
        (d) => d.s
      );
      setDataBys(dataBys);
      //set default plot to be the first one
      const ret = dataProcess(dataBys.get('1').get('1'));
      setPlotData(ret);
    }); 
  }, []);

  //update plot data when selected changes
  useEffect(() => {
    if (!dataBys.get(selectedFov)) return;
    const ret = dataProcess(dataBys.get(selectedFov).get(selected));
    setPlotData(ret);
  }, [selected, selectedFov, dataBys]);

  const updateClicked = (pointA, pointB) => {
    setClicked({
      a: [pointA.x, pointA.y, pointA.z],
      b: [pointB.x, pointB.y, pointB.z],
    });
  };

  //TODO: combine two update functions into one
  const updateS = (id) => {
    setSelected(id.toString());
  };

  const updateFov = (id) => {
    setSelectedFov(id.toString());
  };

  return (
    <div style={{display:'flex',width:'100%',height:'100%'}}>
      <CanvasWrapper
        component={Plot}
        data={plotData}
        clickHandler={updateClicked}
        selected={selected}
      />
      <Dashboard data={plotData} clicked={clicked} selectHandler={updateS} fovHandler={updateFov} />
    </div>
  );
};
export default Panel;
