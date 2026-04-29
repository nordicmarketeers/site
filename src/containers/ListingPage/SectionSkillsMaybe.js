import React, { useState, useRef, useLayoutEffect } from 'react';
import { Heading } from '../../components';
import classNames from 'classnames';

import css from './ListingPage.module.css';

const SectionSkillsMaybe = props => {
  const { heading, options, selectedOptions } = props;

  const selectedFinal = selectedOptions
    .map(key => options.find(opt => opt.key === key))
    .filter(Boolean);
  if (!selectedFinal.length) return;

  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      const firstChild = el.firstChild;
      if (!firstChild) return;

      const rowHeight = firstChild.getBoundingClientRect().height;
      const totalHeight = el.scrollHeight;

      setHasOverflow(totalHeight > rowHeight * 1.5);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    measure();

    return () => observer.disconnect();
  }, [selectedFinal]);

  return (
    <section className={css.sectionText}>
      {heading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {heading}
        </Heading>
      ) : null}
      {selectedFinal && (
        <>
          <div
            ref={wrapperRef}
            className={classNames(
              css.skillsWrapper,
              expanded ? css.skillsExpanded : css.skillsCollapsed
            )}
          >
            {selectedFinal.map(option => (
              <p key={option.key} className={css.skillTag}>
                {option.label}
              </p>
            ))}
          </div>

          {hasOverflow && (
            <button className={css.showSkills} onClick={() => setExpanded(prev => !prev)}>
              {expanded ? 'Visa mindre' : 'Visa alla'}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default SectionSkillsMaybe;
