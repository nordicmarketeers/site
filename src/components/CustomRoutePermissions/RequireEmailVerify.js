import React from "react";
import { NamedRedirect } from "../.";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER HAS NOT VERIFIED THEIR EMAIL ADDRESS
const RequireEmailVerify = ({ currentUser }) => {
	const isNotVerified = !currentUser?.attributes?.emailVerified;

	if (isNotVerified) {
		return <NamedRedirect name="SignupPage" />;
	}
};

export default RequireEmailVerify;
