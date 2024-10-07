import { TiTick } from 'react-icons/ti';

import './shared.scss';
import './QualityLegend.scss';

export const QualityLegend = () => (
  <div className="legend">
    <div className="title">Key</div>

    <ul>
      <li className="border not-assessed">Not Assessed</li>
      <li className="border not-assessable">Not Assessable</li>
      <li className="border basic">Basic</li>
      <li className="border good">Good</li>
      <li className="border excellent">Excellent</li>
      <li className="border ideal">Ideal</li>
      <li className="border verified">
        <span className="tick-item">
          <TiTick className="border" />
          <span>Verified</span>
        </span>
      </li>
    </ul>
  </div>
);
