import React from "react";
import { NamedRedirect } from "../.";

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
