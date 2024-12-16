import React, { useEffect, useState } from 'react';

import { PerformanceSpecRow } from './types';

interface PerformanceSpecProps {
  data: PerformanceSpecRow[];
}

const headers = [
  { externalName: 'Metric', internalName: 'metric' },
  { externalName: 'Value', internalName: 'value' },
  { externalName: 'Verified', internalName: 'verified' },
  { externalName: 'Last Checked', internalName: 'lastChecked' },
];

const PerformanceSpec = ({ data }: PerformanceSpecProps) => {
  const [columns, setColumns] = useState([]);

  const formatColumns = () => {
    return headers.map((header) => {
      const values = data.map((d) => {
        if (header.internalName === 'metric') {
          return formatMetric(d[header.internalName]);
        }
        return d[header.internalName];
      });
      return [header.externalName, ...values];
    });
  };

  const formatMetric = (metric: string) => {
    // Split at each capital letter and join with a space
    metric = metric.charAt(0).toUpperCase() + metric.slice(1);
    return metric.split(/(?=[A-Z])/).join(' ');
  };

  useEffect(() => {
    if (!data?.length) return;
    const _columns = formatColumns();
    setColumns(_columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="qa-performance-spec-container">
      <h2 className="dataset-details-title">QA Performance Specification</h2>
      <div className="qa-performance-spec">
        {data &&
          columns.map((column) => {
            return (
              <div key={column[0]} className="qa-performance-spec-column">
                {column.map((c) => {
                  return (
                    <div key={`${column[0]}_${c}`} className="qa-performance-spec-column-item">
                      {c}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PerformanceSpec;
