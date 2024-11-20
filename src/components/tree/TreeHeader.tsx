import { RiRoadMapFill } from 'react-icons/ri';

import './TreeHeader.scss';

export const TreeHeader = () => {
  return (
    <div className="tree-header">
      <div className="header-title">
        <RiRoadMapFill className="header-icon" />
        <h2>Data Catalog</h2>
      </div>
      <p className="header-subtitle">
        Browse the datasets below and filter them using the sidebar on the left to find the data you
        need.
      </p>
    </div>
  );
};
