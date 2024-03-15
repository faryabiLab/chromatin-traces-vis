import {
  Select,
  Heading,
  Button,
  IconButton,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

import { useMemo, useContext, useState, useEffect } from 'react';
import Heatmap from '../linkage/Heatmap';
import { TraceContext } from '../../stores/trace-context';
import { DataContext } from '../../stores/data-context';
import { generatePairwiseDistanceMap, refreshPage } from '../../utils/displayUtils';
import styles from './Dashboard.module.css';
import Filter from './components/Filter';
const Dashboard = () => {
  const dataCtx = useContext(DataContext);
  const traceCtx = useContext(TraceContext);
  const data = traceCtx.data;
  const resetHandler = traceCtx.resetHandler;
  const initialFov=Object.keys(dataCtx.keys)[0];
  const [fov, setFov] = useState(initialFov);
  //allele is the index of the allele in the allele list:dataCtx.keys[fov]
  const [allele, setAllele] = useState(0);
  const selectedHandler = traceCtx.selectedHandler;


  useEffect(() => {
    selectedHandler(fov.toString(), dataCtx.keys[fov][allele].toString());
  }, [fov, allele]);


  const renderOptions = () => {
    let options = [];
    const validFovs = Object.keys(dataCtx.keys);
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
    if (validAlleles === undefined) return options;
    for (let i = 0; i < validAlleles.length; i++) {
      options.push(
        <option value={i} key={i}>
          {validAlleles[i]}
        </option>
      );
    }
    return options;
  };

  const preAlleleHandler = () => {
    if (allele === 0) return;
    const newAlleleIndex = +allele - 1;
    const newAllele = dataCtx.keys[fov][newAlleleIndex];
    setAllele(newAlleleIndex);
    selectedHandler(fov.toString(), newAllele.toString());
  };

  const nextAlleleHandler = () => {
    if (allele >= dataCtx.keys[fov].length - 1) return;
    const newAlleleIndex = +allele + 1;
    const newAllele = dataCtx.keys[fov][newAlleleIndex];
    setAllele(newAlleleIndex);
    selectedHandler(fov.toString(), newAllele.toString());
  };

  const distanceMap = useMemo(() => generatePairwiseDistanceMap(data), [data]);

  return (
    <div className={styles.dashboard}>
      <Heading as="h1" className={styles.header}>
        ORCA Linkage Interactive Viewing Engine(OLIVE)
      </Heading>
      <Stack direction="row" spacing='30px'> 
        <div className={styles.select}>
          <label>FOV:</label>
          <Select
            
            value={fov}
            placeholder="select fov"
            onChange={(e) => {
              setFov(e.target.value);
              setAllele(0);
            }}
          >
            {renderOptions(20)}
          </Select>
        </div>
        <div className={styles.select}>
          <label>Allele:</label>
          <Select
 
            value={allele}
            placeholder="select allele"
            onChange={(e) => {
              setAllele(e.target.value);
            }}
          >
            {renderAlleleOptions()}
          </Select>
        </div>
  
      <div className={styles.buttons}>
    
        <IconButton
          isDisabled={allele === 0 ? true : false}
          colorScheme="teal"
          variant="outline"
          aria-label="ArrowLeftIcon"
          icon={<ArrowLeftIcon />}
          onClick={preAlleleHandler}
        />
        <IconButton
          isDisabled={allele === dataCtx.keys[fov].length - 1 ? true : false}
          colorScheme="teal"
          variant="outline"
          aria-label="ArrowRightIcon"
          icon={<ArrowRightIcon />}
          onClick={nextAlleleHandler}
        />
        <Button colorScheme="teal" variant="outline" onClick={resetHandler}>
          Reset
        </Button>
        <Button colorScheme="red" variant="outline" onClick={refreshPage}>
          Exit
        </Button>
      </div>
      </Stack>
      <div className={styles.filter}>
      <Filter alleleHandler={setAllele}/>
      </div>
     
     <Divider />
      
      {distanceMap && <Heatmap data={distanceMap} width={650} height={650} />}

    </div>
  );
};
export default Dashboard;
