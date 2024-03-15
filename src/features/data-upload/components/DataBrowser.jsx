import {useEffect,useContext} from 'react';
import {usePapaParse} from 'react-papaparse';
import { DataContext } from '../../../stores/data-context';
const DataBrowser = () => {
  const tempData=['231104_Granta519cl97_untreated_MYC5p_4phBl_30mHyb_30step', '240219_Granta519cl27_24hdTAGwashout_MYC5p_4PhBl_30mHyb_30step', '230824_Granta519cl27_24hdTAG_MYC5p_4phBl_30mHyb_30step', '231013_Granta519cl27_untreated_MYC5p_4phBl_30mHyb_30step', '231117_Granta519cl97_24hdTAG_MYC5p_4PhBl_30mHyb_30step', '231204_Granta519cl97_6hdTAG_MYC5p_4PhBl_30mHyb_30step', '231214_Granta519cl27_6hdTAG_MYC5p_4PhBl_30mHyb_30step'];
  const {readRemoteFile}=usePapaParse();
  const dataCtx = useContext(DataContext);
  const setDataBysHandler = dataCtx.setDataBysHandler;
  useEffect(() => {
    //fetch metadata table from backend on load

  },[]);

  const fetchCSV = (id) => {
    readRemoteFile(`https://faryabi-olive.s3.amazonaws.com/${id}.csv`, {
      complete: (results) => {
        const array=results.data;
        if (array&&array.length > 0) {
          setDataBysHandler(array);
        }
      },
      header: true,

    });
  }

  const renderTable = (data) => {
    return (
      <table>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
             <td>
              {row}
             </td>
             <td>
              <button onClick={() => fetchCSV(row)}>Download</button>
             </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    renderTable(tempData)
  )
};
export default DataBrowser;
