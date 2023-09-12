import Panel from './components/Panel';
import './style.css';
import {ChakraProvider} from '@chakra-ui/react';

function App() {
  return (
    
      <ChakraProvider>
        <Panel /> 
      </ChakraProvider>
       
    
  )
}

export default App;
