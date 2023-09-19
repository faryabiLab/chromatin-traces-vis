import { TraceContext } from './trace-context';
import { useReducer,useContext,useEffect } from 'react';
import { DataContext } from './data-context';
import { dataProcess } from '../utils/dataWrangler';

const dataProcessWrapper=(database,fov,s)=>{
  if(!database||!database.get(fov)||!database.get(fov).get(s)) return null;
  return dataProcess(database.get(fov).get(s));
}

const defaultTraceState = {
  data:[],
  selected: { fov: null, s: null },
  clicked: { a: null, b: null },
};
const traceReducer = (state, action) => {
  if (action.type === 'SELECT') {
    return {
      data:dataProcessWrapper(action.dataBys,action.fov,action.s),
      selected: { fov: action.fov, s: action.s },
      clicked: state.clicked,
    };
  }
  if (action.type === 'CLICK') {
    return {
      data:state.data,
      selected: state.selected,
      clicked: { a: action.a, b: action.b},
    };
  }
  return defaultTraceState;
};

export function TraceProvider({ children }) {
  const dataBys=useContext(DataContext);
  const [traceState, dispatchTraceAction] = useReducer(traceReducer, defaultTraceState);
  
  const selectTraceHandler = (fov, s) => {
    dispatchTraceAction({ type: 'SELECT', fov: fov, s: s, dataBys: dataBys });
  };
  const clickTraceHandler = (a, b) => {
    dispatchTraceAction({ type: 'CLICK', a: a, b: b });
  };
  const traceContext = {
    data:traceState.data,
    selected: traceState.selected,
    clicked: traceState.clicked,
    selectedHandler: selectTraceHandler,
    clickedHandler: clickTraceHandler,
  };

  return <TraceContext.Provider value={traceContext}>{children}</TraceContext.Provider>;
}
 