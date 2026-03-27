import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { useConfiguration } from '../../context/configurationContext';

import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import { H3 } from '../../components';

import css from './ListingDashboardPage.module.css';

/**
 * @param {Object} props
 * @param {propTypes.currentUser} [props.currentUser] - The current user
 * @returns {JSX.Element}
 */
export const ListingDashboardPageComponent = props => {
  const config = useConfiguration();
  const intl = useIntl();
  const { currentUser } = props;

  const title = intl.formatMessage({ id: 'UserNav.yourListings' });

  return (
    <main title={title} className={css.panel}>
      <div>
        <H3 as="h1">
          <FormattedMessage id="UserNav.yourListings" />
        </H3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </div>
    </main>
  );
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const { currentUser } = state.user;

  return {
    currentUser,
  };
};

const ListingDashboardPage = compose(connect(mapStateToProps))(ListingDashboardPageComponent);

export default ListingDashboardPage;
