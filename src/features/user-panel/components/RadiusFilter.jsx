import { useContext,useState } from "react";
import { TraceContext } from "../../../stores/trace-context";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
const RadiusFilter=()=>{
  const traceCtx=useContext(TraceContext);
  const radiusHandler=traceCtx.radiusHandler;

  const [value, setValue] = useState(1);

  const handleChange = (newValue) => {
    setValue(newValue);
    radiusHandler(newValue);
  };

  return(
    <Box p={4} width="300px">
      <VStack spacing={2} align="stretch">
        <HStack justify="space-between">
          <Text fontWeight="medium">Radius</Text>
          <Text>{value.toFixed(1)} nm</Text>
        </HStack>
        <Slider
          value={value}
          min={0}
          max={1000}
          step={10}
          onChange={handleChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </VStack>
    </Box>
  )
}
export default RadiusFilter;
