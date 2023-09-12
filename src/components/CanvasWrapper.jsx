import {Canvas} from '@react-three/fiber';
const CanvasWrapper = (props) => {
  const Component=props.component;
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
      <Component data={props.data} clickHandler={props.clickHandler}/>
      </Canvas>
      </div>
  )
}
export default CanvasWrapper;
