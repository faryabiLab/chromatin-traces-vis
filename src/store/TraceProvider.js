import {TraceContext} from "./trace-context";
import {useReducer} from "react";

const defaultTraceState={
  selected:{fov:'1',s:'1'},
  clicked:{a:null,b:null}
};

const traceReducer=(state,action)=>{
  if(action.type==='SELECT'){
    return {
      selected:{fov:action.fov,s:action.s},
      clicked:state.clicked
    };
  }
  if(action.type==='CLICK'){
    return {
      selected:state.selected,
      clicked:{a:action.a,b:action.b}
    };
  }
  return defaultTraceState;
}

export function TraceProvider({children}){
  const [traceState,dispathTraceAction] = useReducer(traceReducer,defaultTraceState);
  const selectTraceHandler=(fov,s,dataBys)=>{
    dispathTraceAction({type:'SELECT',fov:fov,s:s,dataBys:dataBys});
  };
  const clickTraceHandler=(a,a_id,b,b_id)=>{
    dispathTraceAction({type:'CLICK',a:a,a_id:a_id,b:b,b_id:b_id});
  };
  const traceContext={
    selected:traceState.selected,
    clicked:traceState.clicked,
    selectedHandler:selectTraceHandler,
    clickedHandler:clickTraceHandler
  };
  return (
    <TraceContext.Provider value={traceContext}>
      {children}
    </TraceContext.Provider>
  );
}

