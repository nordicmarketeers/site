import { addMarketplaceEntities } from "../../../ducks/marketplaceData.duck";
import { util as sdkUtil } from "../../../util/sdkLoader";
import { createImageVariantConfig } from "../../../util/sdkLoader";

/**
 * Fetch a single listing by ID
 */
export const fetchListingById = listingId => (dispatch, getState, sdk) => {
	if (!listingId) return Promise.resolve();

	// Check if we already have it in state
	// TODO: Maybe use this, was causing issues.
	// const existing = getState().marketplaceData.entities.listing?.[listingId];
	// if (existing) return Promise.resolve(existing);

	const aspectWidth = 1,
		aspectHeight = 1,
		variantPrefix = "listing-card";

	const aspectRatio = aspectHeight / aspectWidth;
	console.log("Fetching listing", listingId);

	return sdk.listings
		.show({
			id: listingId,
			include: ["author", "images", "author.profileImage"],
			"fields.listing": [
				"title",
				"description",
				"geolocation",
				"location",
				"price",
				"deleted",
				"state",
				"publicData.approved",
				"publicData.languages",
				"publicData.listingType",
				"publicData.transactionProcessAlias",
				"publicData.unitType",
				"publicData.cardStyle",
				"publicData.role",
				"publicData.work_model",
				"publicData.extent_job",
				"publicData.extent_profile",
				"publicData.part_time_percent",
				"publicData.senior_level",
				"publicData.location",
				"publicData.pickupEnabled",
				"publicData.shippingEnabled",
				"publicData.priceVariationsEnabled",
				"publicData.priceVariants",
			],
			"fields.image": [
				"variants.scaled-small",
				"variants.scaled-medium",
				`variants.${variantPrefix}`,
				`variants.${variantPrefix}-2x`,
			],
			...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
			...createImageVariantConfig(
				`${variantPrefix}-2x`,
				800,
				aspectRatio
			),
			"limit.images": 1,
			"fields.user": [
				"profile.displayName",
				"profile.abbreviatedName",
				"profile.profileImage",
			],
			"fields.image": [
				"variants.square-small",
				"variants.square-small2x",
				"variants.square-xsmall",
				"variants.square-xsmall2x",
			],
			"imageVariant.square-xsmall": sdkUtil.objectQueryString({
				w: 40,
				h: 40,
				fit: "crop",
			}),
			"imageVariant.square-xsmall2x": sdkUtil.objectQueryString({
				w: 80,
				h: 80,
				fit: "crop",
			}),
		})
		.then(listing => {
			// Use this if deciding to use thing above in function
			// if (listing) {
			// 	dispatch(addMarketplaceEntities(listing));
			// }
			return listing;
		})
		.catch(err => {
			console.error("Error fetching listing", listingId, err);
			return null;
		});
};

/**
 * Fetch multiple listings by ID array
 */
export const fetchListingsByIds = listingIds => async dispatch => {
	const listings = await Promise.all(
		listingIds.map(id => dispatch(fetchListingById(id)))
	);

	if (listings === null) return null;

	const cleanListings = listings.flatMap(res => {
		const listing = res.data?.data;
		const included = res.data?.included || [];

		if (!listing) return [];

		// Get author
		const authorId = listing.relationships?.author?.data?.id?.uuid;
		const author =
			included.find(i => i.type === "user" && i.id.uuid === authorId) ||
			null;

		// Author's profile image
		const profileImageId =
			author?.relationships?.profileImage?.data?.id?.uuid;
		const profileImage =
			included.find(
				i => i.type === "image" && i.id.uuid === profileImageId
			) || null;

		return [
			{
				id: listing.id,
				type: listing.type,
				attributes: { ...listing.attributes, ...listing.publicData },
				author: author
					? {
							id: author.id,
							type: author.type,
							attributes: { ...author.attributes },
							profileImage: profileImage || null,
					  }
					: null,
				images: listing.relationships?.images?.data || [],
			},
		];
	});

	console.log(cleanListings);

	console.log("Fetched listings: ", cleanListings);
	return cleanListings;
};
