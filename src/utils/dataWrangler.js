
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
      })
    }
    // if(n>1){
    //   console.log('filling',prev,cur,fillingArray)
    // }
    return fillingArray;
}

export function dataProcess(data,plotAll) {
  if(!data){return null}
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

  for(let i=1;i<result.length;i++){
    if(result[i].readout-result[i-1].readout>step){
      result.splice(i,0,...dataFilling(result[i-1],result[i],step));
    }
  }

  return result;
  
};
