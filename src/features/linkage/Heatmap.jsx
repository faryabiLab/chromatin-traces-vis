import React, { useMemo, useState, useContext, useRef } from 'react';
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
import jsPDF from 'jspdf';
import { getFilledReadouts,generateRainbowColors } from '../../utils/displayUtils';

const MARGIN = { top: 10, right: 20, bottom: 80, left: 50 };
const Heatmap = ({ data, width, height,geoInfo }) => {
  console.log(geoInfo);
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
  const imputed = getFilledReadouts(traceCtx.data);

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const [min, max] = d3.extent(data.map((d) => d.value));
  const [colorMax, setColorMax] = useState(max);

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
        pdf.text('Distance Map', 20, 20);
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
        pdf.save('distance-heatmap.pdf');

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

  const rainbowColors = generateRainbowColors(allXGroups.length);

  const rainbowBarGroup = (
    <g>
      {/* Rainbow rectangles */}
      {allXGroups.map((_, i) => (
        <rect
          key={`rainbow-${i}`}
          x={xScale(allXGroups[i])}
          y={boundsHeight + 25}
          width={xScale.bandwidth()}
          height={15}
          fill={rainbowColors[i]}
        />
      ))}
      
      {/* Start position label */}
      <text
        x={xScale(allXGroups[0]) + xScale.bandwidth() / 2}
        y={boundsHeight + 55}
        textAnchor="middle"
        fontSize={10}
      >
        {geoInfo?geoInfo.start.toLocaleString():null}
      </text>

      {/* Chromosome label */}
      <text
        x={boundsWidth / 2}
        y={boundsHeight + 55}
        textAnchor="middle"
        fontSize={10}
        fontWeight="bold"
      >
        {geoInfo?geoInfo.chromosome:null}
      </text>

      {/* End position label */}
      <text
        x={xScale(allXGroups[allXGroups.length - 1]) + xScale.bandwidth() / 2}
        y={boundsHeight + 55}
        textAnchor="middle"
        fontSize={10}
      >
        {geoInfo?geoInfo.end.toLocaleString():null}
      </text>
    </g>
  );


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
        {imputed.includes(name) ? '*' : ''}
        {name}
      </text>
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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
        {showColorPicker && (
          <TwitterPicker color={color} onChange={handleColorChange} triangle="hide" />
        )}

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
            {rainbowBarGroup}
          </g>
        </svg>
      </div>
    </div>
  );
};
export default Heatmap;
