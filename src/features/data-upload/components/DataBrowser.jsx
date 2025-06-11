import { useEffect, useContext, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { DataContext } from '../../../stores/data-context';
import FloatingTable from './FloatingWindow';
import {
  Button,
  VStack,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import {InfoOutlineIcon} from '@chakra-ui/icons'
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from './DataTable';
const DataBrowser = ({species}) => {
  const [table, setTable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState('');
  const { readRemoteFile } = usePapaParse();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  const setTotalReadouts=dataCtx.setTotalReadouts;
  const setFilenameHandler = dataCtx.setFilename;
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



  const fetchCSV = (id,readoutSteps) => {
    readRemoteFile(`https://faryabi-olive.s3.amazonaws.com/${id}.csv`, {
      complete: (results) => {
        const array = results.data;
        if (array && array.length > 0) {
          setDataBysHandler(array);
          setTotalReadouts(readoutSteps);
          setFilenameHandler(id);
        }
        setIsLoading(false);
      },
      header: true,
    });
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
      header: 'Locus',
    }),
    columnHelper.accessor('genotype', {
      cell: (info) => info.getValue(),
      header: 'Genotype',
    }),
    columnHelper.accessor('treatment', {
      cell: (info) => info.getValue(),
      header: 'Treatment',
    }),
    columnHelper.accessor('number_readout', {
      id:'number_readout',
      cell: (info) => info.getValue(),
      header: 'Total Readout',
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
            fetchCSV(info.row.original.id,info.row.original.number_readout);
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
      <Box>
        {!table ? <p>loading...</p> : <DataTable data={table} columns={columns} species={species}/>}
      </Box>
      <FloatingTable 
          file={filename} 
          isOpen={isOpen} 
          onClose={onClose}
        />
      </Box>
    </VStack>
  );
};
export default DataBrowser;
