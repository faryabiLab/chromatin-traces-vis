import React, { useContext, useEffect, useState, useRef } from 'react';
import { DataContext } from '../../stores/data-context';
import * as d3 from 'd3';

const MedianHeatmap = ({ width = 600, height = 600}) => {
  const dataCtx = useContext(DataContext);
  const [medianDistanceMap, setMedianDistanceMap] = useState(null);
  const svgRef = useRef();

  // Initial calculation of median distance
  useEffect(() => {
    if (!medianDistanceMap) {
      const result = dataCtx.medianDistanceHandler();
      setMedianDistanceMap(result);
    }
  }, []);

  // D3 Heatmap creation
  useEffect(() => {
    if (!medianDistanceMap || !svgRef.current) return;
    
    try {
      console.log('Median distance map:', medianDistanceMap);
      // Dynamically calculate matrix size from the keys
      const allNumbers = Object.keys(medianDistanceMap)
        .flatMap(key => key.split('&').map(Number));
      const size = Math.max(...allNumbers);

      // Initialize matrix with zeros
      let matrix = [];
      for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
          matrix[i][j] = 0;
        }
      }
    
    Object.entries(medianDistanceMap).forEach(([key, value]) => {
      const [i, j] = key.split('&').map(n => parseInt(n) - 1);
      matrix[i][j] = value;
      matrix[j][i] = value;
    });

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up margins
    const margin = { top: 50, right: 50, bottom: 70, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create color scale
    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(matrix.flat())])
      .interpolator(d3.interpolateViridis);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate cell size
    const cellSize = Math.min(innerWidth, innerHeight) / size;

    // Create cells
    const cells = g.selectAll('g')
      .data(matrix)
      .enter()
      .append('g')
      .selectAll('rect')
      .data((d, i) => d.map((value, j) => ({ value, i, j })))
      .enter();

    // Add rectangles for heatmap cells
    cells.append('rect')
      .attr('x', d => d.j * cellSize)
      .attr('y', d => d.i * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .append('title') // Add tooltip
      .text(d => `${d.i + 1}-${d.j + 1}: ${Math.round(d.value)}`);

    // Add text labels for values (only if cell is large enough)
    if (cellSize > 30) {
      cells.append('text')
        .attr('x', d => d.j * cellSize + cellSize / 2)
        .attr('y', d => d.i * cellSize + cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '8px')
        .attr('fill', d => d.value > d3.max(matrix.flat()) / 2 ? '#fff' : '#000')
        .text(d => Math.round(d.value));
    }

    // Add row labels (1-15)
    g.selectAll('.row-label')
      .data(matrix)
      .enter()
      .append('text')
      .attr('class', 'row-label')
      .attr('x', -10)
      .attr('y', (_, i) => i * cellSize + cellSize / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .text((_, i) => i + 1);

    // Add column labels (1-15)
    g.selectAll('.col-label')
      .data(matrix[0])
      .enter()
      .append('text')
      .attr('class', 'col-label')
      .attr('x', (_, i) => i * cellSize + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .text((_, i) => i + 1);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Median Distance Heatmap');

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 20;
    
    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(matrix.flat())])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d3.format('.0f'));

    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left},${height - margin.bottom + 20})`);

    // Create gradient for legend
    const gradientData = d3.range(0, legendWidth);
    
    legend.selectAll('rect')
      .data(gradientData)
      .enter()
      .append('rect')
      .attr('x', d => d)
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', legendHeight)
      .attr('fill', d => colorScale(d * d3.max(matrix.flat()) / legendWidth));

    // Add legend axis
    legend.append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis);
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }

  }, [medianDistanceMap, width, height]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default MedianHeatmap;
