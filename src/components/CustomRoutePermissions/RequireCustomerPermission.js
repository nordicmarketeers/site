import React from "react";
import { NamedRedirect } from "../.";
import {
	NO_ACCESS_PAGE_INITIATE_TRANSACTIONS,
	NO_ACCESS_PAGE_POST_LISTINGS,
	NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
	NO_ACCESS_PAGE_VIEW_LISTINGS,
} from "../../util/urlHelpers";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER IS OF TYPE "customer"
// and
// THE USER DOES NOT HAVE TRANSACTION PERMISSIONS
const RequireCustomerPermission = ({ currentUser }) => {
	const isUnauthedCustomer =
		currentUser.effectivePermissionSet?.attributes?.initiateTransactions ===
			"permission/deny" &&
		currentUser.attributes?.profile?.publicData?.userType === "customer";

	if (isUnauthedCustomer) {
		return (
			<NamedRedirect
				name="NoAccessPage"
				params={{
					scrollingDisabled: false,
					currentUser,
					missingAccessRight: NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
				}}
			/>
		);
	}
};

export default RequireCustomerPermission;
