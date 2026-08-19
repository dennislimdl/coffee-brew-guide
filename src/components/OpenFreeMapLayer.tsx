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

interface Props {
  /**
   * When set (and changes), the map jumps here instead of wherever it was —
   * used for search-result selection, "use my current location", etc.
   * `animate: false` matters: MapContainer's `center` prop only applies on
   * first mount, so this is how later moves get applied, and an instant
   * jump avoids Leaflet's animated-zoom code path entirely for what's
   * meant to be a snap-to-location, not a smooth pan.
   */
  recenterTo?: [number, number] | null;
}

export default function OpenFreeMapLayer({ recenterTo }: Props) {
  const map = useMap();

  useEffect(() => {
    const layer = (L as LeafletWithMaplibre).maplibreGL({ style: STYLE_URL }).addTo(map);
    // Thumbnail/read-only maps (e.g. the step-2 location summary) disable
    // Leaflet's attribution control entirely via `attributionControl={false}`.
    map.attributionControl?.addAttribution(
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by <a href="https://openfreemap.org">OpenFreeMap</a>'
    );
    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  useEffect(() => {
    if (recenterTo) {
      map.setView(recenterTo, Math.max(map.getZoom(), 15), { animate: false });
    }
  }, [recenterTo, map]);

  return null;
}
