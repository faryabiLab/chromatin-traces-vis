import React, { useMemo,useState,useEffect,useContext } from 'react';
import * as d3 from 'd3';
import { TraceContext } from '../store/trace-context';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 };
const Heatmap = ({data,width,height}) => {
  const traceCtx=useContext(TraceContext);
  const clicked=traceCtx.clicked;
 
  const selected=traceCtx.selected; 
  const hightlightA=clicked.a+1;
  const hightlightB=clicked.b+1;
  useEffect(()=>{
    
  },[selected])
  const [min, max] = d3.extent(data.map((d) => d.value));
  const [colorMax,setColorMax] = useState(max);
  useEffect(()=>{
    const max = d3.extent(data.map((d) => d.value))[1];
    setColorMax(max);
  },[data])
  
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);
  
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0,boundsHeight])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, height]);

  
 

  // Color scale
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([min, colorMax]);

    // Build the rectangles
  const allRects = data.map((d, i) => {
    return (
      <rect onClick={()=>{console.log(d.x-1,d.y-1)}}
        key={i}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()*0.95}
        height={yScale.bandwidth()*0.95}
        opacity={1}
        fill={colorScale(d.value)}
        rx={4}
        stroke={"white"}
      />
    );
  });
  const xLabels = allXGroups.map((name, i) => {
    const xPos = xScale(name) ?? 0;
    return (
      <text
        key={i}
        x={xPos + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name) ?? 0;
    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  return (
        <div>
        <label>Color Scale Domain (default:0~{max})</label>
        <NumberInput step={50} defaultValue={colorMax} min={min} max={max*2} onChange={(e)=>{setColorMax(e)}}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
            <svg width={width} height={height}>
            <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allRects}
          {xLabels}
          {yLabels}
        </g>
            </svg>
        </div>
    )
}
export default Heatmap
