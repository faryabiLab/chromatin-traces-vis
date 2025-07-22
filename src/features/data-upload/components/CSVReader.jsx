import React, { useState, useContext } from 'react';
import { DataContext } from '../../../stores/data-context';
import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';
import { ArrowForwardIcon, QuestionIcon } from '@chakra-ui/icons';
import styles from '../Uploader.module.css';
import {
  Box,
  Text,
  VStack,
  useToast,
  HStack,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const warningColor = '#e23636';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

export default function CSVReader() {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [maxReadout, setMaxReadout] = useState(null);
  const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);
  const [array, setArray] = useState([]);
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  const setTotalReadouts = dataCtx.setTotalReadouts;
  const Toast = useToast();

  function checkHeaders(dataList) {
    const requiredHeaders = ['readout', 'x', 'y', 'z', 's', 'fov'];
    return dataList.every((item) => requiredHeaders.every((header) => header in item));
  }

  const convertHeaders = (headers) => {
    return headers.map((header) => {
      const lowerHeader = header.toLowerCase();
      return lowerHeader === 'trace' ? 's' : lowerHeader;
    });
  };

  return (
    <VStack align={'left'} justify={'center'} spacing={3}>
      <HStack spacing={2} alignItems="center">
        <FormLabel htmlFor="total-readouts" mb="0">
          Number of Total Readouts:
        </FormLabel>
        <NumberInput step={5} size="xs" onChange={setMaxReadout}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack spacing={2} alignItems="center">
        <FormLabel htmlFor="start-pos" mb="0">
          Start Position:
        </FormLabel>
        <NumberInput step={5} size="xs">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack spacing={2} alignItems="center">
        <FormLabel htmlFor="end-pos" mb="0">
          End Position:
        </FormLabel>
        <NumberInput step={5} size="xs">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>

      <HStack spacing={2} alignItems="center">
        <FormLabel htmlFor="chromosome" mb="0">
          Chromosome:
        </FormLabel>
        <NumberInput step={5} size="xs">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <CSVReader
        onUploadAccepted={(results) => {
          const csvHeader = convertHeaders(results.data[0]);
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
              py={20}
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
                <Text fontSize="xl">Drop CSV file here or click to upload</Text>
              )}
            </Box>
          </>
        )}
      </CSVReader>

      <Box
        as="button"
        width={'100%'}
        color="white"
        fontWeight="bold"
        borderRadius="md"
        bgGradient="linear(to-r, teal.500, green.500)"
        _hover={{
          bgGradient: 'linear(to-r, red.500, yellow.500)',
        }}
        margin="5px"
        onClick={(e) => {
          if (maxReadout === null || maxReadout == '') {
            Toast({
              title: 'Error',
              description: 'Please Provide Total Readouts',
              status: 'warning',
              duration: 3000,
              isClosable: true,
              position: 'top',
            });
          } else if (array.length > 0) {
            if (!checkHeaders(array)) {
              Toast({
                title: 'Error',
                description: 'Invalid CSV File',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
              });
            } else {
              setDataBysHandler(array);
              setTotalReadouts(maxReadout);
            }
          }
        }}
      >
        <ArrowForwardIcon w={6} h={6} />
      </Box>
    </VStack>
  );
}
