import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let patched = false;

/**
 * Leaflet's default marker icon references relative image URLs that don't
 * survive bundling. Call this once before rendering any <MapContainer> —
 * it's idempotent, so it's safe to call from every map-using component.
 */
export function fixLeafletIcons(): void {
  if (patched) return;
  patched = true;
  // @ts-expect-error — _getIconUrl exists at runtime but isn't in the types
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}
