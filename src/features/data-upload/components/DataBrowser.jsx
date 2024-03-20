import {useEffect,useContext,useState} from 'react';
import {usePapaParse} from 'react-papaparse';
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
} from '@chakra-ui/react';

const DataBrowser = () => {
  const [table, setTable] = useState(null);
  const {readRemoteFile}=usePapaParse();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  useEffect(() => {
    //fetch metadata table from backend on load
    fetch('https://olive.faryabilab.com'+'/get-table')
    .then((response) => {
      if(response.status>=400){
        throw new Error('Bad response from server');
      }
      return response.json();
    })
    .then((data) => {
      setTable(data);
    })
  },[]);

  const fetchCSV = (id) => {
    readRemoteFile(`https://faryabi-olive.s3.amazonaws.com/${id}.csv`, {
      complete: (results) => {
        const array=results.data;
        if (array&&array.length > 0) {
          setDataBysHandler(array);
        }
      },
      header: true,

    });
  }

  const renderTable = (data) => {
    if(!data){
      return(
        <p>loading...</p>
      )
    }
    const header=data['header'];
    const content=data['content'];
    return (
      <TableContainer>
      <Table variant='simple'>
        <Thead>
        <Tr>
          {header.map((item) => (
            
             <Th>
              {item}
             </Th>   
            
          ))}
          <Th>
            Actions
          </Th>
          </Tr>
        </Thead>
        <Tbody>
          {content.map((items,idx) => (
            <Tr key={idx}>
            {items.map((item,i) => (
              <Td key={idx+'+'+i}>
                {item}
              </Td>
            ))}
            <Td>
              <Button
               colorScheme='teal'
                variant='ghost'
                onClick={() => {
                  fetchCSV(items[0]);
                }}
              >
                Go
              </Button>
            </Td>
            </Tr>
          ))}
        </Tbody>
        </Table>
      </TableContainer>
    );
  }
  return (
    renderTable(table)
  )
};
export default DataBrowser;
