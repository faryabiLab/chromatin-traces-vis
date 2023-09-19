  /**
   *
   * @param {THREE.Vector3} u
   * @param {THREE.Vector3} v
   * @param {number} epsilon
   * @returns true if two vectors are considered equal
   */
  export function equalVectors(u, v, epsilon = Number.EPSILON){
    if (!u || !v) return false;
    return (
      Math.abs(u.x - v.x) < epsilon &&
      Math.abs(u.y - v.y) < epsilon &&
      Math.abs(u.z - v.z) < epsilon
    );
  };
