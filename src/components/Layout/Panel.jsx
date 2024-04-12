import CanvasWrapper from '../../features/chromatin-models/components/CanvasWrapper';
import Plot from '../../features/chromatin-models/components/Plot';
import Dashboard from '../../features/user-panel/Dashboard';
import styles from './Panel.module.css';
import Homepage from '../../features/data-upload/FileUploader';
import { DataContext } from '../../stores/data-context';
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
      <Dashboard/>
    </div>
      </>
    :<Homepage/>}
    </div>
  );
};
export default Panel;
  