import { TraceContext } from '../../../stores/trace-context';
import { DataContext } from '../../../stores/data-context';
import { useContext, useState } from 'react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  HStack,
  useToast,
  Box,
  Text,
} from '@chakra-ui/react';
const LinkageFilter = ({ alleleHandler }) => {
  const traceCtx = useContext(TraceContext);
  const dataCtx = useContext(DataContext);
  const curFov = traceCtx.selected.fov;
  const clicked = traceCtx.clicked;
  const toFilter = dataCtx.filterDataBysHandler;
  const resetClickHandler = dataCtx.resetHandler;
  const selectedHandler = traceCtx.selectedHandler;
  const [distance, setDistance] = useState(10000);
  const toast = useToast();
  if (clicked.a === -1 || clicked.b === -1)
    return (
      <Box p={4} width="700px">
        <Text fontWeight="medium" width="600px">Select any two points to enable linkage filter</Text>
      </Box>
    );
  return (
    <Box p={4} width="700px">
      <HStack spacing={4}>
        <Text fontWeight="medium" width="600px">
          Distance between {clicked.a + 1} and {clicked.b + 1} within:{' '}
        </Text>
        <NumberInput
          size="xs"
          step={5}
          maxW={20}
          min={0}
          onChange={(e) => {
            setDistance(e);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text>nm</Text>
        <Button
          colorScheme="teal"
          variant="ghost"
          onClick={() => {
            toFilter(curFov, clicked.a, clicked.b, distance);
            if (dataCtx.keys[curFov].length === 0) {
              toast({
                title: 'Filter Failed',
                description: 'No allele found within the given distance',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-center',
              });
              resetClickHandler();
            } else {
              selectedHandler(curFov.toString(), dataCtx.keys[curFov][0].toString());
              alleleHandler(0);
              toast({
                title: 'Filter applied',
                description: 'Filter applied to the selected points',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-center',
              });
            }
          }}
        >
          Apply
        </Button>
        <Button
          colorScheme="gray"
          variant="ghost"
          onClick={() => {
            resetClickHandler();
            selectedHandler(curFov.toString(), dataCtx.keys[curFov][0].toString());
            alleleHandler(0);
            toast({
              title: 'Filter Restored',
              description: 'Reset to default',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top-center',
            });
          }}
        >
          Cancel
        </Button>
      </HStack>
    </Box>
  );
};
export default LinkageFilter;
