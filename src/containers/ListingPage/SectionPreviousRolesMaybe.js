import React from 'react';
import { Heading } from '../../components';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';
import classNames from 'classnames';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

const SectionPreviousRolesMaybe = props => {
  const { text, heading, showAsIngress = false } = props;
  const textClass = showAsIngress ? css.ingress : css.text;

  // Parse the sections
  let blocks = [];
  try {
    blocks = JSON.parse(text || '[]');
    if (!Array.isArray(blocks)) blocks = [];
  } catch {
    blocks = [];
  }

  blocks.forEach(s => {
    if (s.description) {
      s.description = richText(s.description, {
        linkify: true,
        longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
        longWordClass: css.longWord,
        breakChars: '/',
      });
    }
  });

  return text ? (
    <section className={css.sectionText}>
      {heading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      ) : null}
      {blocks.map((s, i) => {
        return (
          <div className={css.previousRoles} key={`${s.company}-${s.title}-${s.start_date}`}>
            {s.title && s.company && (
              <p className={classNames(textClass, css.rolesCompanyTitle)}>
                {`${s.company} `}
                {`∣ ${s.title}`}
              </p>
            )}
            {s.start_date && s.ending_date && s.city && (
              <p className={classNames(textClass, css.rolesCityDate)}>
                {`${s.city}, `}
                {`${s.start_date} -`}
                {` ${s.ending_date}`}
              </p>
            )}
            {s.description && (
              <p className={classNames(textClass, css.rolesDescription)}>{s.description}</p>
            )}
          </div>
        );
      })}
    </section>
  ) : null;
};

export default SectionPreviousRolesMaybe;
