import React, { Component, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { ValidationError, ExpandingTextarea } from '../../components';

import css from './FieldTextInput.module.css';
import { unixToDate } from '../../util/dateHelper';

// Datalists
import toolsPlatform from '../../dataLists/toolsPlatform.json';

// Contains suggested text for certain fields
const dataLists = { toolsPlatform };

const CONTENT_MAX_LENGTH = 5000;

const FieldTextInputComponent = props => {
  const {
    rootClassName,
    className,
    inputRootClass,
    labelClassName,
    customErrorText,
    dataList,
    id,
    label,
    input,
    maxTextLength,
    meta,
    onUnmount,
    isUncontrolled,
    inputRef,
    hideErrorMessage,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const textRef = useRef(null);

  const isDateInput =
    input.name.includes('starting_date') || input.name.includes('apply_last_date');

  const isApplyLastDate = input.name.includes('apply_last_date');

  // Make certain custom text boxes smaller
  input.type = isDateInput ? 'text' : input.type;

  if (label && !id) {
    throw new Error('id required when a label is given');
  }

  const { valid, invalid, touched, error } = meta;
  const isTextarea = input.type === 'textarea';

  const errorText = customErrorText || error;

  // Error message and input error styles are only shown if the
  // field has been touched and the validation has failed.
  const hasError = !!customErrorText || !!(touched && invalid && error);

  const fieldMeta = { touched: hasError, error: errorText };

  // Textarea doesn't need type.
  const { type, ...inputWithoutType } = input;
  // Uncontrolled input uses defaultValue instead of value.
  const { value: defaultValue, ...inputWithoutValue } = input;
  // Use inputRef if it is passed as prop.
  const refMaybe = inputRef ? { ref: inputRef } : {};

  const inputClasses =
    inputRootClass ||
    classNames(css.input, {
      [css.inputSuccess]: valid,
      [css.inputError]: hasError,
      [css.textarea]: isTextarea,
    });

  const maxLength = maxTextLength ? maxTextLength : CONTENT_MAX_LENGTH;

  const inputProps = isTextarea
    ? {
        className: inputClasses,
        id,
        rows: 1,
        maxLength,
        ...refMaybe,
        ...inputWithoutType,
        ...rest,
      }
    : isUncontrolled
    ? {
        className: inputClasses,
        id,
        type,
        defaultValue,
        maxLength,
        ...refMaybe,
        ...inputWithoutValue,
        ...rest,
      }
    : {
        className: inputClasses,
        id,
        type,
        maxLength,
        ...refMaybe,
        ...input,
        ...rest,
      };

  // Change the default value from unix to readable date if type is apply_last_date
  const initialFormattedValue = useRef(null);
  const initialRawValue = useRef(null);
  if (isApplyLastDate) {
    if (initialFormattedValue.current === null) {
      initialRawValue.current = input.value;
      initialFormattedValue.current = input.value ? unixToDate(input.value) : '';
    }

    const shouldFormatInitial = input.value === initialRawValue.current;

    const shouldFormatAfterSubmit = meta.submitSucceeded && !meta.modifiedSinceLastSubmit;

    const isUnix = /^\d+$/.test(input.value);

    if ((shouldFormatInitial || shouldFormatAfterSubmit) && isUnix) {
      inputProps.value = unixToDate(input.value);
    }
  }

  const value = input.value || '';

  const filteredDataList =
    dataList && value
      ? (dataLists[dataList] || []).filter(item => item.toLowerCase().includes(value.toLowerCase()))
      : [];

  const showList = isFocused && filteredDataList.length > 0 && !filteredDataList.includes(value);

  const handleKeyDown = e => {
    if (!showList) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setActiveIndex(i => {
        const next = i + 1;
        return next >= filteredDataList.length ? 0 : next;
      });
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      setActiveIndex(i => {
        const prev = i - 1;
        return prev < 0 ? filteredDataList.length - 1 : prev;
      });
    }

    if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();

        const selectedValue = filteredDataList[activeIndex];

        const el = textRef.current;

        if (el) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
            .set;

          setter.call(el, selectedValue);

          el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        setActiveIndex(-1);

        textRef.current?.blur();
      }
    }

    if (e.key === 'Escape') {
      setActiveIndex(-1);

      textRef.current?.blur();
    }
  };

  const currentTextLength = textRef.current?.value?.length ? textRef.current.value.length : 0;

  const labelClassMaybe = labelClassName ? { className: labelClassName } : {};
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      {label ? (
        <label htmlFor={id} {...labelClassMaybe}>
          {label}
        </label>
      ) : null}

      {isTextarea ? (
        <ExpandingTextarea {...inputProps} />
      ) : isDateInput ? (
        <input
          {...inputProps}
          pattern="^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(20\d{2})$"
          placeholder="dd-mm-yyyy"
        />
      ) : (
        <>
          <input
            ref={textRef}
            autoComplete="off"
            {...inputProps}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />

          {showList && (
            <div className={css.datalist}>
              {filteredDataList.map((item, i) => (
                <div
                  key={item}
                  className={`${css.datalistOption} ${
                    i === activeIndex ? css.datalistOptionActive : ''
                  }`}
                  onMouseDown={() => {
                    const el = textRef.current;

                    if (el) {
                      const setter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        'value'
                      ).set;

                      setter.call(el, item);

                      el.dispatchEvent(new Event('input', { bubbles: true }));
                    }

                    setActiveIndex(-1);

                    textRef.current?.blur();
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {maxTextLength && (
            <span className={css.maxTextLength}>
              {currentTextLength}/{maxTextLength}
            </span>
          )}
        </>
      )}

      {hideErrorMessage ? null : <ValidationError fieldMeta={fieldMeta} />}
    </div>
  );
};

/**
 * Create Final Form field for <input> or <textarea>.
 * It's often used for type="text" and sometimes with other types like 'number' too.
 *
 * Note: Uncontrolled input uses defaultValue prop, but doesn't pass value from form to the field.
 * https://reactjs.org/docs/uncontrolled-components.html#default-values
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {string?} props.inputRootClass overwrite components own css.input
 * @param {string} props.name Name of the input in Final Form
 * @param {string} props.id
 * @param {string?} props.label Label is optional, but if it is given, an id is also required.
 * @param {string?} props.customErrorText Error message that can be manually passed to input field, overrides default validation message
 * @param {boolean} props.isUncontrolled is value tracked by parent component
 * @param {Object} props.inputRef a ref object passed for input element.
 * @param {Function} props.onUnmount Uncontrolled input uses defaultValue prop, but doesn't pass value from form to the field.
 * @returns {JSX.Element} Final Form Field containing nested "select" input
 */
class FieldTextInput extends Component {
  componentWillUnmount() {
    // Unmounting happens too late if it is done inside Field component
    // (Then Form has already registered its (new) fields and
    // changing the value without corresponding field is prohibited in Final Form
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    return <Field component={FieldTextInputComponent} {...this.props} />;
  }
}

export default FieldTextInput;
