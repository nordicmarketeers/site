import React from "react";
import { NamedRedirect } from "../.";
import {
	NO_ACCESS_PAGE_INITIATE_TRANSACTIONS,
	NO_ACCESS_PAGE_POST_LISTINGS,
	NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
	NO_ACCESS_PAGE_VIEW_LISTINGS,
} from "../../util/urlHelpers";
import { useSelector } from "react-redux";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER IS OF TYPE "consultant"
// and
// THE USER HAS CREATED A LISTING
const RequireNoConsultantPost = ({ children, childProps }) => {
	const currentUser = useSelector(state => state.user.currentUser);

	// Allow "edit", not "new"
	const actionType = childProps?.params.type;

	if (!currentUser) {
		return <NamedRedirect name="LoginPage" />;
	}

	const isConsultantWithPost =
		currentUser.attributes?.hasListings &&
		currentUser.attributes?.profile?.publicData?.userType ===
			"consultant" &&
		actionType === "new";

	if (isConsultantWithPost) {
		return (
			<NamedRedirect
				name="NoAccessPage"
				params={{
					scrollingDisabled: false,
					currentUser,
					missingAccessRight: NO_ACCESS_PAGE_POST_LISTINGS,
				}}
			/>
		);
	}

	return children;
};

export default RequireNoConsultantPost;
