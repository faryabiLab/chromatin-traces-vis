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
  const highlightColor = '#F6F7C1';
  const warningColor='#e23636';
  
  const handleChange = (readouts) => {
    setMaxReadout(readouts);
  };
  return (
    <VStack align="flex-start"  spacing={'20px'}>
    <VStack align="flex-start"  spacing={'10px'}>
      <Text as="b" fontSize="3xl">
        Upload your own
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
      </VStack>
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
    </VStack>
  );
};
export default Instructions;
