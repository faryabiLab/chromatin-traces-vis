import {
  Select,
  Heading,
  Button,
  IconButton,
} from '@chakra-ui/react'
import {ArrowLeftIcon,ArrowRightIcon} from '@chakra-ui/icons'

import { useMemo,useContext,useState, } from 'react';
import Heatmap from './Heatmap';
import { TraceContext } from '../store/trace-context';
import { DataContext } from '../store/data-context';
import { generatePairwiseDistanceMap,refreshPage } from '../utils/displayUtils';
import styles from './Dashboard.module.css';
const Dashboard = () => {
  const dataCtx=useContext(DataContext);
  const traceCtx=useContext(TraceContext);
  const data=traceCtx.data;
  const resetHandler = traceCtx.resetHandler;
  const [fov,setFov]=useState(1);
  const [allele,setAllele]=useState(1);
  const selectedHandler=traceCtx.selectedHandler;
  const renderOptions = () => {
    let options = [];
    const validFovs =Object.keys(dataCtx.keys);
    for (let i = 0; i < validFovs.length; i++) {
      options.push(
        <option value={validFovs[i]} key={i}>
          {validFovs[i]}
        </option>
      );
    }
    return options;
  };

  const renderAlleleOptions = () => {
    let options = [];
    const validAlleles = dataCtx.keys[fov];
    if(validAlleles===undefined) return options;
    for(let i=0;i<validAlleles.length;i++){
      options.push(
        <option value={validAlleles[i]} key={i}>
          {validAlleles[i]}
        </option>
      );
    };
    return options;
  };

  const preAlleleHandler=()=>{
    if(allele===dataCtx.keys[fov][0]) return;
    const newAllele=+allele-1;
    setAllele(newAllele);
    selectedHandler(fov.toString(),newAllele.toString());

  }

  const nextAlleleHandler=()=>{
    if(allele===dataCtx.keys[fov][-1]) return;
    const newAllele=+allele+1;
    setAllele(newAllele);
    selectedHandler(fov.toString(),newAllele.toString());
  }

  const distanceMap = useMemo(() => generatePairwiseDistanceMap(data), [data]);

  return (
    <div>
      <Heading as='h1' className={styles.header}>ORCA Linkage Interactive Viewing Engine(OLIVE)</Heading>
      <div>
      <div className={styles.fov}>
      <label>fov</label>
      <Select value={fov}
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
     
      <Select value={allele}
        placeholder="select allele"
        onChange={(e) => {
          setAllele(e.target.value);
        }}
      >
        {renderAlleleOptions()}
      </Select>
      
      </div>
      </div>
      <div className={styles.buttons}>
      <Button colorScheme='teal' variant='outline' onClick={() => {
        selectedHandler(fov.toString(),allele.toString());
      }}>Update allele</Button>
      <Button colorScheme="teal" variant="outline" onClick={resetHandler}>
        Clear
      </Button>
      <Button colorScheme="red" variant="outline" onClick={refreshPage}>
      Exit
      </Button>
      </div>
      <div className={styles.browse}>
      <IconButton isDisabled={allele===dataCtx.keys[fov][0]?true:false} colorScheme='teal' variant='outline' aria-label='ArrowLeftIcon' icon={<ArrowLeftIcon/>} onClick={preAlleleHandler}/>
      <IconButton colorScheme='teal' variant='outline' aria-label='ArrowRightIcon' icon={<ArrowRightIcon/>} onClick={nextAlleleHandler}/>
      </div>
      {distanceMap&&<Heatmap data={distanceMap} width={650} height={650} />}
    </div>
  );
};
export default Dashboard;
