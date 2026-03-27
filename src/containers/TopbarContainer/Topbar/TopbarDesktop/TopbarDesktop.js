import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { FormattedMessage } from '../../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES, draftId, draftSlug } from '../../../../routing/routeConfiguration';
import {
  Avatar,
  InlineTextButton,
  LinkedLogo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
} from '../../../../components';

import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';
import CustomLinksMenu from './CustomLinksMenu/CustomLinksMenu';

import css from './TopbarDesktop.module.css';
import {
  isConsultant,
  isConsultantWithPost,
  isCustomer,
  isUnauthedCustomer,
} from '../../../../util/userTypeHelper';

const SignupLink = () => {
  return (
    <NamedLink id="signup-link" name="SignupPage" className={css.topbarLink}>
      <span className={css.topbarLinkLabel}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );
};

const LoginLink = () => {
  return (
    <NamedLink id="login-link" name="LoginPage" className={css.topbarLink}>
      <span className={css.topbarLinkLabel}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );
};

const ProfileMenu = ({
  currentPage,
  currentUser,
  onLogout,
  showManageListingsLink,
  intl,
  location,
  notificationCount,
  inboxTab,
}) => {
  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    const isConsultantCreatingProfile =
      page === 'EditListingPage' &&
      !isConsultantWithPost(currentUser) &&
      location.pathname.includes('draft');
    const isConsultantProfile =
      page === 'ListingPage' &&
      isConsultantWithPost(currentUser) &&
      location.pathname.includes(currentUser.attributes?.profile?.publicData?.latestListing) &&
      !location.pathname.includes('edit');
    const isInboxPage = page === 'InboxPage' && location.pathname.includes('/inbox');
    return currentPage === page ||
      isAccountSettingsPage ||
      isConsultantProfile ||
      isConsultantCreatingProfile ||
      isInboxPage
      ? css.currentPage
      : null;
  };

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  return (
    <Menu skipFocusOnNavigation={true}>
      <MenuLabel
        id="profile-menu-label"
        className={css.profileMenuLabel}
        isOpenClassName={css.profileMenuIsOpen}
        ariaLabel={intl.formatMessage({
          id: 'TopbarDesktop.screenreader.profileMenu',
        })}
      >
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="InboxPage">
          <NamedLink
            id="inbox-link"
            name="InboxPage"
            params={{ tab: inboxTab }}
            className={classNames(css.menuLink, currentPageClass('InboxPage'))}
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.inbox" />
            {notificationDot}
          </NamedLink>
        </MenuItem>
        {showManageListingsLink ? (
          <MenuItem key="ManageListingsPage">
            {currentUser && isCustomer(currentUser) && (
              <NamedLink
                className={classNames(css.menuLink, currentPageClass('ManageListingsPage'))}
                name="ManageListingsPage"
              >
                <span className={css.menuItemBorder} />
                <FormattedMessage id="TopbarDesktop.yourListingsLink" />
              </NamedLink>
            )}

            {currentUser && isConsultant(currentUser) && (
              <NamedLink
                className={classNames(css.menuLink, currentPageClass('EditListingPage'))}
                name="EditListingPage"
                params={{
                  id: isConsultantWithPost(currentUser)
                    ? currentUser.attributes?.profile?.publicData?.latestListing
                    : draftId,
                  slug: isConsultantWithPost(currentUser) ? 'slug' : draftSlug,
                  type: isConsultantWithPost(currentUser) ? 'edit' : 'new',
                  tab: 'details',
                }}
                currentUser={currentUser}
              >
                <span className={css.menuItemBorder} />
                <FormattedMessage id="TopbarDesktop.yourListingsLink" />
              </NamedLink>
            )}
          </MenuItem>
        ) : null}
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.menuLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

/**
 * Topbar for desktop layout
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {CurrentUser} props.currentUser API entity
 * @param {string?} props.currentPage
 * @param {boolean} props.isAuthenticated
 * @param {number} props.notificationCount
 * @param {Function} props.onLogout
 * @param {Function} props.onSearchSubmit
 * @param {Object?} props.initialSearchFormValues
 * @param {Object} props.intl
 * @param {Object} props.config
 * @param {boolean} props.showSearchForm
 * @param {boolean} props.showCreateListingsLink
 * @param {string} props.inboxTab
 * @returns {JSX.Element} search icon
 */
const TopbarDesktop = props => {
  let {
    className,
    config,
    customLinks,
    currentUser,
    currentPage,
    rootClassName,
    notificationCount = 0,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues = {},
    showSearchForm,
    showCreateListingsLink: rawShowCreateListingsLink,
    inboxTab,
    location,
  } = props;
  const [mounted, setMounted] = useState(false);
  showSearchForm = false;

  const showCreateListingsLink = rawShowCreateListingsLink && !isConsultant(currentUser);

  useEffect(() => {
    setMounted(true);
  }, []);

  const marketplaceName = config.marketplaceName;
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const giveSpaceForSearch = customLinks == null || customLinks?.length === 0;
  const classes = classNames(rootClassName || css.root, className);

  const profileMenuMaybe = authenticatedOnClientSide ? (
    <ProfileMenu
      currentPage={currentPage}
      currentUser={currentUser}
      onLogout={onLogout}
      showManageListingsLink={true}
      intl={intl}
      location={location}
      notificationCount={notificationCount}
      inboxTab={inboxTab}
    />
  ) : null;

  const signupLinkMaybe = isAuthenticatedOrJustHydrated ? null : <SignupLink />;
  const loginLinkMaybe = isAuthenticatedOrJustHydrated ? null : <LoginLink />;

  const searchFormMaybe = showSearchForm ? (
    <TopbarSearchForm
      className={classNames(css.searchLink, {
        [css.takeAvailableSpace]: giveSpaceForSearch,
      })}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
      appConfig={config}
    />
  ) : (
    <div
      className={classNames(css.spacer, css.topbarSearchWithLeftPadding, {
        [css.takeAvailableSpace]: giveSpaceForSearch,
      })}
    />
  );

  return (
    <nav
      className={classes}
      aria-label={intl.formatMessage({
        id: 'TopbarDesktop.screenreader.topbarNavigation',
      })}
    >
      <LinkedLogo
        id="logo-topbar-desktop"
        className={css.logoLink}
        layout="desktop"
        alt={intl.formatMessage({ id: 'TopbarDesktop.logo' }, { marketplaceName })}
        linkToExternalSite={config?.topbar?.logoLink}
      />
      {searchFormMaybe}

      <CustomLinksMenu
        currentPage={currentPage}
        customLinks={customLinks}
        intl={intl}
        hasClientSideContentReady={authenticatedOnClientSide || !isAuthenticatedOrJustHydrated}
        showCreateListingsLink={showCreateListingsLink}
      />

      {profileMenuMaybe}
      {signupLinkMaybe}
      {loginLinkMaybe}
    </nav>
  );
};

export default TopbarDesktop;
