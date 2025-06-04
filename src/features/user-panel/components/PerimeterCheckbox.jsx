import { Box, Text } from '@chakra-ui/react';
import { TraceContext } from '../../../stores/trace-context';
import {useContext,useEffect} from 'react';
import { use } from 'react';
const PerimeterCheckbox = ({mode}) => {
  const traceCtx=useContext(TraceContext);
  const perimeterHandler=traceCtx.perimeterHandler;
  useEffect(()=>{
    if(mode==='3'){
      perimeterHandler(true);
    }else{
      perimeterHandler(false);
    }
  },[mode]);
  
  if(mode!=='3'){
    return (
      <Box p={4} width="700px">
        <Text fontWeight="medium" width="600px">Calculate multi-segment perimeter</Text>
      </Box>
    );
  }

  return (
    <Box p={4} width="700px">
        <Text fontWeight="medium" width="600px">Calculate multi-segment perimeter: Select multiple segments</Text>
      </Box>
  );
};
export default PerimeterCheckbox;
