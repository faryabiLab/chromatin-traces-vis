import {
  Text,
  Highlight,
  HStack,
  VStack,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const Instructions = ({setMaxReadout}) => {
  const warningColor='#e23636';
  
  const handleChange = (readouts) => {
    setMaxReadout(readouts);
  };
  return (
      <HStack spacing={2} alignItems="center">
      <FormLabel htmlFor="total-readouts" mb="0">
      <Highlight
          query={['*']}
          styles={{ px: '1', py: '0.6', rounded: 'full', bg: warningColor }}
        >
          * Number of Total Readouts:
        </Highlight>
        
      </FormLabel>
      <NumberInput step={5} size="xs" onChange={handleChange}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      </HStack>
  );
};
export default Instructions;
