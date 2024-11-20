import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useRef,
  useState,
} from 'react';

import { Extent } from 'ol/extent';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import STACLayer from 'ol-stac';

import { Collection } from '@/typings/stac';

export type MapContextType = {
  mapConfig: MapConfig;
  setMapConfig: Dispatch<SetStateAction<MapConfig>>;
  mapRef: MutableRefObject<HTMLDivElement | null>;
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  getLayers: () => BaseLayer[] | undefined;
  addLayer: (layer: Layer) => void;
  removeLayer: (name: string) => void;
  getLayerByName: (name: string) => BaseLayer | undefined;
  aoi: Extent | null;
  setAoi: Dispatch<SetStateAction<Extent | null>>;
  selectedLayer: Layer | null;
  setSelectedLayer: Dispatch<SetStateAction<Layer | null>>;
  collections: Collection[];
  setCollections: Dispatch<SetStateAction<Collection[] | null>>;
  addPreviewLayer: (layer: STACLayer) => void;
  removePreviewLayer: () => void;
};

type MapProviderProps = {
  initialState?: Partial<MapContextType>;
  children: ReactNode;
};

export const MapContext = createContext<MapContextType | null>(null);
MapContext.displayName = 'MapContext';

const DEFAULT_LON_LAT = [-0.09, 51.505];
const DEFAULT_ZOOM = 7;

export const MapProvider = ({ initialState = {}, children }: MapProviderProps) => {
  const mapRef = useRef(null);

  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: DEFAULT_LON_LAT,
    zoom: DEFAULT_ZOOM,
  });
  const [map, setMap] = useState<Map | undefined>();
  const [aoi, setAoi] = useState<Extent | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  const getLayers = () => map?.getLayers().getArray();

  const getLayerByName = (name: string) => getLayers()?.find((layer) => layer.get('name') === name);

  const addLayer = (layer: Layer) => {
    // Ensure the layer is added below the `AOI` drawing layer.
    layer.setZIndex(5);

    // Add layer to map.
    map?.addLayer(layer);
    setSelectedLayer(layer);
  };

  const removeLayer = (name: string) => {
    const foundLayer = getLayerByName(name);

    map?.removeLayer(foundLayer as BaseLayer);
    setSelectedLayer(null);
  };

  const previewLayerRef = useRef(null);
  const previewOverlayRef = useRef(null);
  const addPreviewLayer = (layer: STACLayer) => {
    if (previewLayerRef.current) {
      map.removeLayer(previewLayerRef.current);
      map.removeOverlay(previewOverlayRef.current);
    }
    map.addLayer(layer);
    map.getView().fit(layer.getExtent());
    previewLayerRef.current = layer;

    const data = layer.getData();

    const button = document.createElement('button');
    button.textContent = 'X';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';

    // Create an overlay for the button
    const position = fromLonLat([data.bbox[2], data.bbox[3]]);
    const overlay = new Overlay({
      element: button,
      positioning: 'center-center',
      position,
    });
    map.addOverlay(overlay);
    previewOverlayRef.current = overlay;

    button.onclick = () => {
      removePreviewLayer();
      map.removeOverlay(overlay);
    };
  };

  const removePreviewLayer = () => {
    if (!previewLayerRef.current) return;
    map.removeLayer(previewLayerRef.current);
    previewLayerRef.current = null;
  };

  return (
    <MapContext.Provider
      value={{
        mapRef,
        map,
        setMap,
        mapConfig,
        setMapConfig,
        getLayers,
        addLayer,
        removeLayer,
        getLayerByName,
        aoi,
        setAoi,
        selectedLayer,
        setSelectedLayer,
        collections,
        setCollections,
        addPreviewLayer,
        removePreviewLayer,
        ...initialState,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
