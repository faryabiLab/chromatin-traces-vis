export function calculateTraceRg(points) {
 
    const centroid = points.reduce((acc, point) => ({
      x: acc.x + point.pos.x,
      y: acc.y + point.pos.y,
      z: acc.z + point.pos.z
    }), { x: 0, y: 0, z: 0 });
  
    centroid.x /= points.length;
    centroid.y /= points.length;
    centroid.z /= points.length;
  
    // Calculate sum of squared distances from centroid
    const sumSquaredDistances = points.reduce((sum, point) => {
      const dx = point.pos.x - centroid.x;
      const dy = point.pos.y - centroid.y;
      const dz = point.pos.z - centroid.z;
      return sum + (dx * dx + dy * dy + dz * dz);
    }, 0);
  
    // Calculate radius of gyration
    return Math.sqrt(sumSquaredDistances / points.length);
};
  

// Helper function to calculate median of an array
export const calculateMedian = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
  ? (sorted[mid - 1] + sorted[mid]) / 2
  : sorted[mid];
};
