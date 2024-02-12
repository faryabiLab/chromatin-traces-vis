import { TraceContext } from "../../../stores/trace-context";
import { DataContext } from "../../../stores/data-context";
import { useContext,useState } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react'
const Filter = ({alleleHandler}) => {
  const traceCtx = useContext(TraceContext);
  const dataCtx=useContext(DataContext);
  const curFov=traceCtx.selected.fov;
  const clicked=traceCtx.clicked;
  const toFilter=dataCtx.filterDataBysHandler;
  const resetClickHandler=dataCtx.resetHandler;
  const selectedHandler = traceCtx.selectedHandler;
  const [distance,setDistance]=useState(10000);
  const toast = useToast();
  return(
    <>
    <HStack>
    <span>Distance between {clicked.a+1} and {clicked.b+1} within: </span>
    <NumberInput size='sm' step={5} maxW={20} min={0}  onChange={(e)=>{setDistance(e)}}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
  <span>nm</span>
  <Button size='sm' colorScheme='teal' variant='ghost' onClick={()=>{
      toFilter(curFov,clicked.a,clicked.b,distance);
      selectedHandler(curFov.toString(),dataCtx.keys[curFov][0].toString());
      alleleHandler(0);
      toast({
          title: 'Filter applied',
          description: "Filter applied to the selected points",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position:'top-center'
        })
      }}>Filter</Button>
    <Button size='sm' colorScheme='gray' variant='ghost' onClick={()=>{
      resetClickHandler();
      selectedHandler(curFov.toString(),dataCtx.keys[curFov][0].toString());
      alleleHandler(0);
      toast({
          title: 'Filter Restored',
          description: "Reset to default",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position:'top-center'
        })
      }}>Cancel</Button>
  </HStack>
    </>
  )
}
export default Filter;
