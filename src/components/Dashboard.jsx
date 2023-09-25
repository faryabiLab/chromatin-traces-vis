import {
  Select,
  Heading,
  Button,
} from '@chakra-ui/react'
import { useMemo,useContext,useState, } from 'react';
import Heatmap from './Heatmap';
import { TraceContext } from '../store/trace-context';
import { generatePairwiseDistanceMap } from '../utils/displayUtils';
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

  const distanceMap = useMemo(() => generatePairwiseDistanceMap(data), [data]);

  return (
    <div>
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
      <Button margin={3} colorScheme='teal' variant='outline' onClick={() => {
        selectedHandler(fov.toString(),allele.toString());
      }}>Update allele</Button>
      {distanceMap&&<Heatmap data={distanceMap} width={700} height={700} />}
    </div>
  );
};
export default Dashboard;
