import React, { useMemo, useState } from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { ValidationError } from '../../components';

import css from './FieldSelect.module.css';

const FieldSelectComponent = props => {
  const {
    rootClassName,
    className,
    selectClassName,
    labelClassName,
    id,
    label,
    input,
    meta,
    children,
    onChange,
    showLabelAsDisabled,
    searchable = false,
    disabled,
    ...rest
  } = props;

  if (label && !id) {
    throw new Error('id required when a label is given');
  }

  const { valid, invalid, touched, error } = meta;

  // Error message and input error styles are only shown if the
  // field has been touched and the validation has failed.
  const hasError = touched && invalid && error;

  const selectClasses = classNames({
    [selectClassName]: selectClassName,
    [css.selectError]: hasError,
  });

  const labelClasses = classNames({
    [css.labelDisabled]: showLabelAsDisabled,
    [labelClassName]: !!labelClassName,
  });

  const classes = classNames(rootClassName || css.root, className);

  const handleChange = e => {
    input.onChange(e);

    if (onChange) {
      onChange(e.currentTarget.value);
    }
  };

  // Regular select mode
  if (!searchable) {
    return (
      <div className={classes}>
        {label ? (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        ) : null}

        <select
          className={selectClasses}
          id={id}
          {...input}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        >
          {children}
        </select>

        <ValidationError fieldMeta={meta} />
      </div>
    );
  }

  // Searchable select
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const options = React.Children.toArray(children)
    .filter(child => child.props?.value !== undefined)
    .map(child => ({
      value: child.props.value,
      label: child.props.children,
      disabled: !!child.props.disabled,
    }));

  const placeholderOption = options.find(option => option.disabled && option.value === '');

  const placeholder = placeholderOption?.label || 'Select...';

  const selectedOption = options.find(option => option.value === input.value);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return options.filter(option => !option.disabled);
    }

    return options.filter(
      option =>
        !option.disabled &&
        String(option.label)
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, options]);

  const handleSelect = option => {
    if (option.disabled) {
      return;
    }

    const syntheticEvent = {
      target: {
        value: option.value,
      },
      currentTarget: {
        value: option.value,
      },
    };

    input.onChange(syntheticEvent);

    if (onChange) {
      onChange(option.value);
    }

    setSearch('');
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);

      setSearch('');
    }, 100);
  };

  return (
    <div className={classes}>
      {label ? (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      ) : null}

      <div className={css.searchableSelect}>
        <input
          id={id}
          type="text"
          className={selectClasses}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={isOpen ? search : selectedOption ? selectedOption.label : ''}
          onFocus={() => {
            setIsOpen(true);
            setSearch('');
          }}
          onBlur={handleBlur}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          {...rest}
        />

        {isOpen && filteredOptions.length > 0 ? (
          <div className={css.dropdown}>
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={css.option}
                onMouseDown={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <ValidationError fieldMeta={meta} />
    </div>
  );
};

/**
 * Final Form Field wrapping <select> input
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {string?} props.selectClassName add more style rules to <select> component
 * @param {string} props.name Name of the input in Final Form
 * @param {string} props.id Label is optional, but if it is given, an id is also required so the label can reference the input in the `for` attribute
 * @param {ReactNode} props.label
 * @param {ReactNode} props.children
 * @param {boolean} props.disabled Whether the select element is disabled
 * @param {boolean} props.showLabelAsDisabled Whether the label is disabled
 * @returns {JSX.Element} Final Form Field containing <select> input
 */
const FieldSelect = props => {
  return <Field component={FieldSelectComponent} {...props} />;
};

export default FieldSelect;
