import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './TabNav.module.css';

const getCurrentInnerTitle = () => {
  const headings = [...document.querySelectorAll('h4[data-consultant-inner-title]')];

  if (!headings.length) return null;

  // Make up for sticky elements at the top
  const stickyOffset = 300;

  let currentHeading = headings[0];

  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect();

    if (rect.top <= stickyOffset) {
      currentHeading = heading;
    }
  });

  return currentHeading;
};

const Tab = props => {
  const { className, id, disabled, text, selected, linkProps, isHeading } = props;
  const linkClasses = classNames(css.link, {
    [css.selectedLink]: selected,
    [css.disabled]: disabled,
    [css.heading]: isHeading,
  });

  return (
    <div id={id} className={className}>
      <NamedLink className={linkClasses} {...linkProps}>
        {text}
      </NamedLink>
    </div>
  );
};

const SubTab = props => {
  const { subTab, onSubTabClick, className } = props;

  const [isSelected, setIsSelected] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentHeading = getCurrentInnerTitle();

          const isCurrent =
            subTab.targetTitleText?.toLowerCase() === currentHeading?.textContent?.toLowerCase();

          setIsSelected(isCurrent ? css.selectedSubTab : null);

          ticking = false;
        });

        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [subTab]);

  return (
    <div className={className}>
      <p
        onClick={() => onSubTabClick(subTab)}
        className={classNames(css.link, css.subTab, isSelected)}
      >
        {subTab.labelKey}
      </p>
    </div>
  );
};

/**
 * @typedef {Object} TabConfig
 * @property {string} text - The text to be rendered in the tab
 * @property {boolean} disabled - Whether the tab is disabled
 * @property {boolean} selected - Whether the tab is selected
 * @property {Object} linkProps - The props to be passed to the link component
 * @property {string} linkProps.name - The name of the link
 * @property {string} linkProps.params - The path params to be passed to the link component
 * @property {string} linkProps.to - The rest of the URL params neede
 */

/**
 * A component that renders a tab navigation.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {string} [props.tabRootClassName] - Custom class that overrides the default class for the tab element
 * @param {Array<TabConfig>} props.tabs - The tabs to render
 * @returns {JSX.Element}
 */
const TabNav = props => {
  const {
    className,
    rootClassName,
    tabRootClassName,
    tabs,
    ariaLabel,
    isHeading,
    onSubTabClick,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const tabClasses = tabRootClassName || css.tab;
  return (
    <nav className={classes} aria-label={ariaLabel}>
      {tabs.map((tab, index) => {
        const id = typeof tab.id === 'string' ? tab.id : `${index}`;

        return (
          <React.Fragment key={id}>
            <Tab
              id={id}
              className={tabClasses}
              {...tab}
              isHeading={isHeading ? isHeading : tab.isHeading}
            />

            {tab.subTabs &&
              tab.subTabs.map((subTab, index) => {
                return (
                  <SubTab
                    key={subTab.key || index}
                    subTab={subTab}
                    onSubTabClick={onSubTabClick}
                    className={tabClasses}
                  />
                );
              })}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default TabNav;
