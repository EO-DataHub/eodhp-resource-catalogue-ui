import React from 'react';

interface DataTableProps {
  header: string;
  data: unknown;
}

const headerMap = {
  general: 'General',
  sar: 'SAR',
  sat: 'Satellite',
};

const DataTable = ({ header, data }: DataTableProps) => {
  return (
    <div className="dataset-details-table-container">
      <h2 className="dataset-details-title">{headerMap[header]}</h2>
      <div className="dataset-details-table">
        {Object.entries(data).map(([key, value]) => {
          return (
            <div key={key} className="dataset-details-table-row">
              <div className="dataset-details-title">{key}</div>
              <ul className="dataset-details-item">
                {value.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataTable;
