import {Canvas} from '@react-three/fiber';
import {useContext} from 'react';
import { TraceContext } from '../../../stores/trace-context';
import WelcomeSelect from './WelcomeSelect';
import styles from '../../../components/Layout/Panel.module.css';

const CanvasWrapper = (props) => {
  const Component=props.component;
  const traceCtx=useContext(TraceContext);
  const selected=traceCtx.selected;
  const showCanvas=selected.fov!==null&&selected.s!==null;
  return(
    <div className={styles.one}>
    {!showCanvas&&<WelcomeSelect/>}
    {showCanvas&&<Canvas
        orthographic
      camera={ {
          fov: 45,
          zoom:1.5,
          near: 0.1,
          far: 20000,
          position: [0,-500,-2000],
          up: [0, 0, 1]
      } }
      gl={{preserveDrawingBuffer:true}}>
        <color attach="background" args={['#F6FAFE']} />
        <group rotation={[-Math.PI / 2, Math.PI, Math.PI / 2]}>
        <Component/>
        </group>
        </Canvas>}
      </div>
  )
}
export default CanvasWrapper;
 