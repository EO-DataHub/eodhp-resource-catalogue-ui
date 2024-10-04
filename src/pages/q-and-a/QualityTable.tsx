import { QualityData } from './QAPanel';

import './shared.scss';
import './QualityTable.scss';

type QualityTableProps = {
  data: QualityData[];
};

const CLASSES = {
  'Not Assessed': 'not-assessed',
  'Not Assessable': 'not-assessable',
  Basic: 'basic',
  Good: 'good',
  Excellent: 'excellent',
  Ideal: 'ideal',
  Verified: 'verified',
};

export const QualityTable = ({ data }: QualityTableProps) => (
  <table className="quality-table">
    <thead>
      <tr>
        <th colSpan={3}>Quality Information</th>
      </tr>
      <tr>
        <th>Product Information</th>
        <th>Metrology</th>
        <th>Product Generation</th>
      </tr>
    </thead>

    <tbody>
      {data.map((datum) => (
        <tr key={datum.id}>
          <td className={datum?.productInfo?.status ? CLASSES[datum.productInfo.status] : ''}>
            {datum?.productInfo?.label}
          </td>
          <td className={datum?.metrology?.status ? CLASSES[datum.metrology.status] : ''}>
            {datum?.metrology?.label}
          </td>
          <td
            className={
              datum?.productGeneration?.status ? CLASSES[datum.productGeneration.status] : ''
            }
          >
            {datum?.productGeneration?.label}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
