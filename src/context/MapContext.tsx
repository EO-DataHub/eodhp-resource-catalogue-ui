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
import { useLocation } from 'react-router-dom';
import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';
import { getStacCollections } from '@/services/stac';
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

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const catalogPath = searchParams.get('catalogPath');

  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: DEFAULT_LON_LAT,
    zoom: DEFAULT_ZOOM,
  });
  const [map, setMap] = useState<Map | undefined>();
  const [aoi, setAoi] = useState<Extent | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  const {
    state: { activeFilters },
  } = useFilters();

  useDebounce(
    () => {
      const fetchData = async () => {
        try {
          const collections = await getStacCollections(catalogPath ?? '', activeFilters.textQuery);
          setCollections(collections);
        } catch (error) {
          console.error('Error fetching collections', error);
        }
      };
      fetchData();
    },
    250,
    [activeFilters],
  );

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
        ...initialState,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
