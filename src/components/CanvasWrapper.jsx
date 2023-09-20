import {Canvas} from '@react-three/fiber';
import {useContext} from 'react';
import { TraceContext } from '../store/trace-context';
import Welcome from './Welcome';
const CanvasWrapper = (props) => {
  const Component=props.component;
  const traceCtx=useContext(TraceContext);
  const selected=traceCtx.selected;
  const showCanvas=selected.fov!==null&&selected.s!==null;
  return(
    <div style={{position:'relative',width:'60%',height:'100%'}}>
    {!showCanvas&&<Welcome/>}
    {showCanvas&&<Canvas
        orthographic
      camera={ {
          fov: 45,
          zoom:1.5,
          near: 0.1,
          far: 20000,
          position: [0,500,1000]
      } }>
        <Component/>
        </Canvas>}
      </div>
  )
}
export default CanvasWrapper;
 