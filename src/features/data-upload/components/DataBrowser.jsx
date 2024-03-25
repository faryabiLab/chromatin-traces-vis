import { useEffect, useContext, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { DataContext } from '../../../stores/data-context';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Heading,
  VStack,
  Box,
} from '@chakra-ui/react';

const DataBrowser = () => {
  const [table, setTable] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState('');
  const { readRemoteFile } = usePapaParse();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  useEffect(() => {
    //fetch metadata table from backend on load
    fetch('https://olive.faryabilab.com' + '/get-table')
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        }
        return response.json();
      })
      .then((data) => {
        setTable(data);
      });
  }, []);

  useEffect(() => {
    if (filename !== '') {
      fetch('https://olive.faryabilab.com/experiment/' + filename)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error('Bad response from server');
          }
          return response.json();
        })
        .then((data) => {
          setMetadata(data);
          scrollToMetadata();
        });
    }
  }, [filename]);

  const fetchCSV = (id) => {
    readRemoteFile(`https://faryabi-olive.s3.amazonaws.com/${id}.csv`, {
      complete: (results) => {
        const array = results.data;
        if (array && array.length > 0) {
          setDataBysHandler(array);
        }
        setIsLoading(false);
      },
      header: true,
    });
  };

  const scrollToMetadata = () => {
    if (metadata) {
      document.getElementById('meta_data').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderTable = (data) => {
    if (!data) {
      return <p>loading...</p>;
    }
    const header = data['header'];
    const content = data['content'];
    return (
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {header.map((item) => (
                <Th>{item}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {content.map((items, idx) => (
              <Tr key={idx} _hover={{ bg: 'teal.50' }}>
                {items.map((item, i) => (
                  <Td
                    key={idx + '+' + i}
                    onClick={() => {
                      setFilename(items[0]);
                    }}
                    cursor="pointer"
                  >
                    {item}
                  </Td>
                ))}
                <Td>
                  <Button
                    isLoading={isLoading}
                    colorScheme="teal"
                    variant="link"
                    size={'sm'}
                    onClick={() => {
                      setIsLoading(true);
                      fetchCSV(items[0]);
                    }}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };

  const renderMetadata = (data) => {
    if (!data) {
      return <p></p>;
    }

    return (
      <TableContainer id="meta_data">
        <Table size="lg">
          <Thead>
            <Tr>
              <Th>Metadata</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(data).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>{value}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };
  return (
    <VStack spacing="24px">
      <Box borderWidth="1px" borderRadius="lg">
        {renderTable(table)}
      </Box>
      <Box>{renderMetadata(metadata)}</Box>
    </VStack>
  );
};
export default DataBrowser;
