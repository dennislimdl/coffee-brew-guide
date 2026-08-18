import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";

// OpenFreeMap: free vector-tile hosting, no API key, no account, no usage cap.
// https://openfreemap.org — "liberty" is their general-purpose styled basemap.
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

// The plugin patches `L` at import time and isn't typed for it.
type LeafletWithMaplibre = typeof L & {
  maplibreGL: (options: { style: string }) => L.Layer;
};

export default function OpenFreeMapLayer() {
  const map = useMap();

  useEffect(() => {
    const layer = (L as LeafletWithMaplibre).maplibreGL({ style: STYLE_URL }).addTo(map);
    map.attributionControl.addAttribution(
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by <a href="https://openfreemap.org">OpenFreeMap</a>'
    );
    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
}
