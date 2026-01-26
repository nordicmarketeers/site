import React from "react";
import { NamedRedirect } from "../.";
import { useSelector } from "react-redux";

// Global auth wrappers
import RequireEmailVerify from "./RequireEmailVerify";

// Customer auth wrappers
import RequireCustomerPermission from "./RequireCustomerPermission";

// Consultant auth wrappers
import RequireNoConsultantPost from "./RequireNoConsultantPosts";

// IMPORTANT: Place checks in order of importance, the order you'd want them to trigger
const authList = [
	{
		check: ({ currentUser }) => {
			if (!currentUser) return <NamedRedirect name="LoginPage" />;
		},
		type: "global",
		pages: ["EditListingPage"],
	},
	{
		check: RequireEmailVerify,
		type: "global",
		pages: ["EditListingPage"],
	},
	{
		check: RequireCustomerPermission,
		type: "customer",
		pages: ["EditListingPage"],
	},
	{
		check: RequireNoConsultantPost,
		type: "consultant",
		pages: ["EditListingPage"],
	},
];

// Component meant to prevent clutter inside of routeConfiguration
const PermissionsWrapper = ({ children, childProps, name }) => {
	const currentUser = useSelector(state => state.user.currentUser);

	const userType = currentUser?.attributes?.profile?.publicData?.userType;

	let failedCheck;

	authList.forEach(auth => {
		if (failedCheck) return;

		if (
			auth.pages.includes(name) &&
			(auth.type === userType || auth.type === "global")
		) {
			const authCheck = auth.check({ currentUser, childProps });
			if (authCheck) failedCheck = authCheck;
		}
	});

	if (failedCheck) return failedCheck;

	return children;
};

export default PermissionsWrapper;
