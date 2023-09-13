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
    <Select placeholder='Select option' onChange={(e)=>{props.selectHandler(e.target.value)}}>
      {renderOptions(244)}
    </Select>
  
    
    </div>
  )
}
export default Dashboard;
