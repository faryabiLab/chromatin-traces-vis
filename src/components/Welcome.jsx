import { Text, Button, Spinner, Highlight,Box } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../store/data-context';
import styles from './Panel.module.css';
const Welcome = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [isProccessing, setIsProcessing] = useState(false);
  const fileReader = new FileReader();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  const dataBys = dataCtx.dataBys;
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const array = csvRows.map((i) => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  useEffect(() => {
    if (array.length > 0) {
      setDataBysHandler(array);
    }
  }, [array]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      setIsProcessing(true);
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Text
        bgGradient="linear(to-l, blue.300,green.200)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
        align="center"
      >
        Welcome, Please upload...
      </Text>
      <Text as="b" fontSize="2xl">
        The file should have the following columns:
      </Text>
      <Text as="li">
        <Highlight
          query={['x', 'y', 'z']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >
          x,y,z: coordinates
        </Highlight>
      </Text>
      <Text as="li">
      <Highlight
          query={['fov']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >fov: field of view</Highlight></Text>
      <Text as="li">
      <Highlight
          query={['s']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >s: allele</Highlight></Text>
      <Text as="li">
      <Highlight
          query={['readout']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >readout: step, only odd ones (1,3,5,...) are plotted</Highlight></Text>

      <form style={{ margin: '20px' }}>
        <input type={'file'} id={'csvFileInput'} accept={'.csv'} onChange={handleFileUpload} />
        
          <Box
            as='button'
            p={2}
            color='white'
            fontWeight='bold'
            borderRadius='md'
            bgGradient='linear(to-r, teal.500, green.500)'
            _hover={{
              bgGradient: 'linear(to-r, red.500, yellow.500)',
            }}
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            IMPORT CSV
            </Box>
    
      </form>
      {isProccessing ? <Spinner size="xl" color="red.500" /> : null}
    </div>
  );
};
export default Welcome;
