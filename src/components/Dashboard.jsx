import {
  Select,
  Heading,
  Button,
} from '@chakra-ui/react'
import { useMemo,useContext,useState, } from 'react';
import Heatmap from './Heatmap';
import { TraceContext } from '../store/trace-context';
const Dashboard = () => {
  const traceCtx=useContext(TraceContext);
  const data=traceCtx.data;
  const [fov,setFov]=useState(1);
  const [allele,setAllele]=useState(1);
  const selectedHandler=traceCtx.selectedHandler;
  const renderOptions = (number) => {
    let options = [];
    for (let i = 0; i < number; i++) {
      options.push(
        <option value={i + 1} key={i}>
          {i + 1}
        </option>
      );
    }
    return options;
  };
  /**
   * 
   * @param data [{readout:number,pos:{x:number,y:number,z:number}}}}] 
   * @returns map [{x:number,y:number,value:number}]
   */
  const generatePairwiseDistanceMap = (data) => {
    if (!data || data.length === 0) return null;
    let map = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        const dist = Math.sqrt(
          Math.pow(data[i].pos.x - data[j].pos.x, 2) +
            Math.pow(data[i].pos.y - data[j].pos.y, 2) +
            Math.pow(data[i].pos.z - data[j].pos.z, 2)
        );
        map.push({ x: i + 1, y: j + 1, value: dist });
      }
    }
    return map; 
  };  
  
  const distanceMap = useMemo(() => generatePairwiseDistanceMap(data), [data]);

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%' }}>
      <Heading as='h1'>Dashboard</Heading>
      <label>fov</label>
      <Select
        placeholder="select fov"
        onChange={(e) => {
          setFov(e.target.value);
        }}
      >
        {renderOptions(20)}
      </Select>
      <label>allele</label>
      <Select
        placeholder="select allele"
        onChange={(e) => {
          setAllele(e.target.value);
        }}
      >
        {renderOptions(300)}
      </Select>
      <Button colorScheme='teal' variant='outline' onClick={() => {
        selectedHandler(fov.toString(),allele.toString());
      }}>Update allele</Button>
      {distanceMap&&<Heatmap data={distanceMap} width={700} height={700} />}
    </div>
  );
};
export default Dashboard;
