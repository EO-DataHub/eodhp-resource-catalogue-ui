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
      <h2>{headerMap[header]}</h2>
      <div className="dataset-details-table">
        {Object.entries(data).map(([key, value]) => {
          return (
            <div key={key} className="dataset-details-table-row">
              <div>{key}</div>
              <div>
                {value.map((v) => (
                  <div key={v}>{v}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataTable;
