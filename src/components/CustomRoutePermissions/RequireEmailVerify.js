import React from "react";
import { NamedRedirect } from "../.";
import { useSelector } from "react-redux";

// BLOCK THE USER FROM THE ROUTE IF:
// THE USER HAS NOT VERIFIED THEIR EMAIL ADDRESS
const RequireEmailVerify = ({ children }) => {
	const currentUser = useSelector(state => state.user.currentUser);

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
