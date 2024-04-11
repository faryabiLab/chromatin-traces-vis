import { useEffect, useContext, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { DataContext } from '../../../stores/data-context';
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  VStack,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import {InfoOutlineIcon} from '@chakra-ui/icons'
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from './DataTable';
const DataBrowser = () => {
  const [table, setTable] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState('');
  const { readRemoteFile } = usePapaParse();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  const setPlotAllReadouts = dataCtx.setPlotAllReadouts;
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        });
    }
  }, [filename]);

  const fetchCSV = (id,readoutSteps) => {
    readRemoteFile(`https://faryabi-olive.s3.amazonaws.com/${id}.csv`, {
      complete: (results) => {
        const array = results.data;
        if (array && array.length > 0) {
          readoutSteps==='all'?setPlotAllReadouts(true):setPlotAllReadouts(false);
          setDataBysHandler(array);
        }
        setIsLoading(false);
      },
      header: true,
    });
  };

  const renderMetadata = (data) => {
    if (!data) {
      return <p>loading...</p>;
    }

    return (
      <TableContainer>
        <Table>
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

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', {
      id: 'filename',
      cell: (info) => info.getValue(),
      header: 'Filename',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('species', {
      cell: (info) => info.getValue(),
      header: 'Species',
    }),
    columnHelper.accessor('tissue', {
      cell: (info) => info.getValue(),
      header: 'Tissue',
    }),
    columnHelper.accessor('cell_type', {
      cell: (info) => info.getValue(),
      header: 'Cell Type',
    }),
    columnHelper.accessor('cell_line', {
      cell: (info) => info.getValue(),
      header: 'Cell Line',
    }),
    columnHelper.accessor('gene', {
      cell: (info) => info.getValue(),
      header: 'Gene',
    }),
    columnHelper.accessor('readout_steps', {
      id:'readout_steps',
      cell: (info) => info.getValue(),
      header: 'Readout Steps',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('lab', {
      cell: (info) => info.getValue(),
      header: 'Lab',
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: 'action',
      cell: (info) => (
        <>
        <Button
          colorScheme="teal"
          variant="ghost"
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            fetchCSV(info.row.original.id,info.row.original.readout_steps);
          }}
        >
          View
        </Button>
        <Button
          colorScheme="teal"
          variant="ghost"
          onClick={() => {
            setFilename(info.row.original.id);
            onOpen();
          }}
        >
          <InfoOutlineIcon />
        </Button>
        </>
      ),
      header: 'Action',
    }),
  ];

  return (
    <VStack spacing="24px">
      <Box>
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpen}
          onClose={onClose}
          placement="right"
          closeOnBlur={false}
          gutter={120}
        >
      <PopoverTrigger>
      <Box>
        {!table ? <p>loading...</p> : <DataTable data={table} columns={columns} />}
      </Box>
        </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold">Metadata</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>{renderMetadata(metadata)}</PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </VStack>
  );
};
export default DataBrowser;
