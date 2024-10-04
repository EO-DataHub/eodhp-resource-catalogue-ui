import { AiOutlineCloseSquare } from 'react-icons/ai';
import { RiCheckboxLine } from 'react-icons/ri';
import { SiTicktick } from 'react-icons/si';

import { PerformanceData } from './QAPanel';

import './PerformanceTable.scss';

type PerformanceTableProps = {
  data: PerformanceData[];
};

export const PerformanceTable = ({ data }: PerformanceTableProps) => {
  return (
    <table className="performance-table">
      <thead>
        <tr>
          <th className="light-blue">Metric</th>
          <th className="light-blue">Value</th>
          <th className="pale-green">Verified</th>
          <th className="pale-green">Result</th>
          <th className="pale-green">Last Checked</th>
        </tr>
      </thead>

      <tbody>
        {data.map((data) => (
          <tr key={data.id}>
            <td>{data.metric}</td>
            <td>{data.value}</td>
            <td>
              {data.verified === null || data.verified === undefined ? null : data.verified ? (
                <RiCheckboxLine />
              ) : (
                <AiOutlineCloseSquare />
              )}
            </td>
            <td>
              {data.result ? <SiTicktick className={data.result ? data.result : ''} /> : null}
            </td>
            <td>{data.lastChecked?.toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
