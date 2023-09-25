import Panel from './components/Panel';

import {ChakraProvider} from '@chakra-ui/react';
import {DataProvider} from './store/DataProvider';
import {TraceProvider} from './store/TraceProvider';

function App() {
  return (
    
      <ChakraProvider>
      <DataProvider>
      <TraceProvider>
        <Panel /> 
        </TraceProvider>
      </DataProvider>
      </ChakraProvider>
       
    
  )
}

export default App;
