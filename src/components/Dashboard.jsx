import { Select } from '@chakra-ui/react'
const Dashboard = (props) => {
  
  const renderOptions=(number)=>{
    let options=[];
    for(let i=0;i<number;i++){
      options.push(<option value={i+1} key={i}>{i+1}</option>);
    }
    return options;
  }


  return(
    <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%'}}>
    <h1>Dashboard</h1>
    <Select placeholder='Select fov' onChange={(e)=>{props.fovHandler(e.target.value)}}>
      {renderOptions(20)}
    </Select>
    <Select placeholder='Select s' onChange={(e)=>{props.selectHandler(e.target.value)}}>
      {renderOptions(300)}
    </Select>
    
    
    </div>
  )
}
export default Dashboard;
