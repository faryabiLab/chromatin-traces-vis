import {Text, Highlight} from "@chakra-ui/react";

const Instructions=()=>{
  return (
    <>
   <Text as="b" fontSize="3xl">
        Welcome, Please upload csv file with the following columns:
      </Text>
      <Text as="li" fontSize="xl">
        <Highlight
          query={['x', 'y', 'z']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >
          x,y,z: coordinates
        </Highlight>
      </Text>
      <Text as="li" fontSize="xl">
      <Highlight
          query={['fov']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >fov: field of view</Highlight></Text>
      <Text as="li" fontSize="xl">
      <Highlight
          query={['s']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >s: allele</Highlight></Text>
      <Text as="li" fontSize="xl">
      <Highlight
          query={['readout']}
          styles={{ px: '1', py: '0.8', rounded: 'full', bg: 'teal.100' }}
        >readout: step, only odd ones (1,3,5,...) are plotted</Highlight>
      </Text>
    </>
  );
};
export default Instructions;
