import { Select } from '@chakra-ui/react'
import {useMemo} from 'react';
import Heatmap from './Heatmap';
const Dashboard = (props) => {

  const renderOptions=(number)=>{
    let options=[];
    for(let i=0;i<number;i++){
      options.push(<option value={i+1} key={i}>{i+1}</option>);
    }
    return options;
  }
  const generatePairwiseDistanceMap=()=>{
    let map=[];
    for(let i=0;i<props.data.length;i++){
      for(let j=0;j<props.data.length;j++){
        const dist=Math.sqrt(Math.pow(props.data[i].pos.x-props.data[j].pos.x,2)+Math.pow(props.data[i].pos.y-props.data[j].pos.y,2)+Math.pow(props.data[i].pos.z-props.data[j].pos.z,2));
        map.push({x:i+1,y:j+1,value:dist});
      }
    }
    return map;
  }

  const distanceMap=useMemo(()=>generatePairwiseDistanceMap(),[props.data]);

  return(
    <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%'}}>
    <h1>Dashboard</h1>
    <Select placeholder='Select fov' onChange={(e)=>{props.fovHandler(e.target.value)}}>
      {renderOptions(20)}
    </Select>
    <Select placeholder='Select s' onChange={(e)=>{props.selectHandler(e.target.value)}}>
      {renderOptions(300)}
    </Select>
    <Heatmap data={distanceMap} width={800} height={800}/>
    
    </div>
  )
}
export default Dashboard;
