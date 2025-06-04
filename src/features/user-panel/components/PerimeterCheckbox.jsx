import { Box, Text, HStack, Tooltip } from '@chakra-ui/react';
import { TraceContext } from '../../../stores/trace-context';
import { useContext, useEffect } from 'react';
import { CircleHelp } from 'lucide-react';
const PerimeterCheckbox = ({ mode }) => {
  const traceCtx = useContext(TraceContext);
  const perimeterHandler = traceCtx.perimeterHandler;
  useEffect(() => {
    if (mode === '3') {
      perimeterHandler(true);
    } else {
      perimeterHandler(false);
    }
  }, [mode]);
  const generateDefault = () => {
    return (
      <HStack spacing={2}>
        <Text fontWeight="bold">Calculate 3-way perimeter</Text>
        <Tooltip label="Calculate perimeter of 3 selected readouts">
          <span>
            <CircleHelp boxSize={4} />
          </span>
        </Tooltip>
      </HStack>
    );
  };
  if (mode !== '3') {
    return (
      <Box p={4} width="700px">
        {generateDefault()}
      </Box>
    );
  }

  return (
    <Box p={4} width="700px">
      {generateDefault()}
      <Text color="gray.500" fontSize="sm">
        Please select any three readouts
      </Text>
    </Box>
  );
};
export default PerimeterCheckbox;
