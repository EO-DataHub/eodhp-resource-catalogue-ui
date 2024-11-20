import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Feature } from 'ol';
import { Extent } from 'ol/extent';
import { Geometry } from 'ol/geom';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import { useDebounce } from 'react-use';

import { useFilters } from '@/hooks/useFilters';
import { getStacCollections } from '@/services/stac';
import { Collection } from '@/typings/stac';
import {
  addViewToURL,
  getCatalogueFromURL,
  getQueryParam,
  getViewFomURL,
  setQueryParam,
} from '@/utils/urlHandler';

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
  drawingSource: VectorSource<Feature<Geometry>> | undefined;
  setDrawingSource: (source: VectorSource<Feature<Geometry>> | undefined) => void;
  vectorLayer: VectorLayer;
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

  const catalogPath = getCatalogueFromURL();

  const [mapConfig, _setMapConfig] = useState<MapConfig>({
    center: DEFAULT_LON_LAT,
    zoom: DEFAULT_ZOOM,
  });
  const [map, setMap] = useState<Map | undefined>();
  const [initialMapValues, setInitialMapValues] = useState<boolean>(false);
  const [aoi, setAoi] = useState<Extent | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [drawingSource, setDrawingSource] = useState<VectorSource<Feature<Geometry>> | undefined>(
    undefined,
  );
  const vectorLayer = useRef(null);

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
    [activeFilters.textQuery],
  );

  useEffect(() => {
    if (!map) return;
    const source = new VectorSource();

    const layer = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
    });
    layer.set('name', 'aoiLayer');
    layer.setZIndex(10);
    layer.setVisible(true);

    map.addLayer(layer);
    vectorLayer.current = layer;

    if (drawingSource) return;
    setDrawingSource(source);
  }, [map, drawingSource]);

  useEffect(() => {
    if (!map) return;
    const view = getViewFomURL();
    if (!view) addViewToURL('map');
    map.on('moveend', () => {
      const view = map.getView();
      const centre = view.getCenter();
      setQueryParam('centre', centre.toString());
    });
    map.getView().on('change:resolution', () => {
      const zoom = map.getView().getZoom();
      setQueryParam('zoom', zoom.toString());
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;
    if (initialMapValues) return;
    const mapView = map.getView();
    const centre = getQueryParam('centre');
    if (centre) {
      mapView.setCenter([parseFloat(centre.split(',')[0]), parseFloat(centre.split(',')[1])]);
    }
    const zoom = getQueryParam('zoom');
    if (zoom) {
      mapView.setZoom(parseFloat(zoom));
    }
    setInitialMapValues(true);
  }, [map, initialMapValues]);

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

  const setMapConfig = (config: MapConfig) => {
    _setMapConfig(config);
    // TODO make _setMapConfig as a private update state method. This is so that the public setMapConfig can update the URL params
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
        drawingSource,
        setDrawingSource,
        vectorLayer: vectorLayer.current,
        ...initialState,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
