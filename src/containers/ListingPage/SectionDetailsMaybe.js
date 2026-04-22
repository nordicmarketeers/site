import React from 'react';

import { FormattedMessage } from '../../util/reactIntl';
import { isFieldForListingType } from '../../util/fieldHelpers';

import { Heading } from '../../components';

import css from './ListingPage.module.css';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { capitalize } from '../../util/listingCardHelpers';

const SectionDetailsMaybe = props => {
  const { publicData, metadata = {}, listingFieldConfigs, isFieldForCategory, intl } = props;

  const [showOther, setShowOther] = React.useState(false);
  const [showLanguages, setShowLanguages] = React.useState(false);
  const [showExtent, setShowExtent] = React.useState(false);

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

  return existingListingFields.length > 0 ? (
    <section className={css.sectionDetails}>
      <Heading as="h2" rootClassName={css.sectionHeading}>
        <FormattedMessage id="ListingPage.detailsTitle" />
      </Heading>
      <ul className={css.details}>
        {/* EXTENT */}
        {detailsMenus.extent_profile && (
          <li className={css.detailsRow} onClick={() => setShowExtent(!showExtent)}>
            <span className={css.detailLabel}>Omfattning</span>
            <span>{showExtent ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
          </li>
        )}
        {showExtent &&
          detailsMenus.extent_profile.map((extent, i) => (
            <li key={extent + i} className={css.detailsRow}>
              <span>{capitalize(extent)}</span>
            </li>
          ))}

        {/* LANGUAGES */}
        {detailsMenus.languages && (
          <li className={css.detailsRow} onClick={() => setShowLanguages(!showLanguages)}>
            <span className={css.detailLabel}>Språk</span>
            <span>{showLanguages ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
          </li>
        )}
        {showLanguages &&
          detailsMenus.languages.map((language, i) => (
            <li key={language + i} className={css.detailsRow}>
              <span>{capitalize(language)}</span>
            </li>
          ))}

        <li className={css.detailsRow} onClick={() => setShowOther(!showOther)}>
          <span className={css.detailLabel}>Övrigt</span>
          <span>{showOther ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
        </li>
        {showOther &&
          existingListingFields.map(detail => (
            <li key={detail.key} className={css.detailsRow}>
              <span className={css.detailLabel}>{detail.label}</span>
              <span>{detail.value}</span>
            </li>
          ))}
      </ul>
    </section>
  ) : null;
};

export default SectionDetailsMaybe;
