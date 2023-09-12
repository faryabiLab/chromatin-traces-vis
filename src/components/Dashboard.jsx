import {useEffect, useState} from 'react';
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
  return(
    <div style={{position:'absolute',top:0,right:0,width:'40%',height:'100%'}}>
    <h1>Dashboard</h1>
    <p>Clicked</p>
    {addRecord()}
    </div>
  )
}
export default Dashboard;
