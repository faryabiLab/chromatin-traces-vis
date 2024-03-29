import { TraceContext } from './trace-context';
import { useReducer,useContext } from 'react';
import { DataContext } from './data-context';
import { dataProcess } from '../utils/dataWrangler';

const dataProcessWrapper=(database,fov,s,allPoints)=>{
  if(!database||!database.get(fov)||!database.get(fov).get(s)) return null;
  return dataProcess(database.get(fov).get(s),allPoints);
}

const defaultTraceState = {
  data:[],
  selected: { fov: null, s: null },
  clicked: { a: -1, b: -1 },
  triplet: { a: -1, b: -1, c: -1 },
  isPlotAll:false,
};
const traceReducer = (state, action) => {
  if (action.type === 'SELECT') {
    return {
      data:dataProcessWrapper(action.dataBys,action.fov,action.s,state.isPlotAll),
      selected: { fov: action.fov, s: action.s },
      clicked: state.clicked,
      triplet: state.triplet,
      isPlotAll:state.isPlotAll,
    };
  }
  if (action.type === 'CLICK') {
    return {
      data:state.data,
      selected: state.selected,
      clicked: { a: action.a, b: action.b},
      triplet: state.triplet,
      isPlotAll:state.isPlotAll,
    };
  }

  if (action.type === 'TRIPLET') {
    return{
      data:state.data,
      selected: state.selected,
      clicked: state.clicked,
      triplet: {a:action.a,b:action.b,c:action.c},
      isPlotAll:state.isPlotAll,
    }
  }
  if(action.type==='RESET'){
    return {
      data:state.data,
      selected:state.selected,
      clicked: {a:-1,b:-1},
      triplet:{a:-1,b:-1,c:-1},
      isPlotAll:state.isPlotAll,
    }
  }

  if(action.type==='PLOTALL'){
    return{
      data:state.data,
      selected:state.selected,
      clicked:state.clicked,
      triplet:state.triplet,
      isPlotAll:true,
    }
  }
  
  
  return defaultTraceState;
};

export function TraceProvider({ children }) {
  const dataCtx=useContext(DataContext);
  const [traceState, dispatchTraceAction] = useReducer(traceReducer, defaultTraceState);

  const selectTraceHandler = (fov, s) => {
    dispatchTraceAction({ type: 'SELECT', fov: fov, s: s, dataBys: dataCtx.dataBys });
  };
  const clickTraceHandler = (a, b) => {
    dispatchTraceAction({ type: 'CLICK', a: a, b: b });
  };
  const resetClickHandler=()=>{
    dispatchTraceAction({type:'RESET'});
  }
  const isPlotAllHandler=()=>{
    dispatchTraceAction({type:'PLOTALL'});
  }

  const tripletHandler=(a,b,c)=>{
    dispatchTraceAction({type:'TRIPLET',a:a,b:b,c:c});
  }

  const traceContext = {
    data:traceState.data,
    selected: traceState.selected,
    clicked: traceState.clicked,
    triplet:traceState.triplet,
    isPlotAll:traceState.isPlotAll,
    selectedHandler: selectTraceHandler,
    clickedHandler: clickTraceHandler,
    resetHandler:resetClickHandler,
    plotAllHandler:isPlotAllHandler,
    tripletHandler:tripletHandler,
  };

  return <TraceContext.Provider value={traceContext}>{children}</TraceContext.Provider>;
}
 