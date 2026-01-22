import React from "react";
import { NamedRedirect } from "../.";

const RequireCustomerPermission = ({ currentUser, children }) => {
	if (!currentUser) {
		return <NamedRedirect name="LoginPage" />;
	}

	const isUnauthedConsultant =
		currentUser.effectivePermissionSet?.attributes?.initiateTransactions ===
			"permission/deny" &&
		currentUser.attributes?.profile?.publicData?.userType === "customer";

	if (isUnauthedConsultant) {
		return <NamedRedirect name="LandingPage" />;
	}

	return children;
};

export default RequireCustomerPermission;
