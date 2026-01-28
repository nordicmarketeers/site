import React from "react";
import { FormattedMessage, useIntl } from "../../util/reactIntl";
import classNames from "classnames";
import {
	ACCOUNT_SETTINGS_PAGES,
	draftId,
	draftSlug,
} from "../../routing/routeConfiguration";
import { LinkTabNavHorizontal } from "../../components";

import css from "./UserNav.module.css";
import {
	isConsultant,
	isConsultantWithPost,
	isCustomer,
} from "../../util/userTypeHelper";
import { useSelector } from "react-redux";

/**
 * A component that renders a navigation bar for a user-specific pages.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {string} props.currentPage - The current page (e.g. 'ManageListingsPage')
 * @returns {JSX.Element} User navigation component
 */
const UserNav = props => {
	const {
		className,
		rootClassName,
		currentPage,
		showManageListingsLink,
	} = props;
	const intl = useIntl();
	const classes = classNames(rootClassName || css.root, className);
	const currentUser = useSelector(state => state.user.currentUser);

	const manageListingsTabMaybe =
		showManageListingsLink && isCustomer(currentUser)
			? [
					{
						text: <FormattedMessage id="UserNav.yourListings" />,
						selected: currentPage === "ManageListingsPage",
						linkProps: {
							name: "ManageListingsPage",
						},
					},
			  ]
			: [];

	const consultantProfileMaybe =
		showManageListingsLink && isConsultantWithPost(currentUser)
			? [
					{
						text: <FormattedMessage id="UserNav.yourListings" />,
						selected: currentPage === "ListingPage",
						linkProps: {
							name: "ListingPage",
							params: {
								id: currentUser.attributes.latestListing,
								slug: "slug",
							},
						},
					},
			  ]
			: [];

	const createConsultantProfileMaybe =
		showManageListingsLink &&
		isConsultant(currentUser) &&
		!isConsultantWithPost(currentUser)
			? [
					{
						text: <FormattedMessage id="UserNav.yourListings" />,
						selected: currentPage === "EditListingPage",
						linkProps: {
							name: "EditListingPage",
							params: {
								id: draftId,
								slug: draftSlug,
								type: "new",
								tab: "details",
							},
						},
					},
			  ]
			: [];

	const tabs = [
		...manageListingsTabMaybe,
		...consultantProfileMaybe,
		...createConsultantProfileMaybe,
		{
			text: <FormattedMessage id="UserNav.profileSettings" />,
			selected: currentPage === "ProfileSettingsPage",
			disabled: false,
			linkProps: {
				name: "ProfileSettingsPage",
			},
		},
		{
			text: <FormattedMessage id="UserNav.accountSettings" />,
			selected: ACCOUNT_SETTINGS_PAGES.includes(currentPage),
			disabled: false,
			linkProps: {
				name: "ContactDetailsPage",
			},
		},
	];

	return (
		<LinkTabNavHorizontal
			className={classes}
			tabRootClassName={css.tab}
			tabs={tabs}
			skin="dark"
			ariaLabel={intl.formatMessage({
				id: "UserNav.screenreader.userNav",
			})}
		/>
	);
};

export default UserNav;
