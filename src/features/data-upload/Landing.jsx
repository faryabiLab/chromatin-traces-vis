import { Divider, Text, VStack, Box, Flex, Button, Link } from '@chakra-ui/react';
import { useState } from 'react';
import Uploader from './Uploader';
import DataBrowser from './components/DataBrowser';
import { User, Rat, Bug } from 'lucide-react';

const Landing = () => {
  const [selectedSpecies, setSelectedSpecies] = useState('');
  
  return (
    <VStack spacing="24px" marginBottom={'100px'}>
      <Box bgGradient={'linear( #E2F4C5 5%, yellow.50 60%, white 100%)'} w="100vw" py={10}>
        <Text
          bgGradient="linear(to-b, #58A399, #183D3D)"
          bgClip="text"
          fontSize="6xl"
          fontWeight="extrabold"
          align="center"
          marginTop="40px"
        >
          Optical Looping Interactive Viewing Engine (OLIVE)
        </Text>
      </Box>
      <Box width="60%">
      <Link
      href="https://github.com/faryabiLab/chromatin-traces-vis" // Replace with your actual GitHub URL
      isExternal // This will open in a new tab
      _hover={{ textDecoration: 'none' }} // Removes default link underline
    >
      <Box 
        p={4} 
        borderRadius="md" 
        width="100%" 
        textAlign="center"
        border="4px"
        borderColor="#E7EFC7"
        cursor="pointer"
        _hover={{ bg: '#E7EFC7' }}
      >
        <Text as="b" fontSize="lg" color="teal.700">
          First time to OLIVE? Click here to visit our github page for more information!
        </Text>
      </Box>
    </Link>
    </Box>
      {!selectedSpecies && (
        <Flex gap={8} width="60%" justifyContent="center">
          <Box width="50%">
            <VStack align="start" spacing={6}>
              <Text as="b" fontSize="3xl">
                Browse Available Chromatin Traces
              </Text>
              <Flex direction="column" gap={4} width="100%">
                <Button
                  onClick={() => setSelectedSpecies('human')}
                  height="120px"
                  width="60%"
                  colorScheme="teal"
                  variant={selectedSpecies === 'human' ? 'solid' : 'outline'}
                  display="flex"
                  gap={4}
                  justifyContent="flex-start"
                  padding={6}
                >
                  <User size={32} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="2xl">Human</Text>
                    
                  </VStack>
                </Button>

                <Button
                  onClick={() => setSelectedSpecies('mouse')}
                  height="120px"
                  width="60%"
                  colorScheme="teal"
                  variant={selectedSpecies === 'mouse' ? 'solid' : 'outline'}
                  display="flex"
                  gap={4}
                  justifyContent="flex-start"
                  padding={6}
                >
                  <Rat size={32} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="2xl">Mouse</Text>
              
                  </VStack>
                </Button>

                <Button
                  onClick={() => setSelectedSpecies('fly')}
                  height="120px"
                  width="60%"
                  colorScheme="teal"
                  variant={selectedSpecies === 'fly' ? 'solid' : 'outline'}
                  display="flex"
                  gap={4}
                  justifyContent="flex-start"
                  padding={6}
                >
                  <Bug size={32} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="2xl">Fly</Text>
                  
                  </VStack>
                </Button>
              </Flex>
            </VStack>
          </Box>
          <Box width="50%">
            <Uploader />
          </Box>
        </Flex>
      )}
      {selectedSpecies && (
        <>
          <Button 
            colorScheme="teal" 
            variant="outline" 
            onClick={() => setSelectedSpecies('')}
            ml={8}
          >
            ← Back
          </Button>
          <Divider />
          <DataBrowser species={selectedSpecies}/>
        </>
      )}
    </VStack>
  );
};

export default Landing;
