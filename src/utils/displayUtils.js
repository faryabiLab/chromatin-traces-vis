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
     const dist = Math.sqrt(
       Math.pow(data[i].pos.x - data[j].pos.x, 2) +
         Math.pow(data[i].pos.y - data[j].pos.y, 2) +
         Math.pow(data[i].pos.z - data[j].pos.z, 2)
     );
     map.push({ x: i + 1, y: j + 1, value: dist });
   }
 }
 return map; 
};  
