import { useContext, useState } from 'react';
import { TraceContext } from '../../../stores/trace-context';
import {
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { CircleHelp } from 'lucide-react';
const RadiusFilter = () => {
  const traceCtx = useContext(TraceContext);
  const radiusHandler = traceCtx.radiusHandler;
  const current = traceCtx.current;
  const [value, setValue] = useState(200);
  const mode = traceCtx.mode;

  const handleChange = (newValue) => {
    setValue(newValue);
    radiusHandler(newValue);
  };

  const generateDefault = () => {
    return (
      <HStack spacing={2}>
        <Text fontWeight="bold">Filter readouts within a radius</Text>
        <Tooltip label="If you select a readout, you can identify readouts within a given distance to that selected readout.">
          <span>
            <CircleHelp boxSize={4} />
          </span>
        </Tooltip>
      </HStack>
    );
  };
  if (mode !== '1')
    return (
      <Box p={4} width="700px">
        {generateDefault()}
      </Box>
    );

  if (current === -1)
    return (
      <Box p={4} width="700px">
        {generateDefault()}
        <Text color="gray.500" fontSize="sm">
          Please select one readout of interest
        </Text>
      </Box>
    );

  return (
    <Box p={4} width="700px">
      {generateDefault()}
      <HStack spacing={4}>
        <Text fontWeight="light" width="600px">
          Filter readouts with distance to {current + 1} within{' '}
        </Text>
        <NumberInput value={value} min={0} max={1000} step={10} onChange={handleChange} size="xs">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text>nm</Text>
      </HStack>
    </Box>
  );
};
export default RadiusFilter;
