import CanvasWrapper from '../../features/chromatin-models/components/CanvasWrapper';
import Plot from '../../features/chromatin-models/components/Plot';
import Dashboard from '../../features/user-panel/Dashboard';
import Landing from '../../features/data-upload/Landing';
import { DataContext } from '../../stores/data-context';
import { useContext } from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';
const Panel = () => {
  const dataCtx = useContext(DataContext);
  const isUploaded = dataCtx.dataBys === null ? false : true;
  return (
    <>
      {isUploaded ? (
        <div>
          <Heading as="h1" style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
            Optical Looping Interactive Viewing Engine (OLIVE)
          </Heading>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            minH="100vh"
            wrap="wrap"
            justify="center"
            overflow="auto"
          >
            <Box
              position="relative"
              w={{ base: '95%', lg: '45%' }}
              h={{ base: '80vh', lg: '100vh' }}
              minH={{ base: '50vh', lg: '100vh' }}
              p={4}
              m={2}
              border={'1px solid #ccc'}
              borderRadius="md"
            >
              <CanvasWrapper component={Plot} />
            </Box>
            <Box
              w={{ base: '95%', lg: '45%' }}
              minH={{ base: '50vh', lg: '100vh' }}
              m={2}
              borderRadius="md"
            >
              <Dashboard />
            </Box>
          </Flex>
        </div>
      ) : (
        <Landing />
      )}
    </>
  );
};
export default Panel;
