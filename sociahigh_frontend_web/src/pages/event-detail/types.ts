export type TempEvent = {
  name: string;
  description: string;
  date: string;
  time: string;
};

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type Location = {
  lat: number;
  lng: number;
};

export type Geometry = {
  location: Location;
};

export type GoogleMapsPlaceResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  html_attributions: any[];
};

export const ComponentTypeMapper = new Map([
  ['route', 'place'],
  ['street_number', 'number'],
  ['administrative_area_level_2', 'city'],
  ['administrative_area_level_1', 'state'],
  ['country', 'country'],
  ['postal_code', 'zip'],
]);
