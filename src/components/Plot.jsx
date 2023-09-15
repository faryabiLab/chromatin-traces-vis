import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Html, OrbitControls, Line } from '@react-three/drei';
import '../style.css';

const Plot = (props) => {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const groupRef = useRef();

  //initialize pointA and pointB to null when selected changes
  useEffect(() => {
    setPointA(null);
    setPointB(null);
  }, [props.selected]);

  const data = props.data;
  if (!data || data.length === 0) return null;

  const colorPalette = [
    '#C10C0C',
    '#D12509',
    '#D85E0B',
    '#D8800B',
    '#D8B00B',
    '#D8D20B',
    '#B0D80B',
    '#8ACC0A',
    '#58BF16',
    '#3CB708',
    '#0CC10C',
    '#0DC927',
    '#09CC58',
    '#16D67F',
    '#1BCEAC',
    '#0AC4BB',
    '#0BB1D8',
    '#0B8FD8',
    '#0B5FD8',
    '#0B3CD8',
    '#0B0BD8',
    '#1C0AC4',
    '#440BB2',
    '#680CC1',
    '#7E0BD8',
    '#A00CC4',
    '#BA08A1',
    '#CC0E92',
    '#D3189E',
    '#E227A8',
  ];
  const colors = [];
  for (let c of colorPalette) {
    colors.push(new THREE.Color(c));
  }

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

  /**
   *
   * @param {THREE.Vector3} u
   * @param {THREE.Vector3} v
   * @param {number} epsilon
   * @returns true if two vectors are considered equal
   */
  const equalVectors = (u, v, epsilon = Number.EPSILON) => {
    if (!u || !v) return false;
    return (
      Math.abs(u.x - v.x) < epsilon &&
      Math.abs(u.y - v.y) < epsilon &&
      Math.abs(u.z - v.z) < epsilon
    );
  };

  //check if pair is valid
  const generatePairs = (point) => {
    let a = null,
      b = null;
    if (!pointA && !pointB) {
      a = point;
    } else if (!pointA || !pointB) {
      if (!pointA) {
        a = point;
        b = pointB;
      } else {
        a = pointA;
        b = point;
      }
      // props.clickHandler(pair);
    } else {
      //click on pointA
      if (equalVectors(pointA, point)) {
        a = null;
        b = pointB;
      } else if (equalVectors(pointB, point)) {
        //click on pointB
        a = pointA;
        b = null;
      } else {
        a = point;
      }
    }
    setPointA(a);
    setPointB(b);

    if (a && b) {
      props.clickHandler(a, b);
    }
  };

  const colorClicked = (point) => {
    if (equalVectors(pointA, point) || equalVectors(pointB, point)) {
      return 'red';
    } else {
      return 'black';
    }
  };

  const calculateMidpoint = (pointA, pointB) => {
    if (!pointA || !pointB) return null;
    return new THREE.Vector3(
      (pointA.x + pointB.x) / 2.0,
      (pointA.y + pointB.y) / 2.0,
      (pointA.z + pointB.z) / 2.0
    );
  };
  const renderLine = () => {
    if (!pointA || !pointB) return null;
    return (
      <>
        <Line points={[pointA, pointB]} color="red" lineWidth={8} />
        <Html scaleFactor={10} position={calculateMidpoint(pointA, pointB)}>
          <div className="distance-panel">
            <p>{pointA.distanceTo(pointB)}</p>
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
            generatePairs(point);
          }}
        >
          <sphereGeometry args={[15, 64, 16]} />
          <meshStandardMaterial color={colorClicked(point)} />
          <Html scaleFactor={10}>
            <div className="label">
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
