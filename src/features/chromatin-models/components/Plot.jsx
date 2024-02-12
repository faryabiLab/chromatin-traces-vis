import { useEffect, useRef, useState, useContext } from 'react';
import { TraceContext } from '../../../stores/trace-context';
import * as THREE from 'three';
import { Html, OrbitControls, Line, GizmoHelper, GizmoViewport } from '@react-three/drei';
import styles from '../Plot.module.css';
import { useThree } from '@react-three/fiber';
import { jsPDF } from 'jspdf';
import { useControls } from 'leva';
const Plot = () => {
  //index of the points that are clicked
  const traceCtx = useContext(TraceContext);
  const [pointA, setPointA] = useState(-1);
  const [pointB, setPointB] = useState(-1);
  const groupRef = useRef();
  const data = traceCtx.data;
  const selected = traceCtx.selected;
  const clickedHandler = traceCtx.clickedHandler;
  const clicked = traceCtx.clicked;
  const { color, tubeRadius, showDistance,sphereRadius } = useControls({
    color: 'red',
    tubeRadius: { value: 5, min: 0, max: 5, step: 0.5 },
    sphereRadius: { value: 15, min: 10, max: 25, step: 1 },
    showDistance: true,
  });

  const { gl } = useThree();
  //initialize pointA and pointB to null when selected changes
  // useEffect(() => {
  //   setPointA(-1);
  //   setPointB(-1);
  // }, [selected]);

  useEffect(() => {
    setPointA(clicked.a);
    setPointB(clicked.b);
  }, [clicked]);
  //only plot when there is data and data has at least 2 points
  if (!data || data.length < 2)
    return (
      <Html>
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-100px',
            zIndex: 1,
          }}
        >
          <p>No data</p>
        </div>
      </Html>
    );

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
    if (pointA < 0 && pointB < 0) {
      a = point;
    } else if (pointA < 0 || pointB < 0) {
      if (pointA < 0) {
        a = point;
        b = pointB;
      } else {
        a = pointA;
        b = point;
      }
    } else {
      //click on pointA
      if (pointA === point) {
        a = -1;
        b = pointB;
      } else if (pointB === point) {
        //click on pointB
        a = pointA;
        b = -1;
      } else {
        a = point;
      }
    }
    setPointA(a);
    setPointB(b);

    if (a>-1 && b>-1) {
      clickedHandler(a, b);
    }
  };

  const colorClicked = (point) => {
    if (pointA === point || pointB === point) {
      return color;
    } else if (pointA === -1 || pointB === -1) {
      return 'black';
    } else {
      return 'white';
    }
  };

  const calculateMidpoint = (pointA, pointB) => {
    if (pointA < 0 || pointB < 0) return null;

    return new THREE.Vector3(
      (pointA.x + pointB.x) / 2.0,
      (pointA.y + pointB.y) / 2.0,
      (pointA.z + pointB.z) / 2.0
    );
  };
  const renderLine = () => {
    if (pointA < 0 || pointB < 0) return null;
    const nodeA = points[pointA];
    const nodeB = points[pointB];
    return (
      <>
        <Line points={[nodeA, nodeB]} color={color} lineWidth={8} />
        <Html scaleFactor={10} position={calculateMidpoint(nodeA, nodeB)}>
          {showDistance && (
            <div className={styles.distancePanel}>
              <p>{nodeA.distanceTo(nodeB).toFixed(2) + ' nm'}</p>
            </div>
          )}
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
          <sphereGeometry args={[sphereRadius, 64, 16]} />
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

  const tubeColor = () => {
    if (pointA === -1 || pointB === -1) {
      return 'gray';
    } else {
      return 'white';
    }
  };
  const renderTube = (points) => {
    const curve = new THREE.CatmullRomCurve3(points, false);
    return (
      <mesh>
        <tubeGeometry args={[curve, 256, tubeRadius, 64, false]} />
        <meshLambertMaterial color={tubeColor()} />
      </mesh>
    );
  };

  const saveAsImage = () => {
    try {
      const strName = 'image/jpeg';
      const imgData = gl.domElement.toDataURL(strName);
      const strDownloadName = 'image/octet-stream';
      const pdf = new jsPDF();
      pdf.addImage(imgData.replace(strName, strDownloadName), 'JPEG', 5, 5, 200, 200);
      pdf.save('fov-' + selected.fov + '-s-' + selected.s + '-' + 'image.pdf');
    } catch (e) {
      console.log(e);
      return;
    }
  };

  return (
    <>
      <Html>
        <div
          style={{
            position: 'absolute',
            top: '-450px',
            left: '-450px',
            zIndex: 1,
          }}
        >
          <button onClick={saveAsImage} className={styles.saveBtn}>
            Download PDF
          </button>
        </div>
      </Html>
      <OrbitControls makeDefault />
      <axesHelper args={[1500]} />
      <gridHelper args={[1500, 15]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={center} intensity={2.5} />
      <group ref={groupRef} position={center}>
        {renderPoints(points)}
        {renderTube(points)}
        {renderLine()}
      </group>
      <GizmoHelper alignment="bottom-left" margin={[150, 150]}>
        <GizmoViewport labelColor="black" axisHeadScale={1.5} />
      </GizmoHelper>
    </>
  );
};
export default Plot;
