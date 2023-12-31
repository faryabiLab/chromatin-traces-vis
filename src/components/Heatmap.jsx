import React, { useMemo, useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { TraceContext } from '../store/trace-context';
import { TwitterPicker } from 'react-color';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  useBoolean,
} from '@chakra-ui/react';
const MARGIN = { top: 30, right: 10, bottom: 30, left: 50 };
const Heatmap = ({ data, width, height }) => {
  const [showColorPicker, setShowColorPicker] = useBoolean(false);
  const [color, setColor] = useState('#0693E3');
  const traceCtx = useContext(TraceContext);
  const clicked = traceCtx.clicked;
 
  const clickedHandler = traceCtx.clickedHandler;
  const selected = traceCtx.selected;
  const hightlightA = clicked.a + 1;
  const hightlightB = clicked.b + 1;

  const handleColorChange = (color) => {
    setColor(color.hex);
  };
  useEffect(() => {}, [selected]);
  const [min, max] = d3.extent(data.map((d) => d.value));
  const [colorMax, setColorMax] = useState(max);
  useEffect(() => {
    const max = d3.extent(data.map((d) => d.value))[1];
    setColorMax(max);
  }, [data]);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  const xScale = useMemo(() => {
    return d3.scaleBand().range([0, boundsWidth]).domain(allXGroups).padding(0.05);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3.scaleBand().range([0, boundsHeight]).domain(allYGroups).padding(0.05);
  }, [data, height]);

  // Color scale
  const colorScale = d3.scaleLinear().domain([min, colorMax]).range([color, 'white']);

  // Build the rectangles
  const allRects = data.map((d, i) => {
    const isHightlight =
      (d.x <= hightlightA && d.y === hightlightB) || (d.x === hightlightA && d.y >= hightlightB);
    return (
      <rect
        onClick={() => {
          clickedHandler(d.x - 1, d.y - 1);
        }}
        key={i}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.value)}
        rx={1}
        stroke={isHightlight ? 'orange ' : 'white'}
        strokeWidth={isHightlight ? 3 : 1}
        strokeOpacity={isHightlight ? 0.5 : 1}
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
        fontSize={name === hightlightA ? 18 : 10}
        fill={name === hightlightA ? 'red' : 'black'}
        fontWeight={name === hightlightA ? 'bold' : 'normal'}
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
        fontSize={name === hightlightB ? 18 : 10}
        fill={name === hightlightB ? 'red' : 'black'}
        fontWeight={name === hightlightB ? 'bold' : 'normal'}
      >
        {name}
      </text>
    );
  });

  return (
    <div>
      <div>
        <label>Color:</label>
        <Box
          as="button"
          borderRadius="md"
          px={4}
          h={8}
          onClick={setShowColorPicker.toggle}
          bg={color}
          margin={3}
        />
        {showColorPicker && <TwitterPicker color={color} onChange={handleColorChange} />}
      </div>
      <label>Color Scale Domain (default:0~{max})</label>
      <NumberInput
        step={50}
        defaultValue={colorMax}
        min={min}
        max={max}
        onChange={(e) => {
          setColorMax(e);
        }}
      >
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
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {allRects}
          {xLabels}
          {yLabels}
        </g>
      </svg>
      
    </div>
  );
};
export default Heatmap;
