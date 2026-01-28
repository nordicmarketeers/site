import React from "react";
import { NamedRedirect } from "../.";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER IS OF TYPE "consultant"
// and
// THE USER HAS CREATED A LISTING
const RequireNoConsultantPost = ({ currentUser, childProps }) => {
	// Allow "edit", not "new"
	const actionType = childProps?.params.type;

	const isConsultantWithPost =
		currentUser.attributes?.hasListings &&
		currentUser.attributes?.profile?.publicData?.userType ===
			"consultant" &&
		actionType === "new";

	if (isConsultantWithPost) {
		return (
			<NamedRedirect
				name="ListingPage"
				params={{
					id: currentUser.attributes.latestListing,
					slug: "slug",
				}}
			/>
		);
	}
};

export default RequireNoConsultantPost;
