import { useEffect, useRef, useState, useContext } from 'react';
import { TraceContext } from '../../../stores/trace-context';
import * as THREE from 'three';
import { Html, OrbitControls, Line, GizmoHelper, GizmoViewport } from '@react-three/drei';
import styles from '../Plot.module.css';
import { useThree } from '@react-three/fiber';
import { jsPDF } from 'jspdf';
import { useControls,button } from 'leva';
const Plot = () => {
  //index of the points that are clicked
  const traceCtx = useContext(TraceContext);
  const [pointA, setPointA] = useState(-1);
  const [pointB, setPointB] = useState(-1);

  const [pointX, setPointX] = useState(-1);
  const [pointY, setPointY] = useState(-1);
  const [pointZ, setPointZ] = useState(-1);

  const groupRef = useRef();

  const data = traceCtx.data;
  const selected = traceCtx.selected;
  const clickedHandler = traceCtx.clickedHandler;
  const clicked = traceCtx.clicked;

  const triplet = traceCtx.triplet;
  const tripletHandler=traceCtx.tripletHandler;

  const { color, isGrid, tubeRadius, showDistance,sphereRadius,radius, isPerimeter } = useControls({
    color: 'red',
    isGrid:{value:true,label:'Show Grid'},
    tubeRadius: { value: 5, min: 0, max: 5, step: 0.5, label: 'Tube Size' },
    sphereRadius: { value: 15, min: 10, max: 25, step: 1, label: 'Sphere Size' },
    showDistance: {value:true,label:'Show Distance'},
    radius: { value: 200,label:'Radius(nm)' },
    isPerimeter: {value:false,label:'Perimeter Analysis'},
    reset: button(traceCtx.resetHandler),
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

  useEffect(() => {
    setPointX(triplet.a);
    setPointY(triplet.b);
    setPointZ(triplet.c);
  }, [triplet]);
  //only plot when there is data and data has at least 2 points
  if (!data || data.length < 3)
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

  const generateTriplet = (point) => {
    let x=-1,y=-1,z=-1;
    if (pointX < 0 && pointY < 0 && pointZ < 0) {
      x=point;
    } else if (pointX < 0 || pointY < 0 || pointZ < 0) {
      if (pointX < 0) {
        x=point;
        y=pointY;
        z=pointZ;
       
      } else if (pointY < 0) {
        y=point;
        x=pointX;
        z=pointZ;

      } else {
        z=point;
        x=pointX;
        y=pointY;
      }
    } else{
      if(point===pointX){
        x=-1;
        y=pointY;
        z=pointZ;
      }else if(point===pointY){
        y=-1;
        x=pointX;
        z=pointZ;
      }else if(point===pointZ){
        z=-1;
        x=pointX;
        y=pointY;
      }else{
        x=point;
      }
    }
    setPointX(x);
    setPointY(y);
    setPointZ(z);

    if(x>-1 && y>-1 && z>-1){
      tripletHandler(x,y,z);
    }
  };


  const colorPoint = (point) => {
    if(isPerimeter){
      if(pointX===-1 && pointY===-1 && pointZ===-1){
        return 'black';
      }
      //color when point is clicked
      if(pointX === point || pointY === point || pointZ === point){
        return 'green';
      }

      return 'white';
    }else{
      //default color
      if(pointA===-1 && pointB===-1){
        return 'black';
      }
      //color when point is clicked
      if (pointA === point || pointB === point) {
        return color;
      }else if (pointA === -1 || pointB === -1) {
        //if one of the points is clicked
        const existingPoint=pointA===-1?pointB:pointA;
        //check if the point is within the radius
        if(points[existingPoint].distanceTo(points[point])<radius){
          return 'black';
        }else{
        return 'white';
        }
      } else {
        return 'white';
      }
  }
  };

  const calculateMidpoint = (pointA, pointB) => {
    if (pointA < 0 || pointB < 0) return null;

    return new THREE.Vector3(
      (pointA.x + pointB.x) / 2.0,
      (pointA.y + pointB.y) / 2.0,
      (pointA.z + pointB.z) / 2.0,
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

  const renderPlane=()=>{
    if(pointX<0||pointY<0||pointZ<0){
      return null;
    }
    const nodeX=points[pointX];
    const nodeY=points[pointY];
    const nodeZ=points[pointZ];
    const perimeter=nodeX.distanceTo(nodeY)+nodeY.distanceTo(nodeZ)+nodeZ.distanceTo(nodeX);
    return (
      <>
        <Line points={[nodeX, nodeY,nodeZ,nodeX]} color='green' lineWidth={8} />
        <Html scaleFactor={10} position={calculateMidpoint(nodeX, nodeY)}>
          {showDistance && (
            <div className={styles.distancePanel}>
              <p>{perimeter.toFixed(2) + ' nm'}</p>
            </div>
          )}
        </Html>
      </>
    )
  }
  const renderPoints = (points) => {
    return points.map((point, index) => {
      return (
        <mesh
          key={index}
          position={point}
          onClick={(e) => {
            if(isPerimeter){
              generateTriplet(index);
            }else{
            generatePairs(index);
            }
          }}
        >
          <sphereGeometry args={[sphereRadius, 64, 16]} />
          <meshStandardMaterial color={colorPoint(index)} />
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
      {isGrid&&<gridHelper args={[1500, 15]} />}
      <ambientLight intensity={1.5} />
      <directionalLight position={center} intensity={2.5} />
      <group ref={groupRef} position={center}>
        {renderPoints(points)}
        {renderTube(points)}
        {isPerimeter?renderPlane():renderLine()}
      </group>
      <GizmoHelper alignment="bottom-left" margin={[150, 150]}>
        <GizmoViewport labelColor="black" axisHeadScale={1.5} />
      </GizmoHelper>
    </>
  );
};
export default Plot;
