/**
* 
* @param data [{readout:number,pos:{x:number,y:number,z:number}}}}] 
* @returns map [{x:number,y:number,value:number}]
*/
export function generatePairwiseDistanceMap(data) {
 if (!data || data.length === 0) return null;
 let map = [];
 for (let i = 0; i < data.length; i++) {
   for (let j = 0; j < data.length; j++) {
     const dist = calculatePairDistance(data[i], data[j]);
     map.push({ x: i + 1, y: j + 1, value: dist });
   }
 }
 return map; 
};  

export function refreshPage() {
  window.location.reload(false);
}

export function calculatePairDistance(a, b) {
  return Math.sqrt(
    Math.pow(a.pos.x - b.pos.x, 2) +
      Math.pow(a.pos.y - b.pos.y, 2) +
      Math.pow(a.pos.z - b.pos.z, 2)
  );
}

export function calculateDistancesToCenter(points) {
  // Calculate geometric center
  const center = {
      x: 0,
      y: 0,
      z: 0
  };
  
  points.forEach(point => {
      center.x += point.pos.x;
      center.y += point.pos.y;
      center.z += point.pos.z;
  });
  
  center.x /= points.length;
  center.y /= points.length;
  center.z /= points.length;
  
  return points.map(point => {
    const dx = point.pos.x - center.x;
    const dy = point.pos.y - center.y;
    const dz = point.pos.z - center.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    return {
      readout: point.readout,
      distance: Number(distance.toFixed(2))
    };
  });
 
}


export const getFilledReadouts = (data) => {
    return data
        .filter(item => item.filling === true)
        .map(item => item.readout);
};
