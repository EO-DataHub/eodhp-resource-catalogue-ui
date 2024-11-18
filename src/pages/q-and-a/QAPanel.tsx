import { useEffect } from 'react';

import { FaMap } from 'react-icons/fa';
import { MdSatelliteAlt } from 'react-icons/md';

import { useApp } from '@/hooks/useApp';
import { addViewToURL } from '@/utils/urlHandler';

import { PerformanceTable } from './PerformanceTable';
import { QualityLegend } from './QualityLegend';
import { QualityTable } from './QualityTable';

import './QAPanel.scss';

export type PerformanceData = {
  id: string;
  metric?: string;
  value?: string;
  verified?: boolean;
  result?: string;
  lastChecked?: Date;
};

const PERFORMANCE_DATA: PerformanceData[] = [
  {
    id: 'PerformanceData-1',
    metric: 'metric 1',
    value: 'value 1',
    verified: true,
    result: 'good',
    lastChecked: new Date('2021-10-01'),
  },
  {
    id: 'PerformanceData-2',
    metric: 'metric 2',
    value: 'value 2',
    verified: false,
    result: 'bad',
    lastChecked: null,
  },
  {
    id: 'PerformanceData-3',
    metric: 'metric 3',
    value: 'value 3',
    verified: true,
    result: 'ugly',
    lastChecked: new Date('2021-10-01'),
  },
  {
    id: 'PerformanceData-4',
    metric: null,
    value: null,
    verified: null,
    result: null,
    lastChecked: null,
  },
  {
    id: 'PerformanceData-5',
    metric: 'metric 5',
    value: null,
    verified: null,
    result: null,
    lastChecked: null,
  },
];

type Quality = {
  label: string;
  status: string;
};

export type QualityData = {
  id: string;
  productInfo?: Quality;
  metrology?: Quality;
  productGeneration?: Quality;
};

const QUALITY_DATA: QualityData[] = [
  {
    id: 'QualityData-1',
    productInfo: {
      label: 'product info 1',
      status: 'Verified',
    },
    metrology: {
      label: 'metrology 1',
      status: 'Good',
    },
    productGeneration: {
      label: 'product generation 1',
      status: 'Excellent',
    },
  },
  {
    id: 'QualityData-2',
    productInfo: {
      label: 'product info 2',
      status: 'Excellent',
    },
    metrology: {
      label: 'metrology 2',
      status: 'Verified',
    },
    productGeneration: {
      label: 'product generation 2',
      status: 'Good',
    },
  },
  {
    id: 'QualityData-3',
    productInfo: {
      label: 'product info 3',
      status: 'Not Assessed',
    },
    metrology: {
      label: 'metrology 3',
      status: 'Not Assessable',
    },
    productGeneration: {
      label: 'product generation 3',
      status: 'Basic',
    },
  },
  {
    id: 'QualityData-4',
    productInfo: {
      label: 'product info 4',
      status: 'Not Assessed',
    },
    metrology: {
      label: 'metrology 4',
      status: 'Basic',
    },
    productGeneration: {
      label: 'product generation 4',
      status: 'Ideal',
    },
  },
  {
    id: 'QualityData-5',
    productInfo: null,
    metrology: {
      label: 'metrology 5',
      status: 'Ideal',
    },
    productGeneration: null,
  },
];

export const QAPanel = () => {
  useEffect(() => {
    addViewToURL('qa');
    return () => {
      addViewToURL('map');
    };
  }, []);

  const {
    actions: { setActiveContent },
  } = useApp();

  return (
    <div className="qa-panel">
      <div className="header">
        <span className="title">Quality Assurance</span>
        <button className="map-button" onClick={() => setActiveContent('map')}>
          <FaMap />
        </button>
      </div>

      <div className="body">
        <div className="half-available sat-info">
          <div className="sat-info-header">
            <MdSatelliteAlt />
            <p className="title">Smallsat Sensor L1b</p>
          </div>

          <div className="sat-info-body">Other Information</div>
        </div>

        <div className="half-available metadata">
          <div className="half-available">
            <div className="title">Performance Specification</div>

            <PerformanceTable data={PERFORMANCE_DATA} />
          </div>

          <div className="half-available">
            <div className="title">Quality Information</div>

            <div className="quality-info">
              <QualityTable data={QUALITY_DATA} />

              <QualityLegend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
