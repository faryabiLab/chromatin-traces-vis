import {Text} from '@chakra-ui/react';
import {useState} from 'react';
const Welcome = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const fileReader = new FileReader();

  const handleFileUpload = (e) => {
      setFile(e.target.files[0]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e) => {
      e.preventDefault();

      if (file) {
          fileReader.onload = function (event) {
              const csvOutput = event.target.result;
              csvFileToArray(csvOutput);
          };

          fileReader.readAsText(file);
      }
  };

 return (
  <>
  <Text
      bgGradient='linear(to-l, #7928CA, #FF0080)'
      bgClip='text'
      fontSize='6xl'
      fontWeight='extrabold'
      align='center'
    >
      Welcome, Please select...
    </Text>
  <form>
    <input
      type={'file'}
      id={'csvFileInput'}
      accept={'.csv'}
      onChange={handleFileUpload}
      />
      <button
      onClick={(e)=>{
        handleOnSubmit(e);
      }}
      >IMPORT CSV</button>
  </form>
  </>
 )
};
export default Welcome;
