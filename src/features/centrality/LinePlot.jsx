import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { calculateDistancesToCenter } from '../../utils/displayUtils';
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
            left: 0,
            bottom: 20,
          }}
        >
         <Line
            type="monotone"
            dataKey="distance"
            stroke="#8884d8"
            strokeWidth={2}
            name="Distance to Center"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis 
            dataKey="readout" 
          />
          <YAxis/>
        <Tooltip/>
        </LineChart>

    </div>
  );
};

export default LinePlot;
