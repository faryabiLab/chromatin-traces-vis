
const dataFilling=(prev,cur)=>{
  let fillingArray=[];
  const n=(cur.readout-prev.readout)-1;
  const stepX=(cur.pos.x-prev.pos.x)/(n+1);
  const stepY=(cur.pos.y-prev.pos.y)/(n+1);
  const stepZ=(cur.pos.z-prev.pos.z)/(n+1);
  for(let i=1;i<=n;i++){
      fillingArray.push({
          readout:prev.readout+i,
          pos:{'x':prev.pos.x+stepX*i,'y':prev.pos.y+stepY*i,'z':prev.pos.z+stepZ*i},
          filling:true,
      })
  }
  return fillingArray;
};

const headHandler=(first,second)=>{
  if(!first||!second){return []}
  let fillingArray = [];
  const n = first.readout - 1; // number of missing points at head
  if (n <= 0) return fillingArray;
  
  // Calculate steps backwards
  const stepX = (first.pos.x - second.pos.x) / (second.readout - first.readout);
  const stepY = (first.pos.y - second.pos.y) / (second.readout - first.readout);
  const stepZ = (first.pos.z - second.pos.z) / (second.readout - first.readout);
  
  // Generate points from 1 to first.readout-1
  for (let i = n; i > 0; i--) {
      fillingArray.push({
          readout: i,
          pos: {
              'x': first.pos.x - stepX * (i - first.readout),
              'y': first.pos.y - stepY * (i - first.readout),
              'z': first.pos.z - stepZ * (i - first.readout)
          },
          filling: true,
      });
  }
  
  return fillingArray.sort((a, b) => a.readout - b.readout);
};

const tailHandler=(last,secondLast,totalReadouts)=>{
if(!last||!secondLast){return []}
  let fillingArray = [];
  const n = totalReadouts - last.readout; // number of missing points at tail
  if (n <= 0) return fillingArray;
  
  // Calculate steps forward
  const stepX = (last.pos.x - secondLast.pos.x) / (last.readout - secondLast.readout);
  const stepY = (last.pos.y - secondLast.pos.y) / (last.readout - secondLast.readout);
  const stepZ = (last.pos.z - secondLast.pos.z) / (last.readout - secondLast.readout);
  
  // Generate points from last.readout+1 to totalReadouts
  for (let i = 1; i <= n; i++) {
      fillingArray.push({
          readout: last.readout + i,
          pos: {
              'x': last.pos.x + stepX * i,
              'y': last.pos.y + stepY * i,
              'z': last.pos.z + stepZ * i
          },
          filling: true,
      });
  }
  
  return fillingArray;
};

export const dataProcess=(data,totalReadouts,interpolate=true)=>{
  if(!data){return null}
  let result=[];
  for(let i=0;i<data.length;i++){
      const row=data[i];
      const readout=+row.readout;
      if(readout<=totalReadouts){
      result.push({
          readout:readout,
          pos:{'x':+row.x,'y':+row.y,'z':+row.z},
          filling:false,
      })
    }
  }

  if(result.length===0){return null}

  result.sort((a, b) => a.readout - b.readout);
  
  if(!interpolate){return result}
  
  // Handle missing head
  if (result[0].readout > 1) {
      const headFilling = headHandler(result[0], result[1]);
      result = [...headFilling, ...result];
  }
  
  // Handle missing middle points
  for (let i = 1; i < result.length; i++) {
      if (result[i].readout - result[i-1].readout > 1) {
          result.splice(i, 0, ...dataFilling(result[i-1], result[i]));
      }
  }
  
  // Handle missing tail
  if (result[result.length - 1].readout < totalReadouts) {
      const tailFilling = tailHandler(
          result[result.length - 1], 
          result[result.length - 2], 
          totalReadouts
      );
      result = [...result, ...tailFilling];
  }


  
  return result;
};

export const sampleAllele=(data,sampleSize=20000,setIsSampled)=>{
    if (data.length <= sampleSize) {
        return data;
    }
    setIsSampled(true);
    // Fisher-Yates (Knuth) shuffle algorithm with early termination
    const result = [...data];
    for (let i = 0; i < sampleSize; i++) {
        const j = i + Math.floor(Math.random() * (result.length - i));
        [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result.slice(0, sampleSize);
}


