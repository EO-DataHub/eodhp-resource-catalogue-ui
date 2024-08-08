import 'leaflet';

declare module 'leaflet' {
  namespace TileLayer {
    interface WMTSOptions extends TileLayerOptions {
      layer: string;
      style?: string;
      tileMatrixSet: string;
      format?: string;
      version?: string;
      request?: string;
      service?: string;
      time?: string;
    }

    class WMTS extends TileLayer {
      constructor(url: string, options?: WMTSOptions);
      setParams(params: WMTSOptions,
        noRedraw?: boolean): this;
    }
  }

  namespace tileLayer {
    function wmts(url: string, options?: TileLayer.WMTSOptions): TileLayer.WMTS;
  }
}