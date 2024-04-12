import Panel from './components/Layout/Panel';

import {ChakraProvider} from '@chakra-ui/react';
import {DataProvider} from './stores/DataProvider';
import {TraceProvider} from './stores/TraceProvider';

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
