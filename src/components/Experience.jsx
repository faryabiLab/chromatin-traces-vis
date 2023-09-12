import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {useThree, extend, useFrame} from '@react-three/fiber';
import {useRef} from 'react';
extend({OrbitControls});

const Experience = () => {
  const {camera,gl} = useThree();
  const groupRef = useRef();
  const xRef = useRef();
  useFrame(() => {
    groupRef.current.rotation.y += 0.01;
    xRef.current.rotation.x += 0.005;
  });
  return(
    <>
    <orbitControls args={[camera, gl.domElement]} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[1, 2, 3]} intensity={1.5} />
    <mesh>
      <boxGeometry args={[2,5,2]} />
      <meshStandardMaterial />
    </mesh>
    <mesh position={[-3,-1,1]}>
      <boxGeometry args={[2,2,3]} />
      <meshStandardMaterial />
    </mesh>
    <group ref={ groupRef }>
            <mesh position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
            <mesh position={[2,2,4]}>
                <sphereGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
            <mesh position-x={ 4 } scale={1.5}>
                <sphereGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh position={[-5,-1,2]}>
                <sphereGeometry />
                <meshStandardMaterial color="blue" />
            </mesh>

      </group>

      <group ref={ xRef }>
           
            <mesh position={[1,5,4]} scale={1.2}>
                <sphereGeometry />
                <meshStandardMaterial color="pink" />
            </mesh>
         

      </group>

    <mesh position-y={ - 2 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
    </mesh>
    </>
  )

}
export default Experience;
