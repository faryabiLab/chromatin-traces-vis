import {Text, Highlight,VStack} from "@chakra-ui/react";

const Instructions=()=>{
  const highlightColor='#F6F7C1';
  return (
    <VStack align="flex-start" marginTop={"40px"}>
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
        >fov: field of view</Highlight></Text>
      <Text as="li" fontSize="xl">
      <Highlight
          query={['s']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: highlightColor }}
        >s: allele</Highlight></Text>
      <Text as="li" fontSize="xl">
      <Highlight
          query={['readout']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: highlightColor }}
        >readout: step, only odd ones (1,3,5,...) are plotted</Highlight>
      </Text>
    </VStack>
  );
};
export default Instructions;
