import React from 'react';

interface PerformanceSpecProps {
  data: {
    header: string;
  }[];
}

const PerformanceSpec = ({ data }: PerformanceSpecProps) => {
  return (
    <div className="qa-performance-spec">
      <div className="qa-performance-spec-row">
        <div>Metric</div>
        <div>Value</div>
        <div>Verified</div>
        <div>Result</div>
        <div>Last checked</div>
      </div>
      {data.map((entry, idx) => {
        return <div key={idx}>entry</div>;
      })}
    </div>
  );
};

export default PerformanceSpec;
