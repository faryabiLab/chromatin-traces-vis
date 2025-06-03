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
      <VStack align="start" spacing={5}>
        <Text as="b" fontSize="3xl">
          Upload your own chromatin traces
        </Text>
        <Text as="i" fontSize="xl">
          Required Columns
        </Text>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Files</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <CSVReader/>
            </ModalBody>
          </ModalContent>
        </Modal>
        <TableContainer>
          <Table
            variant="simple"
            sx={{
              th: {
                backgroundColor: '#6A9C89',
                color: 'white',
                fontSize: 'lg',
              },
              // Make borders more visible
              'th, td': {
                borderColor: 'rgba(72, 113, 109, 0.5)',
              },
            }}
          >
            {/* <TableCaption>Requried Columns</TableCaption> */}
            <Thead>
              <Tr>
                <Tooltip label="Field of View" placement="top">
                  <Th fontSize="lg">FOV</Th>
                </Tooltip>
                <Tooltip label="Allele number of a trace" placement="top">
                  <Th fontSize="lg">Trace (s)</Th>
                </Tooltip>
                <Tooltip label="Sequential order of a registered step of a trace" placement="top">
                  <Th fontSize="lg">Readout</Th>
                </Tooltip>
                <Tooltip label="X-axis coordinate" placement="top">
                  <Th fontSize="lg">X</Th>
                </Tooltip>
                <Tooltip label="Y-axis cooordinate" placement="top">
                  <Th fontSize="lg">Y</Th>
                </Tooltip>
                <Tooltip label="Z-axis coordinate" placement="top">
                  <Th fontSize="lg">Z</Th>
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
                  <Text as="b" fontSize="xl">
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
      </VStack>
    </Box>
  );
};
export default Uploader;
