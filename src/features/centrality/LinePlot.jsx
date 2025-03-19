import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { calculateDistancesToCenter } from '../../utils/displayUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <p>{`Readout: ${label}`}</p>
        <p>{ `Distance: ${payload[0].value} nm`}</p>
      </div>
    );
  }

  return null;
};

const LinePlot = ({data}) => {
  const distances = calculateDistancesToCenter(data);
  console.log(distances);
  return (
    <div>
        <LineChart
          data={distances}
          width={700}
          height={400}
          margin={{
            top: 30,
            right: 30,
            left: 15,
            bottom: 20,
          }}
        >
         <Line
            type="monotone"
            dataKey="distance"
            stroke="#8884d8"
            strokeWidth={2}
            name="Distance (nm)"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis 
            dataKey="readout" 
            label={{ 
              value: 'ORCA Readout', 
              position: 'bottom',
              
            }}
          />
          <YAxis 
          label={{ 
              value: 'Distance to Geometric Center (nm)', 
              angle: -90, 
              position: 'insideLeft',
              textAnchor: 'middle',
              dy:150,
              dx:-10,
            }}/>
        <Tooltip content={<CustomTooltip />}/>
        </LineChart>

    </div>
  );
};

export default LinePlot;
