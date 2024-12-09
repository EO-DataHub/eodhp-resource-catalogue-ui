import { useEffect, useMemo, useState } from 'react';
import './TiTilerCustomisationPanel.scss';

import { GiHistogram } from 'react-icons/gi';
import { TbMathMaxMin } from 'react-icons/tb';
import { Tooltip } from 'react-tooltip';
import {
  Bar,
  BarChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { ClipboardButton } from '@/components/clipboard/ClipboardButton';
import { StacAsset } from '@/typings/common';

import {
  availableColourMaps,
  availableProjections,
  determineAssetType,
  isAssetKerchunk,
} from './utils';

type TiTilerCustomisationPanelProps = {
  asset: StacAsset;
};

export const TiTilerCustomisationPanel = ({ asset }: TiTilerCustomisationPanelProps) => {
  const assetType = useMemo(() => determineAssetType(asset), [asset]);

  // URLs
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState('');

  // Common parameters
  const [tileMatrixSetId, setTileMatrixSetId] = useState('WebMercatorQuad');
  const [rescale, setRescale] = useState('');
  const [colormapName, setColormapName] = useState('');

  // Asset-specific
  const isKerchunk = useMemo(() => isAssetKerchunk(asset), [asset]);
  const [availableBands, setAvailableBands] = useState([]);
  const [availableVariables, setAvailableVariables] = useState([]);
  const [variable, setVariable] = useState('');
  const [bidx, setBidx] = useState(1);

  // Histogram data
  const [histogramData, setHistogramData] = useState([]);

  // Loading and error states
  const [loadingVariables, setLoadingVariables] = useState(false);
  const [variablesError, setVariablesError] = useState('');

  const [loadingRescale, setLoadingRescale] = useState(false);
  const [rescaleError, setRescaleError] = useState('');

  const [loadingHistogram, setLoadingHistogram] = useState(false);
  const [histogramError, setHistogramError] = useState('');

  // Fetch available variables or bands
  useEffect(() => {
    const fetchData = async () => {
      setLoadingVariables(true);
      setVariablesError('');
      try {
        if (assetType === 'core') {
          const url = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}/cog/info?url=${encodeURIComponent(
            asset.href,
          )}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch band information.');
          }
          const data = await response.json();
          setAvailableBands(data.band_descriptions || []);
        } else if (assetType === 'xarray') {
          const baseUrl = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/variables`;
          const params = new URLSearchParams();
          params.append('url', asset.href);
          if (isKerchunk) params.append('reference', 'true');

          const response = await fetch(`${baseUrl}?${params.toString()}`);
          if (!response.ok) {
            throw new Error('Failed to fetch variables.');
          }
          const data = await response.json();
          setAvailableVariables(data || []);
          if (data.length > 0 && !variable) {
            setVariable(data[0]);
          }
        }
      } catch (error) {
        setVariablesError(error.message);
      } finally {
        setLoadingVariables(false);
      }
    };

    fetchData();
  }, [asset.href, assetType, isKerchunk]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate URLs when parameters change
  useEffect(() => {
    let previewUrl = '';
    let tileUrl = '';
    let baseUrl = '';

    if (assetType === 'core') {
      if (import.meta.env.VITE_TITILER_CORE_ENDPOINT.startsWith('http')) {
        baseUrl = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}`;
      } else {
        baseUrl = `${import.meta.env.BASE_URL}${import.meta.env.VITE_TITILER_CORE_ENDPOINT}`;
      }
      const params = new URLSearchParams();
      params.append('url', asset.href);
      params.append('bidx', bidx.toString());
      if (rescale) params.append('rescale', rescale);
      if (colormapName) params.append('colormap_name', colormapName);

      previewUrl = `${baseUrl}/cog/preview?${params.toString()}`;
      tileUrl = `${baseUrl}/cog/tiles/${tileMatrixSetId}/{z}/{x}/{y}?${params.toString()}`;
    } else if (assetType === 'xarray') {
      if (import.meta.env.VITE_TITILER_XARRAY_ENDPOINT.startsWith('http')) {
        baseUrl = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/tiles`;
      } else {
        baseUrl = `${import.meta.env.BASE_URL}${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/tiles`;
      }

      const params = new URLSearchParams();
      params.append('url', asset.href);
      if (variable) params.append('variable', variable);
      params.append('tileMatrixSetId', tileMatrixSetId);
      params.append('reference', isKerchunk.toString());
      if (rescale) params.append('rescale', rescale);
      if (colormapName) params.append('colormap_name', colormapName);
      previewUrl = `${baseUrl}/0/0/0?${params.toString()}`;
      tileUrl = `${baseUrl}/{z}/{x}/{y}?${params.toString()}`;
    }

    setGeneratedUrl(tileUrl);
    setGeneratedPreviewUrl(previewUrl);
  }, [assetType, asset.href, tileMatrixSetId, rescale, colormapName, variable, isKerchunk, bidx]);

  // Approximate rescale values
  const approximateRescaleValue = async () => {
    setLoadingRescale(true);
    setRescaleError('');
    try {
      let url = '';
      if (assetType === 'core') {
        url = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}/cog/statistics?url=${encodeURIComponent(
          asset.href,
        )}&bidx=${bidx}`;
      } else if (assetType === 'xarray') {
        url = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/info?url=${encodeURIComponent(
          asset.href,
        )}&variable=${variable}&reference=${isKerchunk}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch statistics for rescale approximation.');
      }

      const data = await response.json();

      // Check for XArray attrs
      if (data.attrs && data.attrs.valid_min && data.attrs.valid_max) {
        setRescale(`${data.attrs.valid_min},${data.attrs.valid_max}`);
      } else {
        // Check for Core band statistics
        const bandKey = availableBands[bidx - 1]?.[0];
        if (bandKey && data[bandKey]?.min !== undefined && data[bandKey]?.max !== undefined) {
          setRescale(`${data[bandKey].min},${data[bandKey].max}`);
        } else {
          throw new Error('Could not approximate rescale value from data.');
        }
      }
    } catch (error) {
      setRescaleError(error.message);
    } finally {
      setLoadingRescale(false);
    }
  };

  // Retrieve histogram data
  const retrieveHistogramResults = async () => {
    setLoadingHistogram(true);
    setHistogramError('');
    try {
      let url = '';
      let formattedData = [];

      if (assetType === 'xarray') {
        url = `${import.meta.env.VITE_TITILER_XARRAY_ENDPOINT}/histogram?url=${encodeURIComponent(
          asset.href,
        )}&variable=${variable}&reference=${isKerchunk}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch histogram data.');
        }
        const data = await response.json();

        formattedData = data.map((item) => ({
          bucketMidpoint: (item.bucket[0] + item.bucket[1]) / 2,
          value: item.value,
        }));
      } else if (assetType === 'core') {
        url = `${import.meta.env.VITE_TITILER_CORE_ENDPOINT}/cog/statistics?url=${encodeURIComponent(
          asset.href,
        )}&bidx=${bidx}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch histogram data.');
        }
        const data = await response.json();

        const bandKey = availableBands[bidx - 1]?.[0];
        if (bandKey && data[bandKey]?.histogram) {
          formattedData = data[bandKey].histogram[0].map((val: number, index: number) => ({
            bucketMidpoint: data[bandKey].histogram[1][index],
            value: val,
          }));
        } else {
          throw new Error('Histogram data not found for the selected band.');
        }
      }

      setHistogramData(formattedData);
    } catch (error) {
      setHistogramError(error.message);
    } finally {
      setLoadingHistogram(false);
    }
  };

  if (assetType === 'unknown') {
    return <p>Unsupported asset type.</p>;
  }

  if (loadingVariables) {
    return <p>{`Loading ${assetType === 'core' ? 'bands' : 'variables'}...`}</p>;
  }

  if (variablesError) {
    return <p className="error">{variablesError}</p>;
  }

  return (
    <div className="titiler-customisation-panel">
      {variablesError && <p className="error">{variablesError}</p>}

      {/* XArray Variable Selection */}
      {assetType === 'xarray' &&
        !loadingVariables &&
        !variablesError &&
        availableVariables.length > 0 && (
          <div className="form-group">
            <label htmlFor="variable-select">Variable</label>
            <select
              id="variable-select"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
            >
              {availableVariables.map((varName: string) => (
                <option key={varName} value={varName}>
                  {varName}
                </option>
              ))}
            </select>
          </div>
        )}

      {/* Core Band Selection */}
      {assetType === 'core' &&
        !loadingVariables &&
        !variablesError &&
        availableBands.length > 0 && (
          <div className="form-group">
            <label htmlFor="band-index-select">Band Index</label>
            <select
              id="band-index-select"
              value={bidx - 1}
              onChange={(e) => setBidx(Number(e.target.value) + 1)}
            >
              {availableBands.map(([key, description]: [string, string], index: number) => (
                <option key={key} value={index}>
                  {key} - {description}
                </option>
              ))}
            </select>
          </div>
        )}

      {/* Tile Matrix Set */}
      <div className="form-group">
        <label htmlFor="tile-matrix-set-select">Tile Matrix Set</label>
        <select
          id="tile-matrix-set-select"
          value={tileMatrixSetId}
          onChange={(e) => setTileMatrixSetId(e.target.value)}
        >
          {availableProjections.map((projection: string) => (
            <option key={projection} value={projection}>
              {projection}
            </option>
          ))}
        </select>
      </div>

      {/* Rescale */}
      <div className="form-group">
        <label htmlFor="rescale-input">Rescale</label>
        <div className="rescale-container">
          <input
            id="rescale-input"
            placeholder="e.g., 0,255"
            type="text"
            value={rescale}
            onChange={(e) => setRescale(e.target.value)}
          />
          <Tooltip id="rescale-button" />
          <button
            data-tooltip-content="Use min and max values from the data"
            data-tooltip-id="rescale-button"
            disabled={loadingRescale}
            onClick={approximateRescaleValue}
          >
            {loadingRescale ? 'Loading...' : <TbMathMaxMin />}
          </button>

          <Tooltip id="histogram-button" />
          <button
            data-tooltip-content="See histogram"
            data-tooltip-id="histogram-button"
            disabled={loadingHistogram}
            onClick={retrieveHistogramResults}
          >
            {loadingHistogram ? 'Loading...' : <GiHistogram />}
          </button>
        </div>
        {rescaleError && <p className="error">{rescaleError}</p>}
      </div>

      {/* Histogram Chart */}
      {histogramError && <p className="error">{histogramError}</p>}
      {!histogramError && histogramData.length > 0 && (
        <div className="histogram-chart">
          <h3>Histogram</h3>
          <ResponsiveContainer height={200} width="100%">
            <BarChart data={histogramData}>
              <XAxis
                dataKey="bucketMidpoint"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => value.toFixed(1)}
                type="number"
              />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Colormap */}
      <div className="form-group">
        <label htmlFor="colormap-select">Colormap</label>
        <select
          id="colormap-select"
          value={colormapName}
          onChange={(e) => setColormapName(e.target.value)}
        >
          <option value="">None</option>
          {availableColourMaps.map((colormap: string) => (
            <option key={colormap} value={colormap}>
              {colormap}
            </option>
          ))}
        </select>
      </div>

      <hr className="divider" />

      {/* Preview Button */}
      <div className="preview-url">
        <button
          className="preview-button"
          onClick={() => window.open(generatedPreviewUrl, '_blank')}
        >
          Preview
        </button>
      </div>

      <hr className="divider" />

      {/* Generated URL */}
      <div className="generated-url">
        <label htmlFor="tile-url">Tile URL</label>
        <small className="information">
          This URL uses the standard XYZ tile format <code>{'{z}/{x}/{y}'}</code>. It should be
          compatible with most mapping libraries. For details, see the{' '}
          <a
            href="https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification"
            rel="noreferrer"
            target="_blank"
          >
            OGC Tile Map Service specification
          </a>
          .
        </small>
        <div className="url-container">
          <input readOnly id="tile-url" type="text" value={generatedUrl} />
          <ClipboardButton text={generatedUrl} />
        </div>
      </div>
    </div>
  );
};
