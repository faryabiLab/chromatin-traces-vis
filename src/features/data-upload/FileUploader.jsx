import { Divider, Text,VStack} from '@chakra-ui/react';


import Instructions from './components/Instructions';
import styles from './Uploader.module.css';

import DataBrowser from './components/DataBrowser';
import CSVReader from './components/CSVReader';

const FileUploader = () => {

  return (
    <VStack spacing='48px'>
      <Text
        bgGradient="linear(to-l,green.400, blue.300)"
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
      </div>
      <CSVReader />
      <Divider />
      <DataBrowser />
    </VStack>
  );
};
export default FileUploader;
