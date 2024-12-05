import React, { useEffect, useMemo, useState } from 'react';
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
  // State variables
  const assetType = useMemo(() => determineAssetType(asset), [asset]);

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState('');

  // Common parameters
  const [tileMatrixSetId, setTileMatrixSetId] = useState('WebMercatorQuad');
  const [rescale, setRescale] = useState('');
  const [colormapName, setColormapName] = useState('');

  // Asset-specific parameters
  const isKerchunk = useMemo(() => isAssetKerchunk(asset), [asset]);

  const [availableBands, setAvailableBands] = useState([]);
  const [availableVariables, setAvailableVariables] = useState([]);
  const [variable, setVariable] = useState('');
  const [bidx, setBidx] = useState(0);

  // Histogram data
  const [histogramData, setHistogramData] = useState([]);

  // Fetch available variables or bands based on asset type
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (assetType === 'core') {
          const response = await fetch(
            `https://dev.eodatahub.org.uk/titiler/core/cog/info?url=${encodeURIComponent(
              asset.href,
            )}`,
          );
          const data = await response.json();
          setAvailableBands(data.band_descriptions || []);
        } else if (assetType === 'xarray') {
          const baseUrl = `https://dev.eodatahub.org.uk/titiler/xarray/variables`;
          const params = new URLSearchParams();
          params.append('url', asset.href);
          if (isKerchunk) params.append('reference', 'true');

          const response = await fetch(`${baseUrl}?${params.toString()}`);
          const data = await response.json();
          setAvailableVariables(data || []);
          if (data.length > 0 && !variable) {
            setVariable(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [asset.href, assetType, isKerchunk, variable]);

  // Generate the TiTiler URL whenever parameters change
  useEffect(() => {
    let previewUrl = '';
    let tileUrl = '';

    if (assetType === 'core') {
      // For COG assets
      const baseUrl = `https://dev.eodatahub.org.uk/titiler/core/cog/preview`;
      const params = new URLSearchParams();
      params.append('url', asset.href);
      if (bidx) params.append('bidx', bidx ? bidx.toString() : '0');
      if (rescale) params.append('rescale', rescale);
      if (colormapName) params.append('colormap_name', colormapName);

      previewUrl = `${baseUrl}?${params.toString()}`;
      tileUrl = `${baseUrl}/{z}/{x}/{y}?${params.toString()}`;
    } else if (assetType === 'xarray') {
      // For XArray assets
      const baseUrl = `https://dev.eodatahub.org.uk/titiler/xarray/tiles`;

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

  const approximateRescaleValue = async () => {
    let url = '';
    if (assetType === 'core') {
      url = `https://dev.eodatahub.org.uk/titiler/core/cog/info?url=${encodeURIComponent(
        asset.href,
      )}`;
    } else if (assetType === 'xarray') {
      url = `https://dev.eodatahub.org.uk/titiler/xarray/info?url=${encodeURIComponent(
        asset.href,
      )}&variable=${variable}&reference=${isKerchunk}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.attrs && data.attrs.valid_min && data.attrs.valid_max) {
      setRescale(`${data.attrs.valid_min},${data.attrs.valid_max}`);
    } else {
      console.error('Could not determine min and max values for rescale');
    }
  };

  const retrieveHistogramResults = async () => {
    let url = '';
    if (assetType === 'xarray') {
      url = `https://dev.eodatahub.org.uk/titiler/xarray/histogram?url=${encodeURIComponent(
        asset.href,
      )}&variable=${variable}&reference=${isKerchunk}`;
    } else if (assetType === 'core') {
      url = `https://dev.eodatahub.org.uk/titiler/core/cog/histogram?url=${encodeURIComponent(
        asset.href,
      )}&bidx=${bidx}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Format data for Recharts
    const formattedData = data.map((item) => ({
      bucketMidpoint: (item.bucket[0] + item.bucket[1]) / 2,
      value: item.value,
    }));

    setHistogramData(formattedData);
  };

  // Handle unknown asset types
  if (assetType === 'unknown') {
    return <p>Unsupported asset type.</p>;
  }

  return (
    <div className="titiler-customisation-panel">
      {/* Asset-specific form fields */}
      {assetType === 'xarray' && (
        <>
          {availableVariables.length > 0 && (
            <div className="form-group">
              <label htmlFor="variable-select">Variable</label>
              <select
                id="variable-select"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
              >
                {availableVariables.map((varName) => (
                  <option key={varName} value={varName}>
                    {varName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {assetType === 'core' && (
        <>
          {availableBands.length > 0 && (
            <div className="form-group">
              <label htmlFor="band-index-select">Band Index</label>
              <select
                id="band-index-select"
                value={bidx}
                onChange={(e) => setBidx(Number(e.target.value))}
              >
                {availableBands.map(([key, description], index) => (
                  <option key={key} value={index}>
                    {key} - {description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* Common form fields */}
      <div className="form-group">
        <label htmlFor="tile-matrix-set-select">Tile Matrix Set</label>
        <select
          id="tile-matrix-set-select"
          value={tileMatrixSetId}
          onChange={(e) => setTileMatrixSetId(e.target.value)}
        >
          {availableProjections.map((projection) => (
            <option key={projection} value={projection}>
              {projection}
            </option>
          ))}
        </select>
      </div>

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
            onClick={approximateRescaleValue}
          >
            <TbMathMaxMin />
          </button>
          <Tooltip id="histogram-button" />

          <button
            data-tooltip-content="See histogram"
            data-tooltip-id="histogram-button"
            onClick={retrieveHistogramResults}
          >
            <GiHistogram />
          </button>
        </div>
      </div>

      {/* Histogram Chart */}
      {histogramData.length > 0 && (
        <div className="histogram-chart">
          <h3>Histogram</h3>
          <ResponsiveContainer height={200} width="100%">
            <BarChart data={histogramData}>
              <XAxis
                dataKey="bucketMidpoint"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => value.toFixed(2)}
                type="number"
              />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="colormap-select">Colormap</label>
        <select
          id="colormap-select"
          value={colormapName}
          onChange={(e) => setColormapName(e.target.value)}
        >
          <option value="">None</option>
          {availableColourMaps.map((colormap) => (
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
          onClick={() => {
            console.log('Opening preview URL:', generatedPreviewUrl);
            window.open(generatedPreviewUrl, '_blank');
          }}
        >
          Preview
        </button>
      </div>

      <hr className="divider" />

      {/* Generated URL */}
      <div className="generated-url">
        <label htmlFor="tile-url">Tile URL</label>
        <small className="information">
          This URL follows the standard XYZ tile format {'{z}/{x}/{y}'} and is compatible with most
          mapping libraries. For technical details, see the{' '}
          <a
            href="https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification"
            rel="noreferrer"
            target="_blank"
          >
            OGC Tile Map Service specification
          </a>
        </small>
        <div className="url-container">
          <input readOnly id="tile-url" type="text" value={generatedUrl} />
          <ClipboardButton text={generatedUrl} />
        </div>
      </div>
    </div>
  );
};
