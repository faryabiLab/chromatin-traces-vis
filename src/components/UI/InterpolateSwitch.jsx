import {Switch} from '@chakra-ui/react';
import React,{useContext} from 'react';
import { TraceContext } from '../../stores/trace-context';
const InterpolateSwitch = ({isDisabled=false}) => {
  const traceCtx = useContext(TraceContext);
  const setInterpolate = traceCtx.interpolateHandler;
  const interpolate = traceCtx.interpolate;
  const handleToggle = (value) => {
    setInterpolate(value);
  };
  return <Switch isDisabled={isDisabled} isChecked={interpolate} onChange={(e) => handleToggle(e.target.checked)} />;
};

export default InterpolateSwitch;
