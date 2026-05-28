import React, { useMemo, useState, useRef, useEffect } from 'react';
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
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Refs for scrolling
  const optionRefs = useRef([]);

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

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filteredOptions.length);
  }, [filteredOptions]);

  // Scroll into view when highlighted changes
  useEffect(() => {
    const el = optionRefs.current[highlightedIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex]);

  const handleSelect = option => {
    if (option.disabled) return;

    const syntheticEvent = {
      target: { value: option.value },
      currentTarget: { value: option.value },
    };

    input.onChange(syntheticEvent);

    if (onChange) {
      onChange(option.value);
    }

    setSearch('');
    setIsOpen(false);
    setHighlightedIndex(0);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSearch('');
      setHighlightedIndex(0);
    }, 100);
  };

  const handleKeyDown = e => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) handleSelect(option);
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearch('');
      setHighlightedIndex(0);
    }
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
            setHighlightedIndex(0);
          }}
          onBlur={handleBlur}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          {...rest}
        />

        {isOpen && filteredOptions.length > 0 ? (
          <div className={css.dropdown} role="listbox">
            {filteredOptions.map((option, index) => (
              <div
                role="option"
                key={option.value}
                ref={el => (optionRefs.current[index] = el)}
                className={css.option}
                onMouseDown={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  background: index === highlightedIndex ? '#eee' : undefined,
                }}
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

const FieldSelect = props => {
  return <Field component={FieldSelectComponent} {...props} />;
};

export default FieldSelect;
