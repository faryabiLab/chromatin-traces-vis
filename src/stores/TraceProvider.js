import { TraceContext } from './trace-context';
import { useReducer,useContext, useState } from 'react';
import { DataContext } from './data-context';
import { dataProcess } from '../utils/dataWrangler';

const dataProcessWrapper=(database,fov,s,totalReadouts)=>{
  if(!database||!database.get(fov)||!database.get(fov).get(s)) return null;
  return dataProcess(database.get(fov).get(s),totalReadouts);
}

const defaultTraceState = {
  data:[],
  selected: { fov: null, s: null },
  clicked: { a: -1, b: -1 },
  triplet: { a: -1, b: -1, c: -1 },
  radius:200,
};
const traceReducer = (state, action) => {
  if (action.type === 'SELECT') {
    return {
      data:dataProcessWrapper(action.dataBys,action.fov,action.s,action.totalReadouts),
      selected: { fov: action.fov, s: action.s },
      clicked: state.clicked,
      triplet: state.triplet,
      radius:state.radius,
    };
  }
  if (action.type === 'CLICK') {
    return {
      data:state.data,
      selected: state.selected,
      clicked: { a: action.a, b: action.b},
      triplet: state.triplet,
      radius:state.radius,
    };
  }

  if (action.type === 'TRIPLET') {
    return{
      data:state.data,
      selected: state.selected,
      clicked: state.clicked,
      triplet: {a:action.a,b:action.b,c:action.c},
      radius:state.radius,
    }
  }

  if(action.type==='RADIUS'){
    return{
      data:state.data,
      selected:state.selected,
      clicked:state.clicked,
      triplet:state.triplet,
      radius:action.radius,
    }
  }

  if(action.type==='RESET'){
    return {
      data:state.data,
      selected:state.selected,
      clicked: {a:-1,b:-1},
      triplet:{a:-1,b:-1,c:-1},
      radius:state.radius,
    }
  }  
  return defaultTraceState;
};

export function TraceProvider({ children }) {
  const dataCtx=useContext(DataContext);
  const [traceState, dispatchTraceAction] = useReducer(traceReducer, defaultTraceState);
  const selectTraceHandler = (fov, s) => {
    dispatchTraceAction({ type: 'SELECT', fov: fov, s: s, dataBys: dataCtx.dataBys, totalReadouts:dataCtx.totalReadouts });
  };
  const clickTraceHandler = (a, b) => {
    dispatchTraceAction({ type: 'CLICK', a: a, b: b });
  };
  const resetClickHandler=()=>{
    dispatchTraceAction({type:'RESET'});
  }

  const radiusHandler=(radius)=>{
    dispatchTraceAction({type:'RADIUS',radius:radius});
  }

  const tripletHandler=(a,b,c)=>{
    dispatchTraceAction({type:'TRIPLET',a:a,b:b,c:c});
  }

  const traceContext = {
    data:traceState.data,
    selected: traceState.selected,
    clicked: traceState.clicked,
    triplet:traceState.triplet,
    selectedHandler: selectTraceHandler,
    clickedHandler: clickTraceHandler,
    resetHandler:resetClickHandler,
    tripletHandler:tripletHandler,
    radius:traceState.radius,
    radiusHandler:radiusHandler,
  };

  return <TraceContext.Provider value={traceContext}>{children}</TraceContext.Provider>;
}
 