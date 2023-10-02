import CanvasWrapper from './CanvasWrapper';
import Plot from './Plot';
import Dashboard from './Dashboard';
import styles from './Panel.module.css';
import Welcome from './Welcome';
import { DataContext } from '../store/data-context';
import {useContext} from 'react';
const Panel = () => {
  const dataCtx=useContext(DataContext);
  const isUploaded=dataCtx.dataBys===null?false:true;
  return (
    <div className={styles.container}>
    {isUploaded?
    <>
    <div>
      <CanvasWrapper 
        component={Plot}
      />
    </div>
    <div className={styles.two}>
      <Dashboard className={styles.two}/>
    </div>
      </>
    :<Welcome/>}
    </div>
  );
};
export default Panel;
  