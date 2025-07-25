
import * as d3 from 'd3';
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

export function processMetadata(obj) {
  const header = [
    'species',
    'tissue',
    'cell_type',
    'cell_line',
    'gene',
    'chromosome',
    'start_position',
    'end_position',
    'assembly',
    'genotype',
    'treatment',
    'walk_length_kb',
    'number_readout',
    'step_size_kb',
    'fov',
    'photobleach',
    'investigator',
    'lab',
    'protocol',
    'notes',
    'id',
    'process_date',
  ];

  const headerMap={
    "assembly": "Assembly",
    "cell_line": "Cell Line",
    "cell_type": "Cell Type",
    "chromosome": "Chromosome",
    "end_position": "End Position",
    "fov": "FOV",
    "gene": "Gene / locus",
    "genotype": "Genotype",
    "id": "ID",
    "investigator": "Investigator",
    "lab": "Lab",
    "notes": "Notes",
    "number_readout": "Number Readout",
    "photobleach": "Photobleach",
    "process_date": "Process Date",
    "protocol": "Protocol",
    "species": "Species",
    "start_position": "Start Position",
    "step_size_kb": "Step Size KB",
    "tissue": "Tissue",
    "treatment": "Treatment",
    "walk_length_kb": "Walk Length KB"
  }
  const processed = header
  .filter(key => obj.hasOwnProperty(key)) // Only include keys that exist in the object
  .reduce((acc, key) => {
    const mappedKey = headerMap[key] || key;
    acc[mappedKey] = obj[key];
    return acc;
  }, {});

return processed;
}

export function extractFields(dataObject) {
  // Check if dataObject exists
  if (!dataObject || typeof dataObject !== 'object') {
    return null;
  }

  return {
    cell_type: dataObject.cell_type || null,
    cell_line: dataObject.cell_line || null,
    gene: dataObject.gene || null,
    treatment: dataObject.treatment || null,
    genotype: dataObject.genotype || null,
    start_position: dataObject.start_position || null,
    end_position: dataObject.end_position || null,
    chromosome: dataObject.chromosome || null,
  };
}

export const generateRainbowColors = (numSegments) => {
  const colorStops = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF'  // Violet
  ];

  const rainbowScale = d3.scaleLinear()
    .domain(colorStops.map((_, i) => i * (numSegments - 1) / (colorStops.length - 1)))
    .range(colorStops)
    .interpolate(d3.interpolateRgb);

  return d3.range(numSegments).map(i => rainbowScale(i));
};
