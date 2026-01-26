import { types as sdkTypes } from "../util/sdkLoader";

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
//
// NOTE: these are highly recommended, since they
//       1) help customers to find relevant locations, and
//       2) reduce the cost of using map providers geocoding API
const defaultLocations = [
	{
		id: "default-malmo",
		predictionPlace: {
			address: "Malmö, Skåne Län, Sverige",
			bounds: new LatLngBounds(
				new LatLng(55.656907, 13.151762),
				new LatLng(55.547052, 12.944035)
			),
		},
	},
	{
		id: "default-lund",
		predictionPlace: {
			address: "Lund, Skåne Län, Sverige",
			bounds: new LatLngBounds(
				new LatLng(55.794013, 13.306011),
				new LatLng(55.67613, 13.107319)
			),
		},
	},
	{
		id: "default-stockholm",
		predictionPlace: {
			address: "Stockholm, Stockholms Län, Sverige",
			bounds: new LatLngBounds(
				new LatLng(59.37623, 18.185064),
				new LatLng(59.29037, 17.970509)
			),
		},
	},
	{
		id: "default-gothenburg",
		predictionPlace: {
			address: "Göteborg, Västa Götalands län, Sverige",
			bounds: new LatLngBounds(
				new LatLng(57.793303, 12.088667),
				new LatLng(57.663544, 11.776529)
			),
		},
	},
	// {
	//   id: 'default-ruka',
	//   predictionPlace: {
	//     address: 'Ruka, Finland',
	//     bounds: new LatLngBounds(new LatLng(66.16997, 29.16773), new LatLng(66.16095, 29.13572)),
	//   },
	// },
];
export default defaultLocations;
