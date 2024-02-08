import { TraceContext } from "../../../stores/trace-context";
import { DataContext } from "../../../stores/data-context";
import { useContext,useState } from "react";
import { Input,Button } from '@chakra-ui/react'
const Filter = () => {
  const traceCtx = useContext(TraceContext);
  const dataCtx=useContext(DataContext);
  const curFov=traceCtx.selected.fov;
  const clicked=traceCtx.clicked;
  const toFilter=dataCtx.filterDataBysHandler;
  const clickedHandler=traceCtx.clickedHandler;
  const [distance,setDistance]=useState(10000);
  return(
    <>
    <span>clicked: {clicked.a+1},{clicked.b+1}, fov: {curFov}</span>
    <Input placeholder='distance' onChange={(e)=>{setDistance(e.target.value)}}/>
    <Button onClick={()=>{
      toFilter(curFov,clicked.a,clicked.b,distance);
      }}>Filter</Button>
    </>
  )
}
export default Filter;
