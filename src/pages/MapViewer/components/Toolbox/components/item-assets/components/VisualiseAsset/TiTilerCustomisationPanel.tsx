import React, { useEffect, useMemo, useState } from 'react';
import './TiTilerCustomisationPanel.scss';

import { TbMathMaxMin } from 'react-icons/tb';
import { Tooltip } from 'react-tooltip';

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

// https://dev.eodatahub.org.uk/titiler/xarray/tiles/0/0/0?url=https%3A%2F%2Fdap.ceda.ac.uk%2Fneodc%2Feocis%2Fdata%2Fglobal_and_regional%2Fsea_surface_temperature%2FCDR_v3%2FAnalysis%2FL4%2Fv3.0.1%2F2024%2F03%2F31%2F20240331120000-ESACCI-L4_GHRSST-SSTdepth-OSTIA-GLOB_ICDR3.0-v02.0-fv01.0.nc&tileMatrixSetId=WebMercatorQuad&reference=false&rescale=200%2C400&colormap_name=plasma

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
  const [bidx, setBidx] = useState('');

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
      const baseUrl = `https://dev.eodatahub.org.uk/titiler/core/cog/tiles/${tileMatrixSetId}`;
      const params = new URLSearchParams();
      params.append('url', asset.href);
      if (bidx) params.append('bidx', bidx);
      if (rescale) params.append('rescale', rescale);
      if (colormapName) params.append('colormap_name', colormapName);

      previewUrl = `${baseUrl}/0/0/0?${params.toString()}`;
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
      url = `https://dev.eodatahub.org.uk/titiler/core/cog/info?url=${encodeURIComponent(asset.href)}`;
    } else if (assetType === 'xarray') {
      url = `https://dev.eodatahub.org.uk/titiler/xarray/info?url=${encodeURIComponent(asset.href)}&variable=${variable}&reference=${isKerchunk}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.attrs && data.attrs.valid_min && data.attrs.valid_max) {
      setRescale(`${data.attrs.valid_min},${data.attrs.valid_max}`);
    } else {
      console.error('Could not determine min and max values for rescale');
    }
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
              <select id="band-index-select" value={bidx} onChange={(e) => setBidx(e.target.value)}>
                {availableBands.map(([index, description]) => (
                  <option key={index} value={index}>
                    {index} - {description}
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
            data-tooltip-id="copy-button"
            onClick={approximateRescaleValue}
          >
            <TbMathMaxMin />
          </button>
        </div>
      </div>

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
