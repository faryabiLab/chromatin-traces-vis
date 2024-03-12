import { Text, Spinner, Box, Checkbox } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../../stores/data-context';
import { TraceContext } from '../../../stores/trace-context';
import Instructions from './Instructions';
import styles from '../Uploader.module.css';
const FileUploader = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [isProccessing, setIsProcessing] = useState(false);
  const fileReader = new FileReader();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  const traceCtx = useContext(TraceContext);
  const plotAllHandler = traceCtx.plotAllHandler;
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
        marginTop="50px"
      >
        ORCA Linkage Interactive Viewing Engine(OLIVE)
      </Text>
      <div className={styles.upload}>
      <Instructions/>

      <form style={{ marginTop: '20px' }}>
        <input type={'file'} id={'csvFileInput'} accept={'.csv'} onChange={handleFileUpload} />
          <Checkbox margin='10px' onChange={(e)=>{plotAllHandler(e.target.checked)}}>plot all points</Checkbox>
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
            margin='5px'
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            IMPORT CSV
            </Box>
    
      </form>
      {isProccessing ? <Spinner size="xl" color="red.500" /> : null}
      </div>
    </div>
  );
};
export default FileUploader;
