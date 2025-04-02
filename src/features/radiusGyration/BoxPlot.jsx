import {useContext,useMemo} from 'react';
import { DataContext } from "../../stores/data-context";
import Plot from 'react-plotly.js';
import { calculateTraceRg } from '../../utils/calculationUtils';

const BoxPlot=({data})=>{
  const dataCtx=useContext(DataContext);
  const values=useMemo(()=>{
    return dataCtx.radiusOfGyrationHandler();
  },[dataCtx.dataBys]);
  const rgValues=calculateTraceRg(data);
  const plotData = [{
    y: values,
    type: 'box',
    name: 'Radius of Gyration',
    boxpoints: 'outliers',
    boxmean: true,
    marker: {
      color: 'rgb(136, 132, 216)',
      outliercolor: 'rgb(255, 0, 0)',
      line: {
        outliercolor: 'rgb(255, 0, 0)',
        outlierwidth: 2
      }
    },
    line: {
      color: 'rgb(136, 132, 216)'
    }
  }];

  const layout = {
    title: 'Radius of Gyration Distribution',
    yaxis: {
      title: 'Radius of Gyration',
      zeroline: false
    },
    showlegend: false,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    },
    width: 600,
    height: 400,
    shapes: [
      {
        type: "line",
        x0: 0, // Start of the line (x-axis)
        x1: 1, // End of the line (x-axis)
        y0: rgValues, // Value for the horizontal line (y-axis)
        y1: rgValues, // Same as y0 to make it horizontal
        xref: "paper", // Reference to the entire plot width
        yref: "y", // Reference to the y-axis
        line: {
          color: "red",
          width: 1,
          dash: "solid", // Can be 'solid', 'dot', 'dash', etc.
        },
      },
    ],
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d']
  };
  
  return (
    <div className="w-full h-96">
    <span>Radius of Gyration: {calculateTraceRg(data)}</span>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        className="w-full h-full"
      />
    </div>
  );
};

export default BoxPlot
