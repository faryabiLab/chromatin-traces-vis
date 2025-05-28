import { Divider, Text, VStack,Box } from '@chakra-ui/react';

import Instructions from './components/Instructions';

import DataBrowser from './components/DataBrowser';
import CSVReader from './components/CSVReader';
import {useState} from 'react';
const FileUploader = () => {
  const [maxReadout, setMaxReadout] = useState(null);
  return (
    <VStack spacing="24px" marginBottom={"100px"}>
    <Box bgGradient={'linear( #E2F4C5 0%, yellow.50 30%, white 100%)'} w='100vw' py={10}>
      <Text
        bgGradient="linear(to-b, #58A399, #183D3D)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
        align="center"
        marginTop="40px"
      >
        Optical Looping Interactive Viewing Engine (OLIVE)
      </Text>
      
      <Box display={'flex'} justifyContent={'center'}>
        <Instructions setMaxReadout={setMaxReadout}/>
      </Box>
      </Box>
      <CSVReader maxReadout={maxReadout}/>
      <Divider />
      <DataBrowser />
    </VStack>
  );
};
export default FileUploader;
