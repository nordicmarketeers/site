import React from 'react';

// Import config and utils
import { useIntl } from '../../util/reactIntl';
import {
  SCHEMA_TYPE_ENUM,
  SCHEMA_TYPE_MULTI_ENUM,
  SCHEMA_TYPE_TEXT,
  SCHEMA_TYPE_LONG,
  SCHEMA_TYPE_BOOLEAN,
  SCHEMA_TYPE_YOUTUBE,
} from '../../util/types';
import {
  required,
  nonEmptyArray,
  validateInteger,
  validateYoutubeURL,
} from '../../util/validators';
// Import shared components
import { FieldCheckboxGroup, FieldSelect, FieldTextInput, FieldBoolean } from '../../components';
// Import modules from this directory
import css from './CustomExtendedDataField.module.css';
import classNames from 'classnames';
import FileUploadPDF from '../FieldUploadPDF/FieldUploadPDF';
import FieldWorkExperience from '../FieldWorkExperience/FieldWorkExperience';
import FieldTools from '../FieldTools/FieldTools';
import FieldLanguages from '../FieldLanguages/FieldLanguages';
import { parseToObjectArray } from '../../util/parseHelper';

const createFilterOptions = options => options.map(o => ({ key: `${o.option}`, label: o.label }));

const getLabel = fieldConfig => fieldConfig?.saveConfig?.label || fieldConfig?.label;

// If field is required, add asterisk and aria-label
const getAccessibleLabel = fieldConfig => {
  const label = getLabel(fieldConfig);
  const isRequired = fieldConfig?.saveConfig?.isRequired;

  if (!isRequired) {
    return label;
  }

  return (
    <>
      {label}{' '}
      <span aria-label="required" role="img">
        *
      </span>
    </>
  );
};

const CustomFieldEnum = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl } = props;
  const { enumOptions = [], saveConfig } = fieldConfig || {};
  const { placeholderMessage, isRequired, requiredMessage } = saveConfig || {};
  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};
  const placeholder =
    placeholderMessage ||
    intl.formatMessage({
      id: 'CustomExtendedDataField.placeholderSingleSelect',
    });
  const filterOptions = createFilterOptions(enumOptions);

  const label = getAccessibleLabel(fieldConfig);

  const defaultValue = 'priv_job_digest' ? 'yes' : null;

  return filterOptions ? (
    <FieldSelect
      className={classNames(css.customField, name === 'pub_part_time_percent' ? css.hide : '')}
      name={name}
      id={formId ? `${formId}.${name}` : name}
      label={label}
      defaultValue={defaultValue}
      {...validateMaybe}
    >
      <option disabled value="">
        {placeholder}
      </option>
      {filterOptions.map(optionConfig => {
        const key = optionConfig.key;
        return (
          <option key={key} value={key}>
            {optionConfig.label}
          </option>
        );
      })}
    </FieldSelect>
  ) : null;
};

const CustomFieldMultiEnum = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId } = props;
  const { enumOptions = [], saveConfig } = fieldConfig || {};
  const { isRequired, requiredMessage } = saveConfig || {};
  const validateMaybe = isRequired
    ? { validate: nonEmptyArray(requiredMessage || defaultRequiredMessage) }
    : {};

  const label = getAccessibleLabel(fieldConfig);

  return enumOptions ? (
    <FieldCheckboxGroup
      className={css.customField}
      id={formId ? `${formId}.${name}` : name}
      name={name}
      label={label}
      options={createFilterOptions(enumOptions)}
      {...validateMaybe}
    />
  ) : null;
};

const CustomFieldText = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl } = props;
  const { placeholderMessage, isRequired, requiredMessage } = fieldConfig?.saveConfig || {};
  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};
  let placeholder =
    placeholderMessage || intl.formatMessage({ id: 'CustomExtendedDataField.placeholderText' });
  let type = 'textarea';

  const label = getAccessibleLabel(fieldConfig);

  // Custom types and placeholder for input fields
  switch (name) {
    case 'pub_availability':
      type = 'text';
      placeholder = 'Nu / dd-mm-yyy';
  }

  return (
    <FieldTextInput
      className={css.customField}
      id={formId ? `${formId}.${name}` : name}
      name={name}
      type={type || 'textarea'}
      label={label}
      placeholder={placeholder}
      {...validateMaybe}
    />
  );
};

