/// <reference types="google.maps" />

export interface PlaceSuggestion {
  placeId: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export interface PlaceDetails {
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** Real Google-sourced photos of the place, when available. */
  photoUrls: string[];
}

let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

/** One session token per search "session" (until a place is picked) — batches autocomplete requests together for billing purposes, per Google's guidance. */
function getSessionToken(): google.maps.places.AutocompleteSessionToken {
  if (!sessionToken) {
    sessionToken = new google.maps.places.AutocompleteSessionToken();
  }
  return sessionToken;
}

function resetSessionToken() {
  sessionToken = null;
}

export async function searchPlaces(
  query: string,
  bias?: [number, number] | null
): Promise<PlaceSuggestion[]> {
  const { AutocompleteSuggestion } = (await google.maps.importLibrary(
    "places"
  )) as google.maps.PlacesLibrary;

  const request: google.maps.places.AutocompleteRequest = {
    input: query,
    sessionToken: getSessionToken(),
  };
  if (bias) {
    request.locationBias = {
      center: { lat: bias[0], lng: bias[1] },
      radius: 25000,
    };
  }

  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
  return suggestions
    .map((s) => s.placePrediction)
    .filter((p): p is google.maps.places.PlacePrediction => p !== null)
    .map((p) => ({
      placeId: p.placeId,
      primaryLabel: p.mainText?.text ?? p.text.text,
      secondaryLabel: p.secondaryText?.text ?? "",
    }));
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const place = new Place({ id: placeId });
  await place.fetchFields({
    fields: ["displayName", "formattedAddress", "location", "photos"],
  });
  resetSessionToken(); // picking a place ends the autocomplete session

  if (!place.location) return null;
  const photoUrls = (place.photos ?? [])
    .slice(0, 8)
    .map((photo) => photo.getURI({ maxWidth: 900 }));

  return {
    name: place.displayName ?? "",
    address: place.formattedAddress ?? "",
    lat: place.location.lat(),
    lng: place.location.lng(),
    photoUrls,
  };
}

/** Looks up a name + address for a pin dropped by tap or geolocation (rather than search). */
export async function reverseGeocode(
  pos: [number, number]
): Promise<{ label: string; address: string } | null> {
  const geocoder = new google.maps.Geocoder();
  const { results } = await geocoder.geocode({ location: { lat: pos[0], lng: pos[1] } });
  const first = results[0];
  if (!first) return null;
  return { label: first.formatted_address.split(",")[0], address: first.formatted_address };
}
