import React, { useMemo, useState, useEffect, useContext,useRef } from 'react';
import * as d3 from 'd3';
import { TraceContext } from '../../stores/trace-context';
import { TwitterPicker } from 'react-color';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  useBoolean,
  HStack,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getFilledReadouts } from '../../utils/displayUtils';

const MARGIN = { top: 10, right: 10, bottom: 40, left: 50 };
const Heatmap = ({ data, width, height }) => {
  const [showColorPicker, setShowColorPicker] = useBoolean(false);
  const [color, setColor] = useState('#0693E3');
  const [isDownloading, setIsDownloading] = useState(false);
  const heatmapRef = useRef();
  const toast = useToast();

  const traceCtx = useContext(TraceContext);
  const clicked = traceCtx.clicked;

  const clickedHandler = traceCtx.clickedHandler;

  const hightlightA = clicked.a + 1;
  const hightlightB = clicked.b + 1;
  const imputed=getFilledReadouts(traceCtx.data);

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const [min, max] = d3.extent(data.map((d) => d.value));
  const [colorMax, setColorMax] = useState(max);

  // useEffect(() => {
  //   const max = d3.extent(data.map((d) => d.value))[1];
  //   setColorMax(max);
  // }, [data]);

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

  const downloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const heatmapElement = heatmapRef.current;
      
      if (!heatmapElement) {
        throw new Error('Heatmap element not found');
      }
  
      toast({
        title: 'Generating PDF...',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
  
      const canvas = await html2canvas(heatmapElement, {
        backgroundColor: 'white',
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
  
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions based on content
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      // Choose orientation based on aspect ratio
      const orientation = ratio > 1 ? 'landscape' : 'portrait';
      
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [imgWidth + 40, imgHeight + 80] // Add padding for metadata
      });
  
      // Add metadata at the top
      pdf.setFontSize(16);
      pdf.text('ORCA Heatmap Analysis', 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 50);
      pdf.text(`Color Scale: 0 - ${colorMax} nm`, 20, 65);
  
      // Add the heatmap image
      pdf.addImage(imgData, 'PNG', 20, 80, imgWidth, imgHeight);
      
      pdf.save('distance-heatmap.pdf');
  
      toast({
        title: 'PDF Downloaded Successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
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
        {imputed.includes(name) ? '*' : ''}{name}
      </text>
    );
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',width: '100%'}}>
      <HStack>
        <label>Color:</label>
        <Box
          as="button"
          borderRadius="md"
          px={3}
          h={6}
          onClick={setShowColorPicker.toggle}
          bg={color}
          margin={3}
        />
        {showColorPicker && <TwitterPicker color={color} onChange={handleColorChange} triangle='hide'/>}

        <label>Color Scale Domain: 0 ~ </label>
        <NumberInput
          size="sm"
          maxW={125}
          step={50}
          defaultValue={colorMax}
          value={Math.ceil(parseFloat(colorMax))}
          min={min}
          max={Math.ceil(max)}
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
        <label>nm</label>

        <Button
          leftIcon={isDownloading ? <Spinner size="sm" /> : <DownloadIcon />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          isLoading={isDownloading}
          disabled={!data || data.length === 0}
          onClick={downloadPDF}
        >
          PDF
        </Button>

      </HStack>
      <div ref={heatmapRef}>
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
    </div>
  );
};
export default Heatmap;
