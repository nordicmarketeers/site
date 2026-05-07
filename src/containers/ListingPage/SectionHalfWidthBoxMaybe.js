import React from 'react';
import { Heading } from '../../components';

import css from './ListingPage.module.css';
import classNames from 'classnames';

const SectionHalfWidthBoxMaybe = props => {
  const { heading, options, selectedOptions } = props;

  const selectedFinal = selectedOptions
    .map(key => options.find(opt => opt.key === key))
    .filter(Boolean);
  if (!selectedFinal.length) return;

  return (
    <section className={css.halfWidthBoxWrapper}>
      {heading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      ) : null}
      <ul className={css.halfWidthBoxSelected}>
        {selectedFinal.map(option => (
          <li key={option.key}>{option.label}</li>
        ))}
      </ul>
    </section>
  );
};

export default SectionHalfWidthBoxMaybe;
