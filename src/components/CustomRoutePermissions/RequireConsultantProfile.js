import React from "react";
import { NamedRedirect } from "../.";
import { draftId, draftSlug } from "../../routing/routeConfiguration";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER IS OF TYPE "consultant"
// and
// THE USER HAS NOT CREATED A LISTING
const RequireConsultantProfile = ({ currentUser, childProps }) => {
	const isConsultantWithPost =
		currentUser.attributes?.profile?.publicData?.hasListing &&
		currentUser.attributes?.profile?.publicData?.userType === "consultant";

	if (!isConsultantWithPost) {
		return (
			<NamedRedirect
				name="EditListingPage"
				{...childProps}
				params={{
					slug: draftSlug,
					id: draftId,
					type: "new",
					tab: "details",
				}}
			/>
		);
	}
};

export default RequireConsultantProfile;