const CustomFieldLong = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl } = props;
  const { minimum, maximum, saveConfig } = fieldConfig;
  const { placeholderMessage, isRequired, requiredMessage } = saveConfig || {};
  const placeholder =
    placeholderMessage || intl.formatMessage({ id: 'CustomExtendedDataField.placeholderLong' });
  const numberTooSmallMessage = intl.formatMessage(
    { id: 'CustomExtendedDataField.numberTooSmall' },
    { min: minimum }
  );
  const numberTooBigMessage = intl.formatMessage(
    { id: 'CustomExtendedDataField.numberTooBig' },
    { max: maximum }
  );

  const label = getAccessibleLabel(fieldConfig);

  // Field with schema type 'long' will always be validated against min & max
  const validate = (value, min, max) => {
    const requiredMsg = requiredMessage || defaultRequiredMessage;
    return isRequired && value == null
      ? requiredMsg
      : validateInteger(value, max, min, numberTooSmallMessage, numberTooBigMessage);
  };

  return (
    <FieldTextInput
      className={css.customField}
      id={formId ? `${formId}.${name}` : name}
      name={name}
      type="number"
      step="1"
      parse={value => {
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
      }}
      label={label}
      placeholder={placeholder}
      validate={value => validate(value, minimum, maximum)}
      onWheel={e => {
        // fix: number input should not change value on scroll
        if (e.target === document.activeElement) {
          // Prevent the input value change, because we prefer page scrolling
          e.target.blur();

          // Refocus immediately, on the next tick (after the current function is done)
          setTimeout(() => {
            e.target.focus();
          }, 0);
        }
      }}
    />
  );
};

const CustomFieldBoolean = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl } = props;
  const { placeholderMessage, isRequired, requiredMessage } = fieldConfig?.saveConfig || {};
  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};
  const placeholder =
    placeholderMessage ||
    intl.formatMessage({
      id: 'CustomExtendedDataField.placeholderBoolean',
    });

  const label = getAccessibleLabel(fieldConfig);

  return (
    <FieldBoolean
      className={css.customField}
      id={formId ? `${formId}.${name}` : name}
      name={name}
      label={label}
      placeholder={placeholder}
      {...validateMaybe}
    />
  );
};

const CustomFieldYoutube = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl } = props;
  const { placeholderMessage, isRequired, requiredMessage } = fieldConfig?.saveConfig || {};
  const label = getAccessibleLabel(fieldConfig);
  const placeholder =
    placeholderMessage ||
    intl.formatMessage({
      id: 'CustomExtendedDataField.placeholderYoutubeVideoURL',
    });

  const notValidUrlMessage = intl.formatMessage({
    id: 'CustomExtendedDataField.notValidYoutubeVideoURL',
  });

  const validate = value => {
    const requiredMsg = requiredMessage || defaultRequiredMessage;
    return isRequired && value == null
      ? requiredMsg
      : validateYoutubeURL(value, notValidUrlMessage);
  };

  return (
    <FieldTextInput
      className={css.customField}
      id={formId ? `${formId}.${name}` : name}
      name={name}
      type="text"
      label={label}
      placeholder={placeholder}
      validate={value => validate(value)}
    />
  );
};

const CustomFieldFileUploadPDF = props => {
  const {
    name,
    fieldConfig,
    defaultRequiredMessage,
    formId,
    intl,
    pdfUploaderRef,
    pendingFiles,
    setPendingFiles,
    toDeletePaths,
    setToDeletePaths,
  } = props;

  const { placeholderMessage, isRequired, requiredMessage } = fieldConfig?.saveConfig || {};
  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};
  const placeholder = placeholderMessage || null;

  const label = getAccessibleLabel(fieldConfig);

  return (
    <FileUploadPDF
      className={css.customField}
      id={formId ? `${formId}.${name}` : name}
      name={name}
      label={label}
      placeholder={placeholder}
      {...validateMaybe}
      fieldConfig={fieldConfig}
      intl={intl}
      pdfUploaderRef={pdfUploaderRef}
      pendingFiles={pendingFiles}
      setPendingFiles={setPendingFiles}
      toDeletePaths={toDeletePaths}
      setToDeletePaths={setToDeletePaths}
      ref={pdfUploaderRef}
    />
  );
};

