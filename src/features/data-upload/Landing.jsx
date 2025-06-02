import { Divider, Text, VStack, Box, Flex, Button } from '@chakra-ui/react';
import { useState } from 'react';
import FileUploader from './FileUploader';
import DataBrowser from './components/DataBrowser';
import { User, Rat, Bug } from 'lucide-react';

const Landing = () => {
  const [selectedSpecies, setSelectedSpecies] = useState('');
  
  return (
    <VStack spacing="24px" marginBottom={'100px'}>
      <Box bgGradient={'linear( #E2F4C5 0%, yellow.50 30%, white 100%)'} w="100vw" py={10}>
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
      {!selectedSpecies && (
        <Flex gap={8} width="60%" justifyContent="center">
          <Box width="50%">
            <VStack align="start" spacing={6}>
              <Text as="b" fontSize="3xl">
                Browse published data
              </Text>
              <Flex direction="column" gap={4} width="100%">
                <Button
                  onClick={() => setSelectedSpecies('human')}
                  height="100px"
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
                    <Text fontSize="xl">Human</Text>
                    
                  </VStack>
                </Button>

                <Button
                  onClick={() => setSelectedSpecies('mouse')}
                  height="100px"
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
                    <Text fontSize="xl">Mouse</Text>
              
                  </VStack>
                </Button>

                <Button
                  onClick={() => setSelectedSpecies('fly')}
                  height="100px"
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
                    <Text fontSize="xl">Fly</Text>
                  
                  </VStack>
                </Button>
              </Flex>
            </VStack>
          </Box>
          <Box width="50%">
            <FileUploader />
          </Box>
        </Flex>
      )}
      {selectedSpecies && (
        <>
          <Button 
            colorScheme="teal" 
            variant="outline" 
            onClick={() => setSelectedSpecies('')}
            alignSelf="flex-start"
            ml={8}
          >
            ← Back to species selection
          </Button>
          <Divider />
          <DataBrowser species={selectedSpecies}/>
        </>
      )}
    </VStack>
  );
};

export default Landing;
