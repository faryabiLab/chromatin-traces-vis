import { useContext, useMemo } from 'react';
import { DataContext } from '../../stores/data-context';
import Plot from 'react-plotly.js';
import { calculateTraceRg } from '../../utils/calculationUtils';
import styles from './BoxPlot.module.css';
import InterpolateSwitch from '../../components/UI/InterpolateSwitch';
import {Box} from '@chakra-ui/react';

const BoxPlot = ({ data }) => {
  const dataCtx = useContext(DataContext);
  const values = useMemo(() => {
    return dataCtx.radiusOfGyrationHandler();
  }, [dataCtx.dataBys]);
  const rgValues = calculateTraceRg(data);
  const plotData = [
    {
      y: values,
      type: 'box',
      name: '',
      boxpoints: 'outliers',
      boxmean: true,
      hoverinfo: 'none',
      marker: {
        color: 'rgb(136, 132, 216)',
        outliercolor: 'rgb(255, 0, 0)',
        line: {
          outliercolor: 'rgb(255, 0, 0)',
          outlierwidth: 2,
        },
      },
      line: {
        color: 'rgb(136, 132, 216)',
      },
    },
  ];

  const layout = {
    title: 'Radius of Gyration Distribution',
    yaxis: {
      title: 'Radius of Gyration',
      zeroline: false,
    },
    showlegend: false,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4,
    },
    width: 600,
    height: 400,
    shapes: [
      {
        type: 'line',
        x0: 0,
        x1: 1,
        y0: rgValues,
        y1: rgValues,
        xref: 'paper',
        yref: 'y',
        line: {
          color: 'red',
          width: 1,
          dash: 'solid',
        },
      },
    ],
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  };

  return (
    <div className={styles.container}>
    <Box display="flex" justifyContent="flex-start" alignItems="center">
      <div
        style={{
          display: 'flex',
          direction: 'row',
          alignItems: 'center',
          gap: '16px',
          margin: '16px',
        }}
      >
        <label>Interpolate:</label>
        <InterpolateSwitch isDisabled={true}/>
      </div>
      <span className={styles.label}>
        Radius of Gyration: {calculateTraceRg(data).toFixed(2)} nm
      </span>
      </Box>
      <div className={styles.plotContainer}>
        <Plot data={plotData} layout={layout} config={config} />
      </div>
    </div>
  );
};

export default BoxPlot;
