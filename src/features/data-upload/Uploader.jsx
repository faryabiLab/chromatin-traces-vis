import {
  Text,
  VStack,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Tooltip,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import CSVReader from './components/CSVReader';
const Uploader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box width="100%">
      <VStack align="end" spacing={5}>
      <VStack align="start" spacing={5}>
        <Text as="b" fontSize="3xl">
          Upload your own chromatin traces
        </Text>
        <Text as="i" fontSize="xl">
          Required Columns
        </Text>
        </VStack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Files</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <CSVReader />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Box overflowX="auto">
          <TableContainer minWidth="600px" maxWidth="100%">
            <Table
              variant="simple"
              size={{ base: 'sm', md: 'md', lg: 'lg' }} // Responsive table size
              sx={{
                th: {
                  backgroundColor: '#6A9C89',
                  color: 'white',
                  fontSize: { base: 'md', lg: 'lg' }, // Responsive font size
                  whiteSpace: 'nowrap', // Prevents text wrapping in headers
                  px: { base: 2, md: 4 }, // Responsive padding
                },
                'th, td': {
                  borderColor: 'rgba(72, 113, 109, 0.5)',
                  px: { base: 2, md: 4 }, // Responsive padding
                },
                td: {
                  fontSize: { base: 'sm', md: 'md', lg: 'lg' }, // Responsive font size
                },
              }}
            >
              <Thead>
                <Tr>
                  <Tooltip label="Field of View" placement="top">
                    <Th>FOV</Th>
                  </Tooltip>
                  <Tooltip label="Allele number of a trace" placement="top">
                    <Th>Trace (s)</Th>
                  </Tooltip>
                  <Tooltip label="Sequential order of a registered step of a trace" placement="top">
                    <Th>Readout</Th>
                  </Tooltip>
                  <Tooltip label="X-axis coordinate" placement="top">
                    <Th>X</Th>
                  </Tooltip>
                  <Tooltip label="Y-axis cooordinate" placement="top">
                    <Th>Y</Th>
                  </Tooltip>
                  <Tooltip label="Z-axis coordinate" placement="top">
                    <Th>Z</Th>
                  </Tooltip>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td></Td>
                  <Td
                    rowSpan={3}
                    colSpan={4}
                    textAlign={'center'}
                    onClick={onOpen}
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Text
                      as="b"
                      fontSize={{ base: 'lg', md: 'xl' }} // Responsive font size
                    >
                      Click to start uploading
                    </Text>
                  </Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Box>
  );
};
export default Uploader;
