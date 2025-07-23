import { useEffect, useRef, useState, useContext } from 'react';
import { TraceContext } from '../../../stores/trace-context';
import * as THREE from 'three';
import { Html, OrbitControls, Line, GizmoHelper, GizmoViewport } from '@react-three/drei';
import styles from '../Plot.module.css';
import { useThree } from '@react-three/fiber';
import { jsPDF } from 'jspdf';
import { useControls, button, levaStore } from 'leva';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer';
import { svg2pdf } from 'svg2pdf.js';
import { generateRainbowColors } from '../../../utils/displayUtils';
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

  // mode = 1 for radius, 2 for linkage, 3 for perimeter
  const isPerimeter = traceCtx.mode === '3' ? true : false;
  const isRadius = traceCtx.mode === '1' ? true : false;
  const isLinkage = traceCtx.mode === '2' ? true : false;

  //color scale
  const rainbowColors = generateRainbowColors(data.length);

  //linkage
  const clickedHandler = traceCtx.clickedHandler;
  const clicked = traceCtx.clicked;

  //radius
  const currentHandler = traceCtx.currentHandler;
  const radius = traceCtx.radius;
  const current = traceCtx.current;

  //perimeter
  const triplet = traceCtx.triplet;
  const tripletHandler = traceCtx.tripletHandler;

  const { color, isGrid, tubeRadius, showDistance, sphereRadius } = useControls({
    color: 'red',
    isGrid: { value: true, label: 'Grid & Axis' },
    tubeRadius: { value: 3, min: 0, max: 5, step: 0.5, label: 'Line Size' },
    sphereRadius: { value: 15, min: 5, max: 25, step: 1, label: 'Dot Size' },
    showDistance: { value: true, label: 'Show Distance' },
    reset: button(traceCtx.resetHandler),
  });

  const { gl } = useThree();
  const { scene, camera } = useThree();
  //initialize pointA and pointB to null when selected changes
  // useEffect(() => {
  //   setPointA(-1);
  //   setPointB(-1);
  // }, [selected]);

  useEffect(() => {
    //check if clicked point exist in this allele
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

  function calculateGeometricCenter(points) {
    // Create a new Vector3 to store the center
    const center = new THREE.Vector3();

    // If no points, return zero vector
    if (points.length === 0) return center;

    // Add all points together
    points.forEach((point) => {
      center.add(point);
    });

    // Divide by the number of points
    center.divideScalar(points.length);

    return center;
  }

  //convert data to list of THREE.Vector3
  let points = [];
  let interpolatedPoints = [];
  for (const [index,row] of data.entries()) {
    let point = new THREE.Vector3(row.pos.x, row.pos.y, row.pos.z);
    points.push(point);
    //store the index of the interpolated points
    if(row.filling) interpolatedPoints.push(index);
  }
  

  //calculate geometric center and set the model origin
  let center = calculateGeometricCenter(points);
  //calculate max distance
  let maxDistance = 0;
  points.forEach((point) => {
    const distance = point.distanceTo(center);
    if (distance > maxDistance) {
      maxDistance = distance;
    }
  });
  center = center.multiplyScalar(-1);

  //calculate grid size and round to the next 100
  const roundedGridSize = Math.ceil((maxDistance * 2) / 100) * 100;

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

    if (a > -1 && b > -1) {
      clickedHandler(a, b);
    }
  };

  const generateTriplet = (point) => {
    let x = -1,
      y = -1,
      z = -1;
    if (pointX < 0 && pointY < 0 && pointZ < 0) {
      x = point;
    } else if (pointX < 0 || pointY < 0 || pointZ < 0) {
      if (pointX < 0) {
        x = point;
        y = pointY;
        z = pointZ;
      } else if (pointY < 0) {
        y = point;
        x = pointX;
        z = pointZ;
      } else {
        z = point;
        x = pointX;
        y = pointY;
      }
    } else {
      if (point === pointX) {
        x = -1;
        y = pointY;
        z = pointZ;
      } else if (point === pointY) {
        y = -1;
        x = pointX;
        z = pointZ;
      } else if (point === pointZ) {
        z = -1;
        x = pointX;
        y = pointY;
      } else {
        x = point;
      }
    }
    setPointX(x);
    setPointY(y);
    setPointZ(z);

    if (x > -1 && y > -1 && z > -1) {
      tripletHandler(x, y, z);
    }
  };
  const defaultColor=(point)=>{
    if(interpolatedPoints.includes(point)){
      return 'white';
    }else{
      return rainbowColors[point];
    }
  }

  //point is the index of the point in the points array
  const colorPoint = (point) => {
    if (isPerimeter) {
      if (pointX === -1 && pointY === -1 && pointZ === -1) {
        return defaultColor(point);
      }
      //color when point is clicked
      if (pointX === point || pointY === point || pointZ === point) {
        return color;
      }

      return 'white';
    }else if(isRadius){  
      //check if the point is within the radius
      if(current === -1) return defaultColor(point);
      if(point === current) return color;
      if (points[current].distanceTo(points[point]) < radius) {
        return 'black';
      } else {
        return 'white';
      }
      
    } else {
      //default color
      if (pointA === -1 && pointB === -1) {
        return defaultColor(point);
      }
      //color when point is clicked
      if (pointA === point || pointB === point) {
        return color;
      }  else {
        return 'white';
      }
    }
  };

  const calculateMidpoint = (pointA, pointB) => {
    if (pointA < 0 || pointB < 0) return null;
    if (pointA === undefined || pointB === undefined) return null;
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
    if (nodeA === undefined || nodeB === undefined) return null;
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

  const renderPlane = () => {
    if (pointX < 0 || pointY < 0 || pointZ < 0) {
      return null;
    }
    const nodeX = points[pointX];
    const nodeY = points[pointY];
    const nodeZ = points[pointZ];
    if (nodeX === undefined || nodeY === undefined || nodeZ === undefined) {
      return null;
    }
    const perimeter = nodeX.distanceTo(nodeY) + nodeY.distanceTo(nodeZ) + nodeZ.distanceTo(nodeX);
    return (
      <>
        <Line points={[nodeX, nodeY, nodeZ, nodeX]} color={color} lineWidth={8} />
        <Html scaleFactor={10} position={calculateMidpoint(nodeX, nodeY)}>
          {showDistance && (
            <div className={styles.distancePanel}>
              <p>{perimeter.toFixed(2) + ' nm'}</p>
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
            if (isPerimeter) {
              generateTriplet(index);
            } else if (isRadius) {
              currentHandler(index);
            } else {
              generatePairs(index);
            }
          }}
        >
          <sphereGeometry args={[sphereRadius, 64, 48]} />
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

  const renderGeometricCenter = (points) => {
    return (
      <mesh
        key={0}
        position={calculateGeometricCenter(points)}
      >
        <sphereGeometry args={[sphereRadius * 2, 64, 16]} />
        <meshStandardMaterial color={'orange'} />
      </mesh>
    );
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
      const strName = 'image/png';
      const imgData = gl.domElement.toDataURL(strName);
      const strDownloadName = 'image/octet-stream';
      const pdf = new jsPDF();
      // Get page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      // Calculate image dimensions maintaining aspect ratio
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (imageWidth * gl.domElement.height) / gl.domElement.width;
      pdf.addImage(
        imgData.replace(strName, strDownloadName),
        'PNG',
        margin,
        margin,
        imageWidth,
        imageHeight
      );
      pdf.save('fov-' + selected.fov + '-s-' + selected.s + '-' + 'image.pdf');
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const saveAsVectorPDF = async () => {
    try {
      // Create SVG renderer
      const svgRenderer = new SVGRenderer();
      svgRenderer.setSize(595.28, 841.89);

      // Render the scene
      svgRenderer.render(scene, camera);

      // Get the SVG element
      const svgElement = svgRenderer.domElement;

      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', // points
        format: [595.28, 841.89],
        compress: true,
        precision: 1,
      });

      // Convert SVG to PDF while maintaining vector quality
      await svg2pdf(svgElement, pdf, {
        xOffset: 0,
        yOffset: 0,
        scale: 1,
      });

      // Save the PDF
      pdf.save(`fov-${selected.fov}-s-${selected.s}-vector.pdf`);
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
          <button onClick={saveAsVectorPDF} className={styles.saveBtn}>
            Download PDF
          </button>
        </div>
      </Html>
      <OrbitControls makeDefault />
      {isGrid && <axesHelper args={[roundedGridSize]} />}
      {isGrid && (
        <gridHelper
          args={[roundedGridSize, roundedGridSize / 100]}
          rotation={[0, Math.PI / 2, Math.PI / 2]}
        />
      )}
      <Html position={[roundedGridSize / 2, 0, 0]}>
        <div style={{ color: 'red', fontSize: '16px' }}>+X: {roundedGridSize / 2}nm</div>
      </Html>
      <Html position={[-roundedGridSize / 2, 0, 0]}>
        <div style={{ color: 'red', fontSize: '16px' }}>-X</div>
      </Html>
      <Html position={[0, roundedGridSize / 2, 0]}>
        <div style={{ color: 'green', fontSize: '16px' }}>+Y:{roundedGridSize / 2}nm</div>
      </Html>
      <Html position={[0, -roundedGridSize / 2, 0]}>
        <div style={{ color: 'green', fontSize: '16px' }}>-Y</div>
      </Html>
      <Html position={[0, 0, roundedGridSize / 2]}>
        <div style={{ color: 'blue', fontSize: '16px' }}>+Z: {roundedGridSize / 2}nm</div>
      </Html>
      <Html position={[0, 0, -roundedGridSize / 2]}>
        <div style={{ color: 'blue', fontSize: '16px' }}>-Z</div>
      </Html>
      <ambientLight intensity={1.5} />
      <directionalLight position={center} intensity={2.5} />
      <group ref={groupRef} position={center}>
        {renderGeometricCenter(points)}
        {renderPoints(points)}
        {renderTube(points)}
        {isPerimeter ? renderPlane() : renderLine()}
      </group>
      <GizmoHelper alignment="bottom-left" margin={[150, 150]}>
        <group rotation={[-Math.PI / 2, Math.PI, Math.PI / 2]}>
          <GizmoViewport labelColor="black" axisHeadScale={1.5} />
        </group>
      </GizmoHelper>
    </>
  );
};
export default Plot;
