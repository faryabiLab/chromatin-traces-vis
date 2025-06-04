import { useContext,useState } from "react";
import { TraceContext } from "../../../stores/trace-context";
import {
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  HStack
} from '@chakra-ui/react';
const RadiusFilter=()=>{
  const traceCtx=useContext(TraceContext);
  const radiusHandler=traceCtx.radiusHandler;
  const current=traceCtx.current;
  const [value, setValue] = useState(1);

  const handleChange = (newValue) => {
    setValue(newValue);
    radiusHandler(newValue);
  };

  return(
    <Box p={4} width="600px">
      <HStack spacing={4}>
        <Text fontWeight="medium" width="600px">Segments with Distance to {current+1} within </Text>
        <NumberInput 
          value={value}
          min={0}
          max={1000}
          step={10}
          onChange={handleChange}
          size="xs"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text>nm</Text>
      </HStack>
    </Box>
  )
}
export default RadiusFilter;
