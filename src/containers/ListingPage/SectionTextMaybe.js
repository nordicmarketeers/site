import React, { useState, useRef, useLayoutEffect } from 'react';
import { Heading } from '../../components';
import { richText } from '../../util/richText';
import classNames from 'classnames';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

const SectionTextMaybe = props => {
  const { text, heading, showAsIngress = false, readMoreLines = null } = props;

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const textRef = useRef(null);

  const textClass = showAsIngress ? css.ingress : css.text;

  const content = richText(text, {
    linkify: true,
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
    breakChars: '/',
  });

  const hasReadMore = readMoreLines != null;

  const shouldCollapse = hasReadMore && !expanded;

  useLayoutEffect(() => {
    if (!hasReadMore || !textRef.current) return;

    const el = textRef.current;

    const isOverflow = el.scrollHeight > el.clientHeight;

    setIsOverflowing(isOverflow);
  }, [text, readMoreLines]);

  const maxHeightStyle = hasReadMore
    ? {
        maxHeight: shouldCollapse ? `${readMoreLines * 2.1}em` : '1000px',
      }
    : undefined;

  return (
    <section className={css.sectionText}>
      {heading && (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      )}

      <div
        ref={textRef}
        className={classNames(css.readMoreWrapper, {
          [css.readMoreCollapsed]: shouldCollapse,
        })}
        style={maxHeightStyle}
      >
        <p className={textClass}>{content}</p>

        {shouldCollapse && isOverflowing && <div className={css.readMoreGradient} />}
      </div>

      {hasReadMore && isOverflowing && (
        <button className={css.readMoreButton} onClick={() => setExpanded(prev => !prev)}>
          {expanded ? 'Läs mindre' : 'Läs mer'}
        </button>
      )}
    </section>
  );
};

export default SectionTextMaybe;
