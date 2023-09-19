import {Canvas} from '@react-three/fiber';
import {useContext} from 'react';
import { TraceContext } from '../store/trace-context';
const CanvasWrapper = (props) => {
  const Component=props.component;
  const traceCtx=useContext(TraceContext);
  const selected=traceCtx.selected;
  console.log(selected);
  if(selected.fov===null||selected.s===null) return (
    <h1>Please choose fov and allele</h1>
  );
  return(
    <div style={{position:'relative',width:'60%',height:'100%'}}>
  <Canvas
      orthographic
    camera={ {
        fov: 45,
        zoom:1.5,
        near: 0.1,
        far: 20000,
        position: [0,500,1000]
    } }>
      <Component/>
      </Canvas>
      </div>
  )
}
export default CanvasWrapper;
 