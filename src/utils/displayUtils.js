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
