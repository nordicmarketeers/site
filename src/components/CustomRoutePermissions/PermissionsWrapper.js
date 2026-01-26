import React from "react";
import { NamedRedirect } from "../.";
import { useSelector } from "react-redux";

// Global auth checkers
import RequireEmailVerify from "./RequireEmailVerify";

// Customer auth checkers
import RequireCustomerPermission from "./RequireCustomerPermission";

// Consultant auth checkers
import RequireNoConsultantPost from "./RequireNoConsultantPosts";
import RequireConsultantProfile from "./RequireConsultantProfile";

// IMPORTANT: Place checks in order of importance, the order you'd want them to trigger
const authList = [
	{
		// Deny if user IS NOT logged in
		check: ({ currentUser }) => {
			if (!currentUser) return <NamedRedirect name="LoginPage" />;
		},
		type: "global",
		pages: ["EditListingPage"],
	},
	{
		// Deny if user HAS NOT verified their email address
		check: RequireEmailVerify,
		type: "global",
		pages: ["EditListingPage"],
	},
	{
		// Deny if customer DOES NOT have permissions
		check: RequireCustomerPermission,
		type: "customer",
		pages: ["EditListingPage"],
	},
	{
		// Deny if constultant HAS NOT made a post (force onboarding)
		check: RequireConsultantProfile,
		type: "consultant",
		pages: [
			"LandingPage",
			"CMSPage",
			"SearchPage",
			"MakeOfferPage",
			"ProfilePage",
			"ProfileSettingsPage",
			"InboxPage",
			"ManageListingsPage",
		],
	},
	{
		// Deny if consultant HAS made a post
		check: RequireNoConsultantPost,
		type: "consultant",
		pages: ["EditListingPage"],
	},
];

// Wraps around routes inside of routeConfiguration
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
			failedCheck = auth.check({ currentUser, childProps });
		}
	});

	if (failedCheck) return failedCheck;

	return children;
};

export default PermissionsWrapper;
