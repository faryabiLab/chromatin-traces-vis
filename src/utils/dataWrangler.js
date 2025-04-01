
const dataFilling=(prev,cur,step)=>{
  //handle missing in readout
    let fillingArray=[];
    const n=(cur.readout-prev.readout)/step-1;
    const stepX=(cur.pos.x-prev.pos.x)/(n+1);
    const stepY=(cur.pos.y-prev.pos.y)/(n+1);
    const stepZ=(cur.pos.z-prev.pos.z)/(n+1);
    for(let i=1;i<=n;i++){
      fillingArray.push({
        readout:prev.readout+i*step,
        pos:{'x':prev.pos.x+stepX*i,'y':prev.pos.y+stepY*i,'z':prev.pos.z+stepZ*i},
        filling:true,
      })
    }
    return fillingArray;
}

export function dataProcess(data,plotAll,isFilling,totalReadouts) {
  if(!data){return null}
  console.log(data);
  let result=[];
  const step=plotAll?1:2;
  for(let i=0;i<data.length;i++){
    const row=data[i];
   
    //only plot odd readout
    if(plotAll||(+row.readout)%2!==0){
      result.push({
        readout:+row.readout,
        pos:{'x':+row.x,'y':+row.y,'z':+row.z},
      })
    }
  }
  if(!isFilling){
    return result;
  }

  for(let i=1;i<result.length;i++){
    if(result[i].readout-result[i-1].readout>step){
      result.splice(i,0,...dataFilling(result[i-1],result[i],step));
    }
  }

  return result;
  
};

const dataFillingDefault=(prev,cur)=>{
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

export const dataProcessDefault=(data,totalReadouts)=>{
  if(!data){return null}
  let result=[];
  for(let i=0;i<data.length;i++){
      const row=data[i];
      result.push({
          readout:+row.readout,
          pos:{'x':+row.x,'y':+row.y,'z':+row.z},
          filling:false,
      })
  }

  result.sort((a, b) => a.readout - b.readout);
  
  // Handle missing head
  if (result[0].readout > 1) {
      const headFilling = headHandler(result[0], result[1]);
      result = [...headFilling, ...result];
  }
  
  // Handle missing middle points
  for (let i = 1; i < result.length; i++) {
      if (result[i].readout - result[i-1].readout > 1) {
          result.splice(i, 0, ...dataFillingDefault(result[i-1], result[i]));
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




