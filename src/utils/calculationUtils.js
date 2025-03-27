export function calculateCentroid(points) {
  const sum = points.reduce((acc, point) => {
      return {
          x: acc.x + parseFloat(point.x),
          y: acc.y + parseFloat(point.y),
          z: acc.z + parseFloat(point.z)
      };
  }, { x: 0, y: 0, z: 0 });

  return {
      x: sum.x / points.length,
      y: sum.y / points.length,
      z: sum.z / points.length
  };
};

export function calculateRg(points) {
  const centroid = calculateCentroid(points);
  
  // Calculate sum of squared distances from centroid
  const sumSquaredDistances = points.reduce((sum, point) => {
      const dx = parseFloat(point.x) - centroid.x;
      const dy = parseFloat(point.y) - centroid.y;
      const dz = parseFloat(point.z) - centroid.z;
      
      return sum + (dx * dx + dy * dy + dz * dz);
  }, 0);
  
  // Radius of gyration is square root of mean squared distance
  return Math.sqrt(sumSquaredDistances / points.length);
};


  


