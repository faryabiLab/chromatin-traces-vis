import React, { useState, useRef, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Th, Td, IconButton, Flex } from '@chakra-ui/react';
import { CloseIcon, DragHandleIcon } from '@chakra-ui/icons';
import { processMetadata } from '../../../utils/displayUtils';
const FloatingTable = ({ file, isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [table, setTable] = useState([]);
  const floatingRef = useRef(null);  

  useEffect(() => {
    if (file !== '') {
      fetch('https://olive.faryabilab.com/experiment/' + file)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error('Bad response from server');
          }
          return response.json();
        })
        .then((data) => {
          data = processMetadata(data);
          const rows = [];
          const entries = Object.entries(data);
          for (let i = 0; i < entries.length; i += 6) {
            rows.push(entries.slice(i, i + 6));
          }
          setTable(rows);
        });
    }
  }, [file]);
  // Handle start of drag
  const handleMouseDown = (e) => {
    if (floatingRef.current) {
      const rect = floatingRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Handle drag
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  // Handle end of drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  // Add and remove global event listeners
  useEffect(() => {
    if (isDragging) {
      // Add global event listeners when dragging starts
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // Only re-run effect when isDragging changes

  if (!isOpen) return null;

  return (
    <Box
      ref={floatingRef}
      position="fixed"
      left={position.x}
      top={position.y}
      bg="white"
      boxShadow="xl"
      borderRadius="md"
      zIndex={1000}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      width="auto"
    >
      {/* Header/Drag Handle */}
      <Flex
        bg="gray.100"
        p={2}
        borderTopRadius="md"
        cursor="move"
        onMouseDown={handleMouseDown}
        justify="space-between"
        align="center"
      >
        <DragHandleIcon />
        <IconButton size="sm" icon={<CloseIcon />} onClick={onClose} variant="ghost" />
      </Flex>

      {/* Table Content */}
      <Box p={4} maxH="400px" overflowY="auto">
        <Table variant="simple" size="sm" borderWidth="1px">
          <Tbody>
            {table.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Keys row */}
                <Tr bg="gray.50">
                  {row.map(([key]) => (
                    <Th key={key} borderWidth="1px">
                      {key}
                    </Th>
                  ))}
                </Tr>
                {/* Values row */}
                <Tr>
                  {row.map(([key, value]) => (
                    <Td key={key} borderWidth="1px">
                      {value === null ? 'N/A' : value.toString()}
                    </Td>
                  ))}
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default FloatingTable;
