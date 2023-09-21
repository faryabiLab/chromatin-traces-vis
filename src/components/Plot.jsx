import { useEffect, useRef, useState,useContext } from 'react';
import { TraceContext } from '../store/trace-context';
import * as THREE from 'three';
import { Html, OrbitControls, Line } from '@react-three/drei';
import styles from './Plot.module.css';

const Plot = () => {
  //index of the points that are clicked
  const traceCtx=useContext(TraceContext);
  const [pointA, setPointA] = useState(-1);
  const [pointB, setPointB] = useState(-1);
  const groupRef = useRef();
  const data=traceCtx.data;
  const selected=traceCtx.selected;
  const clickedHandler=traceCtx.clickedHandler;
  const clicked=traceCtx.clicked;
  //initialize pointA and pointB to null when selected changes
  useEffect(() => {
    setPointA(-1);
    setPointB(-1);
  }, [selected]);

  useEffect(() => {
    setPointA(clicked.a);
    setPointB(clicked.b);
  },[clicked]);
  
  if (!data || data.length === 0) return null;

  //convert data to list of THREE.Vector3
  let points = [];
  for (let row of data) {
    let point = new THREE.Vector3(row.pos.x, row.pos.y, row.pos.z);
    points.push(point);
  }
  //calculate bounding box center to put model at origin
  const box = new THREE.Box3();
  box.setFromPoints(points);
  let center = new THREE.Vector3();
  box.getCenter(center);
  center = center.multiplyScalar(-1);



  //check if pair is valid
  //point is the index of the point in the points array
  const generatePairs = (point) => {
    let a = -1,
      b = -1;
    if (pointA<0 && pointB<0) {
      a = point;
    } else if (pointA<0 || pointB<0) {
      if (pointA<0) {
        a = point;
        b = pointB;
      } else {
        a = pointA;
        b = point;
      }

    } else {
      //click on pointA
      if (pointA===point) {
        a = -1;
        b = pointB;
      } else if (pointB===point) {
        //click on pointB
        a = pointA;
        b = -1;
      } else {
        a = point;
      }
    }
    setPointA(a);
    setPointB(b);

    if (a && b) {
      clickedHandler(a,b);
    }
  };

  const colorClicked = (point) => {
    if (pointA===point || pointB===point) {
      return 'red';
    } else {
      return 'black';
    }
  };

  const calculateMidpoint = (pointA, pointB) => {
    if (pointA<0 || pointB<0) return null;

    return new THREE.Vector3(
      (pointA.x + pointB.x) / 2.0,
      (pointA.y + pointB.y) / 2.0,
      (pointA.z + pointB.z) / 2.0
    );
  };
  const renderLine = () => {
    if (pointA<0 || pointB<0) return null;
    const nodeA=points[pointA];
    const nodeB=points[pointB];
    return (
      <>
        <Line points={[nodeA, nodeB]} color="red" lineWidth={8} />
        <Html scaleFactor={10} position={calculateMidpoint(nodeA, nodeB)}>
          <div className={styles.distancePanel}>
            <p>{nodeA.distanceTo(nodeB)}</p>
          </div>
        </Html>
      </>
    );
  };
  const renderPoints = (points) => {
    return points.map((point, index) => {
      return (
        <mesh
          key={index}
          position={point}
          onClick={(e) => {
            generatePairs(index);
          }}
        >
          <sphereGeometry args={[15, 64, 16]} />
          <meshStandardMaterial color={colorClicked(index)} />
          <Html scaleFactor={10}>
            <div className={styles.label}>
              <p>{index + 1}</p>
            </div>
          </Html>
        </mesh>
      );
    });
  };

  const renderTube = (points) => {
    const curve = new THREE.CatmullRomCurve3(points, false);
    return (
      <mesh>
        <tubeGeometry args={[curve, 256, 5, 64, false]}/>
        <meshLambertMaterial color="grey"/>
      </mesh>
    );
  };

  return (
    <>
      <OrbitControls />
      <axesHelper args={[1500]} />
      <gridHelper args={[1500, 15]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={center} intensity={2.5} />

      <group ref={groupRef} position={center}>
        {renderPoints(points)}
        {renderTube(points)}
        {renderLine()}
      </group>
    </>
  );
};
export default Plot;
