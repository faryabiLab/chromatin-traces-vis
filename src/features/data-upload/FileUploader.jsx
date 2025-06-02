import { Box } from '@chakra-ui/react';
import Instructions from './components/Instructions';
import CSVReader from './components/CSVReader';
import { useState } from 'react';
const FileUploader = () => {
  const [maxReadout, setMaxReadout] = useState(null);
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={12}>
      <Instructions setMaxReadout={setMaxReadout} />
      <CSVReader maxReadout={maxReadout} />
    </Box>
  );
};
export default FileUploader;
