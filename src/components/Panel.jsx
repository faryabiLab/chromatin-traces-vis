import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';
import styles from './Panel.module.css';

const Panel = () => {
  
  return (
    <div className={styles.container}>
    <div>
      <CanvasWrapper 
        component={Plot}
      />
    </div>
    <div className={styles.two}>
      <Dashboard className={styles.two}/>
    </div>
    </div>
  );
};
export default Panel;
  