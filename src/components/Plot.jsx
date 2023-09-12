
import{useRef} from 'react';
import * as THREE from 'three';
import {Html, OrbitControls} from '@react-three/drei';
import "../style.css";

const Plot = (props) => {
  

  const groupRef=useRef();
  const data=props.data;
  if(!data) return null;
  let points=[];
  for(let row of data){
    let point=new THREE.Vector3(row.pos.x,row.pos.y,row.pos.z);
    points.push(point);
  } 
  //calculate bounding box center 
  const box=new THREE.Box3();
  box.setFromPoints(points);
  let center=new THREE.Vector3();
  box.getCenter(center);
  center=center.multiplyScalar(-1);


  const renderPoints=(points)=>{
    return points.map((point,index)=>{
      return(
        <mesh key={index} position={point} onClick={(e)=>{props.clickHandler(point)}}>
          <sphereGeometry args={[10,64,16]} />
          <meshStandardMaterial color="red" />
          <Html scaleFactor={10}>
            <div className="label">
              <p>{index+1}</p>
            </div>
          </Html>
          
        </mesh>
      )
    })
  }

  const renderTube=(points)=>{
    const curve=new THREE.CatmullRomCurve3(points,false);
    return(
      <mesh>
      <tubeGeometry args={[curve,256,5,64,false]} />
      <meshLambertMaterial color="gray" />
      </mesh>
    ) 
  }

  return(
    <>
    <OrbitControls />
    <ambientLight intensity={1.5} />
    <directionalLight position={center} intensity={2.5}/>

    <group ref={groupRef} position={center}>
    {renderPoints(points)}
    {renderTube(points)}
    </group>

    </>
  )

}
export default Plot;

  