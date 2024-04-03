import { Text,VStack} from '@chakra-ui/react';


import Instructions from './Instructions';
import styles from '../Uploader.module.css';

import DataBrowser from './DataBrowser';
import CSVReader from './CSVReader';

const FileUploader = () => {

  return (
    <VStack spacing='48px'>
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
      </div>
      <CSVReader />
      <DataBrowser />
    </VStack>
  );
};
export default FileUploader;
