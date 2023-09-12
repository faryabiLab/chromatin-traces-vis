import {useEffect, useState} from 'react';
import { Select } from '@chakra-ui/react'
const Dashboard = (props) => {
  const [record,setRecord]=useState([]);
  useEffect(()=>{
    setRecord([...record,props.clicked]);
  },[props.clicked]);
  const addRecord=()=>{
    return(
      <ul>
      {record.map((item,index)=>{
        return(
          <li key={index}>Clicked: x:{item[0]}, y:{item[1]}, z:{item[2]}</li>
        )
      })}
      </ul>
    )
  }

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
    {addRecord()}
    
    </div>
  )
}
export default Dashboard;
