import React, { useState } from 'react';

import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';

const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

export default function CSVReader() {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);
  return (
    <CSVReader
      onUploadAccepted={(results) => {
        console.log('---------------------------');
        const csvHeader = results.data[0];
        const csvContent=results.data.slice(1);
  
        const array = csvContent.map((values) => {
          
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
        console.log(array);
        console.log('---------------------------');
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
          <div {...getRootProps()}>
            {acceptedFile ? (
              <>
                <div>
                  <div>
                    <span>{formatFileSize(acceptedFile.size)}</span>
                    <span>{acceptedFile.name}</span>
                  </div>
                  <div>
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
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
          </div>
        </>
      )}
    </CSVReader>
  );
}
