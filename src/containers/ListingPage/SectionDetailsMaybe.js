import React from 'react';

import { FormattedMessage } from '../../util/reactIntl';
import { isFieldForListingType } from '../../util/fieldHelpers';

import { Heading } from '../../components';

import css from './ListingPage.module.css';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { capitalize } from '../../util/listingCardHelpers';
import classNames from 'classnames';

const SectionDetailsMaybe = props => {
  const { publicData, metadata = {}, listingFieldConfigs, isFieldForCategory, intl } = props;

  const [showOther, setShowOther] = React.useState(false);
  const [showLanguages, setShowLanguages] = React.useState(false);
  const [showExtent, setShowExtent] = React.useState(false);
  const [showToolPlatform, setShowToolPlatform] = React.useState(false);

  if (!publicData || !listingFieldConfigs) {
    return null;
  }

  const pickListingFields = (filteredConfigs, config) => {
    const { key, schemaType, enumOptions, showConfig = {} } = config;
    const listingType = publicData.listingType;
    const isTargetListingType = isFieldForListingType(listingType, config);
    const isTargetCategory = isFieldForCategory(config);

    const { isDetail, label } = showConfig;
    const publicDataValue = publicData[key];
    const metadataValue = metadata[key];
    const value = typeof publicDataValue != null ? publicDataValue : metadataValue;

    if (isDetail && isTargetListingType && isTargetCategory && typeof value !== 'undefined') {
      const findSelectedOption = enumValue => enumOptions?.find(o => enumValue === `${o.option}`);
      const getBooleanMessage = value =>
        value
          ? intl.formatMessage({ id: 'SearchPage.detailYes' })
          : intl.formatMessage({ id: 'SearchPage.detailNo' });
      const optionConfig = findSelectedOption(value);

      return schemaType === 'enum'
        ? filteredConfigs.concat({
            key,
            value: optionConfig?.label,
            label,
          })
        : schemaType === 'boolean'
        ? filteredConfigs.concat({
            key,
            value: getBooleanMessage(value),
            label,
          })
        : schemaType === 'long'
        ? filteredConfigs.concat({ key, value, label })
        : filteredConfigs;
    }
    return filteredConfigs;
  };

  const searchTerms = [
    'certifications',
    'languages',
    'tools_platforms',
    'extent_profile',
    'awards',
  ];

  const detailsMenus = Object.keys(publicData)
    .filter(key => searchTerms.some(term => key.includes(term)))
    .reduce((acc, key) => {
      acc[key] = publicData[key];
      return acc;
    }, {});

  const existingListingFields = listingFieldConfigs.reduce(pickListingFields, []);

  // Parse tools_platforms
  detailsMenus.tools_platforms = (() => {
    try {
      if (!detailsMenus.tools_platforms) return [];

      const parsed = Array.isArray(detailsMenus.tools_platforms)
        ? detailsMenus.tools_platforms
        : JSON.parse(detailsMenus.tools_platforms);

      return Array.isArray(parsed)
        ? parsed.map(item => {
            if (typeof item === 'string') {
              try {
                return JSON.parse(item);
              } catch (e) {
                return {};
              }
            }

            return item || {};
          })
        : [];
    } catch (e) {
      return [];
    }
  })();

  return existingListingFields.length > 0 ? (
    <section className={css.sectionDetails}>
      <Heading as="h2" rootClassName={css.sectionHeading}>
        <FormattedMessage id="ListingPage.detailsTitle" />
      </Heading>
      <ul className={css.details}>
        {/* TOOLS / PLATFORMS */}
        {detailsMenus?.tools_platforms && detailsMenus?.tools_platforms[0]?.tool_platform && (
          <li className={css.detailsRow} onClick={() => setShowToolPlatform(!showToolPlatform)}>
            <span className={classNames(css.detailLabel, css.detailTopLabel)}>
              Verktyg & plattformar
            </span>
            <span>{showToolPlatform ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
          </li>
        )}
        {showToolPlatform &&
          detailsMenus.tools_platforms.map((tool, i) => (
            <li
              key={tool + i}
              className={classNames(css.detailsRow, (i + 1) % 2 !== 0 ? css.rowIsOdd : null)}
            >
              <span className={css.detailLabel}>{tool.tool_platform}</span>
              <span>{tool.level}</span>
            </li>
          ))}

        {/* EXTENT */}
        {detailsMenus?.extent_profile && (
          <li className={css.detailsRow} onClick={() => setShowExtent(!showExtent)}>
            <span className={classNames(css.detailLabel, css.detailTopLabel)}>Omfattning</span>
            <span>{showExtent ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
          </li>
        )}
        {showExtent &&
          detailsMenus.extent_profile.map((extent, i) => (
            <li
              key={extent + i}
              className={classNames(css.detailsRow, (i + 1) % 2 !== 0 ? css.rowIsOdd : null)}
            >
              <span className={css.detailLabel}>{capitalize(extent)}</span>
            </li>
          ))}

        {/* LANGUAGES */}
        {detailsMenus?.languages && (
          <li className={css.detailsRow} onClick={() => setShowLanguages(!showLanguages)}>
            <span className={classNames(css.detailLabel, css.detailTopLabel)}>Språk</span>
            <span>{showLanguages ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
          </li>
        )}
        {showLanguages &&
          detailsMenus.languages.map((language, i) => (
            <li
              key={language + i}
              className={classNames(css.detailsRow, (i + 1) % 2 !== 0 ? css.rowIsOdd : null)}
            >
              <span className={css.detailLabel}>{capitalize(language)}</span>
            </li>
          ))}

        <li className={css.detailsRow} onClick={() => setShowOther(!showOther)}>
          <span className={classNames(css.detailLabel, css.detailTopLabel)}>Övrigt</span>
          <span>{showOther ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
        </li>
        {showOther &&
          existingListingFields.map((detail, i) => (
            <li
              key={detail.key}
              className={classNames(css.detailsRow, (i + 1) % 2 !== 0 ? css.rowIsOdd : null)}
            >
              <span className={css.detailLabel}>{detail.label}</span>
              <span>{detail.value}</span>
            </li>
          ))}
      </ul>
    </section>
  ) : null;
};

export default SectionDetailsMaybe;
