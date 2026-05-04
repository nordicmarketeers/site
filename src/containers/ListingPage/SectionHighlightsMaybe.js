import React from 'react';
import { Heading } from '../../components';

import css from './ListingPage.module.css';
import classNames from 'classnames';
import { parseToObjectArray } from '../../util/parseHelper';

import { GoNorthStar } from 'react-icons/go';

const SectionHighlightsMaybe = props => {
  let { text, heading } = props;

  // Parse the highlights
  text = parseToObjectArray(text)?.[0];

  if (!text || (!text.text_third && !text.text_fourth)) return null;

  return (
    <section className={css.sectionText}>
      {heading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      ) : null}

      <div className={css.highlightsWrapper}>
        {text.text_third && (
          <p>
            <GoNorthStar /> {text.text_third}
          </p>
        )}
        {text.text_fourth && (
          <p>
            <GoNorthStar /> {text.text_fourth}
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionHighlightsMaybe;
