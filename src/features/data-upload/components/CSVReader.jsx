import React, { useState, useContext } from 'react';
import { DataContext } from '../../../stores/data-context';
import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';
import { ArrowForwardIcon,QuestionIcon } from '@chakra-ui/icons';
import styles from '../Uploader.module.css';
import {
  Box,
  HStack,
  useToast,
} from '@chakra-ui/react';


const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

export default function CSVReader({ maxReadout }) {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);
  const [array, setArray] = useState([]);
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  const setTotalReadouts = dataCtx.setTotalReadouts;
  const Toast=useToast();
  return (
    <HStack align={'center'} justify={'center'} spacing={10}>
      <CSVReader
        onUploadAccepted={(results) => {
          console.timeEnd('UserDragEnterTimer');
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
        onDragEnter={(event) => {
          console.time('UserDragEnterTimer');
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
                      <span className={styles.name}>{acceptedFile.name}</span>
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
      <Box>
      <Box
        as="button"
        p={2}
        color="white"
        fontWeight="bold"
        borderRadius="md"
        bgGradient="linear(to-r, gray.600, gray.800)"
        _hover={{
          bgGradient: 'linear(to-r, blue.500, purple.500)',
        }}
        margin="5px"
        onClick={() => {
          window.open('https://github.com/faryabiLab/chromatin-traces-vis', '_blank');
        }}
      >
        <QuestionIcon w={6} h={6} />
      </Box>
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
            if (maxReadout === null||maxReadout=='') {
              Toast({
                title: "Error",
                description: "Please Provide Total Readouts",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
              });
            }
            else if (array.length > 0) {
              setDataBysHandler(array);
              setTotalReadouts(maxReadout);
            }
          }}
        >
          <ArrowForwardIcon w={6} h={6} />
        </Box>
      </Box>
    </HStack>
  );
}
