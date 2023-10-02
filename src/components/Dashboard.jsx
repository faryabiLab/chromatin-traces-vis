import {
  Select,
  Heading,
  Button,
} from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'

import { useMemo,useContext,useState, } from 'react';
import Heatmap from './Heatmap';
import { TraceContext } from '../store/trace-context';
import { generatePairwiseDistanceMap } from '../utils/displayUtils';
import styles from './Dashboard.module.css';
const Dashboard = () => {
  const traceCtx=useContext(TraceContext);
  const data=traceCtx.data;
  const resetHandler = traceCtx.resetHandler;
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
      <Heading as='h1' className={styles.header}>Dashboard</Heading>
      <div>
      <div className={styles.fov}>
      <label>fov</label>
      <Select
        placeholder="select fov"
        onChange={(e) => {
          setFov(e.target.value);
        }}
      >
        {renderOptions(20)}
      </Select>
      </div>
      <div className={styles.allele}>
      <label>allele</label>
     
      <NumberInput defaultValue={1} min={1} max={20000}>
        <NumberInputField onChange={(e) => {
          setAllele(e.target.value);
        }}/>
      </NumberInput>
  
      
      </div>
      </div>
      <div className={styles.buttons}>
      <Button colorScheme='teal' variant='outline' onClick={() => {
        selectedHandler(fov.toString(),allele.toString());
      }}>Update allele</Button>
      <Button colorScheme="teal" variant="outline" onClick={resetHandler}>
        Clear
      </Button>
      </div>
      {distanceMap&&<Heatmap data={distanceMap} width={650} height={650} />}
    </div>
  );
};
export default Dashboard;
