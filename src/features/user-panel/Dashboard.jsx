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
  Radio,
  RadioGroup,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Switch,
  Text,
  useToast,
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
import MedianHeatmap from '../linkage/MedianHeatmap';
import { extractFields } from '../../utils/displayUtils';
const Dashboard = () => {
  const dataCtx = useContext(DataContext);
  const traceCtx = useContext(TraceContext);
  const resetTraceHandler = traceCtx.resetHandler;
  const resetFilterHandler = dataCtx.resetHandler;
  const totalKeys = dataCtx.totalKeys;
  const userInputInfo = dataCtx.info;
  const data = traceCtx.data;
  //set the initial fov to be the first existing fov
  const initialFov = Object.keys(dataCtx.keys)[0];
  const [fov, setFov] = useState(initialFov);
  //allele is the index of the allele in the allele list:dataCtx.keys[fov]
  const [allele, setAllele] = useState(0);
  const selectedHandler = traceCtx.selectedHandler;
  const mode = traceCtx.mode;
  const setMode = traceCtx.modeHandler;
  const curFov = traceCtx.selected.fov;
  const filename = dataCtx.filename;
  const [metadata, setMetadata] = useState(null);
  const [alleleList, setAlleleList] = useState([]);
  const [isApplied, setIsApplied] = useState(false);

  const [geoInfo, setGeoInfo] = useState(null);

  const toast = useToast();

  const totalAllelesCount = useMemo(() => {
    if (totalKeys[fov]) {
      setAlleleList(totalKeys[fov]);
      return totalKeys[fov].length;
    }
    return 0;
  }, [totalKeys, fov]);

  useEffect(() => {
    if (filename && filename !== '') {
      fetch('https://olive.faryabilab.com/experiment/' + filename)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error('Bad response from server');
          }
          return response.json();
        })
        .then((data) => {
          setMetadata(extractFields(data));
        });
    }
  }, [filename]);

  useEffect(() => {
    selectedHandler(fov.toString(), dataCtx.keys[fov][allele].toString());
  }, [fov, allele, isApplied]);

  useEffect(() => {
    if (metadata) {
      setGeoInfo({
        start: metadata.start_position,
        chromosome: metadata.chromosome,
        end: metadata.end_position,
      });
    } else {
      if (Object.keys(userInputInfo).length !== 0) {
        setGeoInfo({
          start: userInputInfo.start,
          chromosome: userInputInfo.chromosome,
          end: userInputInfo.end,
        });
      }
    }
  }, [metadata]);

  const shiftPanelHandler = () => {
    if (isApplied) {
      setIsApplied(false);
      const curAllele = dataCtx.keys[curFov][allele];
      const defaultAlleleIndex = alleleList.indexOf(curAllele);
      resetFilterHandler();
      setAllele(defaultAlleleIndex);

      toast({
        title: 'Filter Restored',
        description: 'Reset to default',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-center',
      });
    }

    resetTraceHandler();
    setMode('2');
  };

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
      <Stack direction="row" spacing="8px">
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
      {metadata && (
        <Box p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Cell Type</Th>
                  {metadata.cell_line !== 'N/A' && <Th>Cell Line</Th>}
                  <Th>Gene</Th>
                  <Th>Treatment</Th>
                  <Th>Genotype</Th>
                  <Th>Total Alleles</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{metadata.cell_type || 'N/A'}</Td>
                  {metadata.cell_line !== 'N/A' && <Td>{metadata.cell_line || 'N/A'}</Td>}
                  <Td>{metadata.gene || 'N/A'}</Td>
                  <Td>{metadata.treatment || 'N/A'}</Td>
                  <Td>{metadata.genotype || 'N/A'}</Td>
                  <Td>{totalAllelesCount || 'N/A'}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Divider />
      <Tabs size="sm" variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Tab onClick={() => shiftPanelHandler()}>Distance Analysis</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Distance Map</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Centrality Profile</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Radius of Gyration</Tab>
          <Tab onClick={() => shiftPanelHandler()}>Population Average Distance Map</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RadioGroup onChange={setMode} value={mode}>
              <VStack>
                <HStack>
                  <Radio value="1" />
                  <RadiusFilter />
                </HStack>
                <HStack>
                  <Radio value="2" />
                  <LinkageFilter
                    curAlleleIndex={allele}
                    alleleHandler={setAllele}
                    isApplied={isApplied}
                    setIsApplied={setIsApplied}
                  />
                </HStack>
                <HStack>
                  <Radio value="3" />
                  <PerimeterCheckbox />
                </HStack>
              </VStack>
            </RadioGroup>
          </TabPanel>
          <TabPanel>
            {distanceMap && (
              <Heatmap data={distanceMap} geoInfo={geoInfo} width={700} height={700} />
            )}
          </TabPanel>
          <TabPanel>{data && <LinePlot data={data} />}</TabPanel>
          <TabPanel>{data && <BoxPlot data={data} />}</TabPanel>
          <TabPanel>{<MedianHeatmap geoInfo={geoInfo} />}</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
export default Dashboard;
