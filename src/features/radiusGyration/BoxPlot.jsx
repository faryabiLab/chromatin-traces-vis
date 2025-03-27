import {useContext,useMemo} from 'react';
import { DataContext } from "../../stores/data-context";
import Plot from 'react-plotly.js';
import { calculateTraceRg } from '../../utils/calculationUtils';

const BoxPlot=({data})=>{
  const dataCtx=useContext(DataContext);
  const values=useMemo(()=>{
    return dataCtx.radiusOfGyrationHandler();
  },[dataCtx.dataBys]);

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
    height: 400
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
