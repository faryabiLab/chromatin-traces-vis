import { TraceContext } from '../../../stores/trace-context';
import { DataContext } from '../../../stores/data-context';
import { useContext, useEffect, useState,useMemo } from 'react';
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
  Tooltip,
} from '@chakra-ui/react';
import { CircleHelp } from 'lucide-react';
const LinkageFilter = ({ alleleHandler, isApplied, setIsApplied }) => {
  const traceCtx = useContext(TraceContext);
  const dataCtx = useContext(DataContext);
  const curFov = traceCtx.selected.fov;
  const clicked = traceCtx.clicked;
  const mode = traceCtx.mode;
  const toFilter = dataCtx.filterDataBysHandler;
  const resetClickHandler = dataCtx.resetHandler;
  const selectedHandler = traceCtx.selectedHandler;
  const [distance, setDistance] = useState(10000);
  const toast = useToast();

  const totalKeys = dataCtx.totalKeys;

  const totalKeysCount = useMemo(() => {
    if (totalKeys[curFov]) {
      return totalKeys[curFov].length;
    }
    return 0;
  }, [totalKeys, curFov]);
  

  useEffect(() => {
    if(isApplied){
      setIsApplied(false);
      resetClickHandler();
      if(!dataCtx.keys[curFov]) return;
      selectedHandler(curFov.toString(), dataCtx.keys[curFov][0].toString());
      alleleHandler(0);
    }
   
  }, [mode]);

  const generateDefault = () => {
    return (
      <HStack spacing={2}>
        <Text fontWeight="bold">Calculate pairwise distance</Text>
        <Tooltip label="Filter alleles within the current fov with a maximum distance between two selected readouts">
          <span>
            <CircleHelp boxSize={4} />
          </span>
        </Tooltip>
      </HStack>
    );
  };
  if (mode !== '2')
    return (
      <Box p={4} width="700px">
        {generateDefault()}
      </Box>
    );

  if (clicked.a === -1 || clicked.b === -1)
    return (
      <Box p={4} width="700px">
        {generateDefault()}
        <Text color="gray.500" fontSize="sm">
          Please select any two readouts
        </Text>
      </Box>
    );
  return (
    <Box p={4} width="700px">
     {generateDefault()}
      <HStack spacing={4}>
        <Text fontWeight="light" width="600px">
          {dataCtx.keys[curFov].length}/{totalKeysCount} alleles with distance between {clicked.a + 1} and {clicked.b + 1} within:{' '}
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
              setIsApplied(true);
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
            setIsApplied(false);
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