const CustomFieldWorkExperience = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl, initialValues = {} } = props;
  const { isRequired, requiredMessage } = fieldConfig?.saveConfig || {};

  // Parse initival values from string to proper array of objects
  const parsedInitialValues = parseToObjectArray(initialValues.pub_previous_roles);

  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};

  const label = getAccessibleLabel(fieldConfig);

  return (
    <FieldWorkExperience
      className={css.customField}
      name={name}
      id={formId ? `${formId}.${name}` : name}
      label={label}
      fieldConfig={fieldConfig}
      formId={formId}
      intl={intl}
      defaultRequiredMessage={defaultRequiredMessage}
      validateMaybe={validateMaybe}
      initialValues={parsedInitialValues}
    />
  );
};

const CustomFieldTools = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl, initialValues = {} } = props;
  const { isRequired, requiredMessage } = fieldConfig?.saveConfig || {};

  // Parse initival values from string to proper array of objects
  const parsedInitialValues = parseToObjectArray(initialValues.pub_tools_platforms);

  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};

  const label = getAccessibleLabel(fieldConfig);

  return (
    <FieldTools
      className={css.customField}
      name={name}
      id={formId ? `${formId}.${name}` : name}
      label={label}
      fieldConfig={fieldConfig}
      formId={formId}
      intl={intl}
      defaultRequiredMessage={defaultRequiredMessage}
      validateMaybe={validateMaybe}
      initialValues={parsedInitialValues}
    />
  );
};

const CustomFieldLanguages = props => {
  const { name, fieldConfig, defaultRequiredMessage, formId, intl, initialValues = {} } = props;
  const { isRequired, requiredMessage } = fieldConfig?.saveConfig || {};

  // Parse initival values from string to proper array of objects
  const parsedInitialValues = parseToObjectArray(initialValues.pub_language_level);

  const validateMaybe = isRequired
    ? { validate: required(requiredMessage || defaultRequiredMessage) }
    : {};

  const label = getAccessibleLabel(fieldConfig);

  return (
    <FieldLanguages
      className={css.customField}
      name={name}
      id={formId ? `${formId}.${name}` : name}
      label={label}
      fieldConfig={fieldConfig}
      formId={formId}
      intl={intl}
      defaultRequiredMessage={defaultRequiredMessage}
      validateMaybe={validateMaybe}
      initialValues={parsedInitialValues}
    />
  );
};

/**
 * Return Final Form field for each configuration according to schema type.
 *
 * These custom extended data fields are for generating input fields from configuration defined
 * in marketplace-custom-config.js. Other panels in EditListingWizard might add more extended data
 * fields (e.g. shipping fee), but these are independently customizable.
 *
 * @param {Object} props should contain fieldConfig that defines schemaType, enumOptions?, and
 * saveConfig for the field.
 */
const CustomExtendedDataField = props => {
  const intl = useIntl();
  const { enumOptions = [], schemaType, key } = props?.fieldConfig || {};
  const renderFieldComponent = (FieldComponent, props) => <FieldComponent {...props} intl={intl} />;

  return schemaType === SCHEMA_TYPE_ENUM && enumOptions ? (
    renderFieldComponent(CustomFieldEnum, props)
  ) : key === 'tools_platforms' ? (
    <CustomFieldTools {...props} />
  ) : key === 'language_level' ? (
    <CustomFieldLanguages {...props} />
  ) : key === 'previous_roles' ? (
    <CustomFieldWorkExperience {...props} />
  ) : schemaType === SCHEMA_TYPE_MULTI_ENUM && enumOptions ? (
    renderFieldComponent(CustomFieldMultiEnum, props)
  ) : schemaType === SCHEMA_TYPE_TEXT ? (
    key === 'portfolio' ? (
      <CustomFieldFileUploadPDF {...props} />
    ) : (
      renderFieldComponent(CustomFieldText, props)
    )
  ) : schemaType === SCHEMA_TYPE_LONG ? (
    renderFieldComponent(CustomFieldLong, props)
  ) : schemaType === SCHEMA_TYPE_BOOLEAN ? (
    renderFieldComponent(CustomFieldBoolean, props)
  ) : schemaType === SCHEMA_TYPE_YOUTUBE ? (
    renderFieldComponent(CustomFieldYoutube, props)
  ) : null;
};

export default CustomExtendedDataField;
