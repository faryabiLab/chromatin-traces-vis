import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';

const Panel = () => {
  
  return (
    <div style={{display:'flex',width:'100%',height:'100%'}}>
      <CanvasWrapper
        component={Plot}
      />
      <Dashboard />
    </div>
  );
};
export default Panel;
  