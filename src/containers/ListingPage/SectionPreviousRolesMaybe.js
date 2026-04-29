import React from 'react';
import { Heading } from '../../components';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';
import classNames from 'classnames';

const MONTH_MAP = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  maj: 4,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  okt: 9,
  nov: 10,
  dec: 11,
};

const parseFreeTextDate = (input = '') => {
  if (!input || typeof input !== 'string') {
    return { year: -Infinity, month: -Infinity, isNow: false };
  }

  const normalized = input.trim().toLowerCase();

  if (['nu', 'now'].includes(normalized)) {
    return { year: Infinity, month: Infinity, isNow: true };
  }

  // Extract year
  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : -Infinity;

  // Extract month token
  const monthMatch = normalized.match(/[a-zåäö]{3,}/i);
  let month = -Infinity;

  if (monthMatch) {
    const key = monthMatch[0].slice(0, 3).toLowerCase();
    if (MONTH_MAP[key] !== undefined) {
      month = MONTH_MAP[key];
    }
  }

  return { year, month, isNow: false };
};

const compareEndingDates = (a, b) => {
  const aParsed = parseFreeTextDate(a.ending_date);
  const bParsed = parseFreeTextDate(b.ending_date);

  // "Nu" / "Now" first
  if (aParsed.isNow && !bParsed.isNow) return -1;
  if (!aParsed.isNow && bParsed.isNow) return 1;

  // Compare year
  if (aParsed.year !== bParsed.year) {
    return bParsed.year - aParsed.year;
  }

  // Compare month
  return bParsed.month - aParsed.month;
};

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
    return;
  }

  blocks = [...blocks].sort(compareEndingDates);

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
