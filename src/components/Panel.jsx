import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';
import styles from './Panel.module.css';
const Panel = () => {
  
  return (
    <div className={styles.panel}>
      <CanvasWrapper 
        component={Plot}
      />
      <Dashboard/>
    </div>
  );
};
export default Panel;
  