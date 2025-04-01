import {
  Text,
  Highlight,
  VStack,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const Instructions = ({setMaxReadout}) => {
  const highlightColor = '#F6F7C1';
  
  const handleChange = (readouts) => {
    setMaxReadout(readouts);
  };
  return (
    <VStack align="flex-start" marginTop={'40px'}>
      <Text as="b" fontSize="3xl">
        Welcome, Please upload csv file with the following columns:
      </Text>
      <Text as="li" fontSize="xl">
        <Highlight
          query={['x', 'y', 'z']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: highlightColor }}
        >
          x,y,z: coordinates
        </Highlight>
      </Text>
      <Text as="li" fontSize="xl">
        <Highlight
          query={['fov']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: highlightColor }}
        >
          fov: field of view
        </Highlight>
      </Text>
      <Text as="li" fontSize="xl">
        <Highlight
          query={['s']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: highlightColor }}
        >
          s: allele
        </Highlight>
      </Text>
      <Text as="li" fontSize="xl">
        <Highlight
          query={['readout']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: highlightColor }}
        >
          readout: step
        </Highlight>
      </Text>
      <FormLabel htmlFor="total-readouts" mb="0">
        Number of Total Readouts
      </FormLabel>
      <NumberInput step={5} size="xs" onChange={handleChange}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </VStack>
  );
};
export default Instructions;
