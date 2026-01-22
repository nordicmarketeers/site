import React from "react";
import { NamedRedirect } from "../.";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER HAS NOT VERIFIED THEIR EMAIL ADDRESS
const RequireEmailVerify = ({ currentUser, children }) => {
	if (!currentUser) {
		return <NamedRedirect name="LoginPage" />;
	}

	const isNotVerified = !currentUser.attributes?.emailVerified;

	if (isNotVerified) {
		return <NamedRedirect name="SignupPage" />;
	}

	return children;
};

export default RequireEmailVerify;
