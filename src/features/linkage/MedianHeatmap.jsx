import React, { useContext, useEffect, useState, useRef } from 'react';
import { DataContext } from '../../stores/data-context';
import * as d3 from 'd3';
import { TwitterPicker } from 'react-color';
import {
  useBoolean,
  HStack,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';

import { DownloadIcon } from '@chakra-ui/icons';
import jsPDF from 'jspdf';

import styles from './heatmap.module.css';

const MedianHeatmap = ({ width = 600, height = 600 }) => {
  const dataCtx = useContext(DataContext);
  const [medianDistanceMap, setMedianDistanceMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showColorPicker, setShowColorPicker] = useBoolean(false);
  const [color, setColor] = useState('#0693E3');
  const [colorMax, setColorMax] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  const svgRef = useRef();
  const heatmapRef = useRef();

  const toast = useToast();

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const downloadPDF = async () => {
    setIsDownloading(true);

    try {
      const svgElement = heatmapRef.current.querySelector('svg');

      if (!svgElement) {
        throw new Error('SVG element not found');
      }

      toast({
        title: 'Generating PDF...',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });

      // Serialize SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);

      // Create blob from SVG
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2; // Higher resolution
        canvas.height = height * 2;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Generate PDF
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        pdf.setFontSize(16);
        pdf.text('Median Distance Map', 20, 20);
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
        pdf.text(`Color Scale: 0 - ${colorMax} nm`, 20, 40);

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate available space for image (leaving margins and space for text)
        const availableWidth = pdfWidth - 40; // 20mm margin on each side
        const availableHeight = pdfHeight - 70; // Space for text at top and bottom margin

        // Calculate scaling to fit both width and height
        const scaleX = availableWidth / width;
        const scaleY = availableHeight / height;
        const scale = Math.min(scaleX, scaleY); // Use the smaller scale to ensure it fits

        const imgWidth = width * scale;
        const imgHeight = height * scale;

        // Center the image
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = 50; // Start after the text

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        pdf.save('median_distance_heatmap.pdf');

        URL.revokeObjectURL(svgUrl);

        toast({
          title: 'PDF Downloaded Successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      };

      img.onerror = () => {
        throw new Error('Failed to load SVG as image');
      };

      img.src = svgUrl;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error generating the PDF. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  //timer for loading
  useEffect(() => {
    let timer;
    if (loading) {
      // Reset timer when loading starts
      setLoadingTime(0);
      // Start counting
      timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    }
    
    // Cleanup timer
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  // Initial calculation of median distance
  useEffect(() => {
    if (!medianDistanceMap) {
      setLoading(true);
      setError(null);

      dataCtx
        .medianDistanceHandler()
        .then((result) => {
          setMedianDistanceMap(result);
          const maxValue = Math.max(...Object.values(result));
          setColorMax(maxValue);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  // D3 Heatmap creation
  useEffect(() => {
    if (!medianDistanceMap || !svgRef.current) return;

    try {
      //console.log('Median distance map:', medianDistanceMap);
      // Dynamically calculate matrix size from the keys
      const allNumbers = Object.keys(medianDistanceMap).flatMap((key) =>
        key.split('&').map(Number)
      );
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
        const [i, j] = key.split('&').map((n) => parseInt(n) - 1);
        matrix[i][j] = value;
        matrix[j][i] = value;
      });

      // Clear previous content
      d3.select(svgRef.current).selectAll('*').remove();

      // Set up margins
      const margin = { top: 50, right: 50, bottom: 70, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create color scale
      const colorScale = d3.scaleSequential().domain([0, colorMax]).range([color, 'white']);

      // Create SVG
      const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

      // Create main group
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // Calculate cell size
      const cellSize = Math.min(innerWidth, innerHeight) / size;

      // Create cells
      const cells = g
        .selectAll('g')
        .data(matrix)
        .enter()
        .append('g')
        .selectAll('rect')
        .data((d, i) => d.map((value, j) => ({ value, i, j })))
        .enter();

      // Add rectangles for heatmap cells
      cells
        .append('rect')
        .attr('x', (d) => d.j * cellSize)
        .attr('y', (d) => d.i * cellSize)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', (d) => colorScale(d.value))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .append('title') // Add tooltip
        .text((d) => `${d.i + 1}-${d.j + 1}: ${Math.round(d.value)}`);

      // Add text labels for values (only if cell is large enough)
      if (cellSize > 30) {
        cells
          .append('text')
          .attr('x', (d) => d.j * cellSize + cellSize / 2)
          .attr('y', (d) => d.i * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '8px')
          .attr('fill', (d) => (d.value > d3.max(matrix.flat()) / 2 ? '#fff' : '#000'))
          .text((d) => Math.round(d.value));
      }

      g.selectAll('.row-label')
        .data(matrix)
        .enter()
        .append('text')
        .attr('class', 'row-label')
        .attr('font-size', '8px')
        .attr('x', -10)
        .attr('y', (_, i) => i * cellSize + cellSize / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .text((_, i) => i + 1);

      g.selectAll('.col-label')
        .data(matrix[0])
        .enter()
        .append('text')
        .attr('class', 'col-label')
        .attr('font-size', '8px')
        .attr('x', (_, i) => i * cellSize + cellSize / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .text((_, i) => i + 1);
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
  }, [medianDistanceMap, width, height, color, colorMax]);

  if (loading) {
    return (
      <div
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          gap: '10px'
        }}
      >
        <div>Calculating median distances... ({loadingTime}s)</div>
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controlsContainer}>
     
          <label className={styles.label}>Color:</label>
          <Box
            as="button"
            borderRadius="lg"
            px={2}
            h={4}
            onClick={setShowColorPicker.toggle}
            bg={color}
          />
          {showColorPicker && (
            <div style={{ position: 'absolute', zIndex: 2, marginTop: '15%' }}>
              <TwitterPicker color={color} onChange={handleColorChange} triangle="hide" />
            </div>
          )}

          <label className={styles.label}>Color Scale Domain: 0 ~ </label>
          <NumberInput
            size="sm"
            maxW={120}
            step={50}
            min={0}
            value={Math.ceil(parseFloat(colorMax))}
            onChange={(valueString) => {
              const value = parseInt(valueString);
              if (!isNaN(value) && value >= 0) {
                setColorMax(value);
              }
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <label className={styles.label}>nm</label>
          <Button
            leftIcon={isDownloading ? <Spinner size="sm" /> : <DownloadIcon />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            isLoading={isDownloading}
            disabled={!medianDistanceMap}
            onClick={downloadPDF}
          >
            PDF
          </Button>

      </div>
      <div ref={heatmapRef} className={styles.heatmapContainer}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default MedianHeatmap;
