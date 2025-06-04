import {
  Select,
  Heading,
  Button,
  IconButton,
  Stack,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Radio, RadioGroup,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from '@chakra-ui/icons';

import { useMemo, useContext, useState, useEffect } from 'react';
import Heatmap from '../linkage/Heatmap';
import { TraceContext } from '../../stores/trace-context';
import { DataContext } from '../../stores/data-context';
import { generatePairwiseDistanceMap, refreshPage } from '../../utils/displayUtils';
import styles from './Dashboard.module.css';
import LinkageFilter from './components/LinkageFilter';
import RadiusFilter from './components/RadiusFilter';
import PerimeterCheckbox from './components/PerimeterCheckbox';
import LinePlot from '../centrality/LinePlot';
import BoxPlot from '../radiusGyration/BoxPlot';
import { use } from 'react';
const Dashboard = () => {
  const dataCtx = useContext(DataContext);
  const traceCtx = useContext(TraceContext);
  const resetTraceHandler = traceCtx.resetHandler;
  const resetFilterHandler=dataCtx.resetHandler;
  const data = traceCtx.data;
  //set the initial fov to be the first existing fov
  const initialFov = Object.keys(dataCtx.keys)[0];
  const [fov, setFov] = useState(initialFov);
  //allele is the index of the allele in the allele list:dataCtx.keys[fov]
  const [allele, setAllele] = useState(0);
  const selectedHandler = traceCtx.selectedHandler;
  const [mode, setMode] = useState('1');
  useEffect(() => {
    selectedHandler(fov.toString(), dataCtx.keys[fov][allele].toString());
  }, [fov, allele]);
  const shiftPanelHandler = () => {
    resetTraceHandler();
    resetFilterHandler();
  }

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

  const downloadHandler = () => {
    const headers = ['readout,x,y,z,imputed'];

    // Convert each object to CSV row
    const csvRows = data.map((item) => {
      return `${item.readout},${item.pos.x},${item.pos.y},${item.pos.z},${item.filling}`;
    });

    // Combine headers and rows
    const csvContent = [...headers, ...csvRows].join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary link element
    const link = document.createElement('a');

    // Create the download URL
    const url = window.URL.createObjectURL(blob);

    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `fov_${fov}_allele_${dataCtx.keys[fov][allele]}_data.csv`);

    // Append link to body (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className={styles.dashboard}>
      <Heading as="h1" className={styles.header}>
        Optical Looping Interactive Viewing Engine (OLIVE)
      </Heading>
      <Stack direction="row" spacing="30px">
        <div className={styles.select}>
          <label>FOV:</label>
          <Select
            value={fov}
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
            onChange={(e) => {
              setAllele(e.target.value);
            }}
          >
            {renderAlleleOptions()}
          </Select>
        </div>

        <div className={styles.buttons}>
          <IconButton
            colorScheme="black"
            variant="outline"
            aria-label="ArrowLeftIcon"
            icon={<DownloadIcon />}
            onClick={downloadHandler}
          />
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
          <Button colorScheme="red" variant="outline" onClick={refreshPage}>
            Return
          </Button>
        </div>
      </Stack>

      <Divider />
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Tab onClick={() => shiftPanelHandler()}>Distance Analysis</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Distance Map</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Centrality Profile</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Radius of Gyration</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RadioGroup onChange={setMode} value={mode}>
              <VStack>
                <Radio value='1'><RadiusFilter mode={mode} /></Radio>
                <Radio value='2'><LinkageFilter alleleHandler={setAllele} mode={mode} /></Radio>
                <Radio value='3'><PerimeterCheckbox mode={mode} /></Radio>
              </VStack>
            </RadioGroup>
          </TabPanel>
          <TabPanel>
            {distanceMap && <Heatmap data={distanceMap} width={650} height={600} />}
          </TabPanel>
          <TabPanel>{data && <LinePlot data={data} />}</TabPanel>
          <TabPanel>{data && <BoxPlot data={data} />}</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
export default Dashboard;
