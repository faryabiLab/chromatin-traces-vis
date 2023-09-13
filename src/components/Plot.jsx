
import{useEffect, useRef,useState} from 'react';
import * as THREE from 'three';
import {Html, OrbitControls,Line} from '@react-three/drei';
import "../style.css";

const Plot = (props) => {
  
  const [pointA,setPointA]=useState(null);
  const [pointB,setPointB]=useState(null);
  const groupRef=useRef();
  //initialize pointA and pointB to null when selected changes
  useEffect(()=>{
    setPointA(null);
    setPointB(null);
  },[props.selected]);
  const data=props.data;
  if(!data||data.length===0) return null; 
 
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

  //return true if two vectors are considered equal
  const equalVectors=(u,v,epsilon=Number.EPSILON)=>{
    if(!u||!v) return false;
    return ( ( Math.abs( u.x - v.x ) < epsilon ) && ( Math.abs( u.y - v.y ) < epsilon ) && ( Math.abs( u.z - v.z ) < epsilon ) );
  }
 
  //check if pair is valid
  //if so, call clickHandler
  //if not, do nothing
  const generatePairs=(point)=>{
    let a=null,b=null;
    if(!pointA&&!pointB){
      a=point;
    }else if(!pointA||!pointB){
      if(!pointA){
        a=point;
        b=pointB;
      }else{
        a=pointA;
        b=point;
      }
      // props.clickHandler(pair);
    }else{
    //click on pointA
      if(equalVectors(pointA,point)){
        a=null;
        b=pointB;
      }else if(equalVectors(pointB,point)){
        //click on pointB 
        a=pointA;
        b=null;
      }else{
        a=point;
      }

    }
    setPointA(a);
    setPointB(b);

    if(a&&b){
      
      props.clickHandler(a,b);
    }
  }
 

  const colorClicked=(point)=>{
    if(equalVectors(pointA,point)||equalVectors(pointB,point)){
      return 'red';
    }else{
      return 'black';
    }
  }

  const calculateMidpoint=(pointA,pointB)=>{
    if(!pointA||!pointB) return null;
    return new THREE.Vector3((pointA.x+pointB.x)/2.0,(pointA.y+pointB.y)/2.0,(pointA.z+pointB.z)/2.0);
  }
  const renderLine=()=>{
    if(!pointA||!pointB) return null;
    return(
      <>
      <Line points={[pointA,pointB]} color="red" lineWidth={8} />
      <Html scaleFactor={10} position={calculateMidpoint(pointA,pointB)} >
      <div className="distance-panel">
         <p>{pointA.distanceTo(pointB)}</p>
      </div>
      </Html>
      </>
    )
  }
  const renderPoints=(points)=>{
    return points.map((point,index)=>{
      return(
        <mesh key={index} position={point} onClick={(e)=>{generatePairs(point)}}>
          <sphereGeometry args={[10,64,16]} />
          <meshStandardMaterial color={colorClicked(point)} />
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
    {renderLine()}
    </group>

    </>
  )

}
export default Plot;

  