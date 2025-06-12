import React, { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button, Box, VStack } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { calculateDistancesToCenter } from '../../utils/displayUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <p>{`Readout: ${label}`}</p>
        <p>{`Distance: ${payload[0].value} nm`}</p>
      </div>
    );
  }

  return null;
};

const LinePlot = ({ data }) => {
  const distances = calculateDistancesToCenter(data);
  const chartRef = useRef();

  const downloadPDF = async () => {
    try {
      // Get the chart element
      const chartElement = chartRef.current;
      
      if (!chartElement) {
        console.error('Chart element not found');
        return;
      }

      // Convert the chart to canvas
      const canvas = await html2canvas(chartElement, {
        backgroundColor: 'white',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit the chart properly
      const imgWidth = 280; // A4 landscape width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Distance to Geometric Center', 15, imgHeight + 25);
      
      // Add timestamp
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, imgHeight + 35);

      // Save the PDF
      pdf.save('centrality-profile.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box display="flex" justifyContent="flex-start">
        <Button
          leftIcon={<DownloadIcon />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={downloadPDF}
        >
          Download as PDF
        </Button>
      </Box>
      
      <Box ref={chartRef}>
        <LineChart
          data={distances}
          width={800}
          height={450}
          margin={{
            top: 30,
            right: 30,
            left: 15,
            bottom: 20,
          }}
        >
          <Line
            type="monotone"
            dataKey="distance"
            stroke="#8884d8"
            strokeWidth={2}
            name="Distance (nm)"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis 
            dataKey="readout" 
            label={{ 
              value: 'ORCA Readout', 
              position: 'bottom',
            }}
            interval={2}
          />
          <YAxis 
            label={{ 
              value: 'Distance to Geometric Center (nm)', 
              angle: -90, 
              position: 'insideLeft',
              textAnchor: 'middle',
              dy: 150,
              dx: -10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </Box>
    </VStack>
  );
};

export default LinePlot;
