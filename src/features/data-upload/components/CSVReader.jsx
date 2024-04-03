import React, { useState, useContext } from 'react';
import { DataContext } from '../../../stores/data-context';
import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';
import { Box, HStack } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styles from '../Uploader.module.css';

const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

export default function CSVReader() {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);
  const [array, setArray] = useState([]);
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  return (
    <HStack spacing="48px">
      <CSVReader
        onUploadAccepted={(results) => {
          const csvHeader = results.data[0];
          const csvContent = results.data.slice(1);

          const array = csvContent.map((values) => {
            const obj = csvHeader.reduce((object, header, index) => {
              object[header] = values[index];
              return object;
            }, {});
            return obj;
          });

          setArray(array);

          setZoneHover(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setZoneHover(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setZoneHover(false);
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps, Remove }) => (
          <>
            <Box
              px={20}
              py={15}
              borderRadius="lg"
              className={`${styles.zone} ${zoneHover && styles.zoneHover}`}
              {...getRootProps()}
            >
              {acceptedFile ? (
                <>
                  <div className={styles.file}>
                    <div className={styles.info}>
                      <span className={styles.size}>{formatFileSize(acceptedFile.size)}</span>
                      <span>{acceptedFile.name}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <ProgressBar />
                    </div>
                    <div
                      {...getRemoveFileProps()}
                      className={styles.remove}
                      onMouseOver={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                      }}
                      onMouseOut={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                      }}
                    >
                      <Remove color={removeHoverColor} />
                    </div>
                  </div>
                </>
              ) : (
                'Drop CSV file here or click to upload'
              )}
            </Box>
          </>
        )}
      </CSVReader>
      <Box
        as="button"
        p={2}
        color="white"
        fontWeight="bold"
        borderRadius="md"
        bgGradient="linear(to-r, teal.500, green.500)"
        _hover={{
          bgGradient: 'linear(to-r, red.500, yellow.500)',
        }}
        margin="5px"
        onClick={(e) => {
          setDataBysHandler(array);
        }}
      >
        <ArrowForwardIcon w={6} h={6} />
      </Box>
    </HStack>
  );
}
