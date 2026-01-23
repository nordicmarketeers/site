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
// THE USER IS OF TYPE "customer"
// and
// THE USER DOES NOT HAVE TRANSACTION PERMISSIONS
const RequireCustomerPermission = ({ children }) => {
	console.log("From customerpermission");
	const currentUser = useSelector(state => state.user.currentUser);

	if (!currentUser) {
		return <NamedRedirect name="LoginPage" />;
	}

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

	return children;
};

export default RequireCustomerPermission;
