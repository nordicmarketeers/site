import React, { useState, useRef, useEffect } from 'react';
import FieldCheckbox from '../FieldCheckbox/FieldCheckbox';

import css from './FieldCheckboxGroup.module.css';
import classNames from 'classnames';
import ValidationError from '../ValidationError/ValidationError';

const FieldCheckboxGroupWithSearch = props => {
  const {
    className,
    rootClassName,
    label,
    optionLabelClassName,
    twoColumns,
    id,
    fields,
    options,
    meta,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const [optionSearch, setOptionSearch] = useState('');

  const normalizedSearch = optionSearch.trim().toLowerCase();

  let filteredOptions = options ?? [];
  if (normalizedSearch) {
    filteredOptions = options.filter(option => option.key.includes(normalizedSearch));
  }

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = classNames(css.list, twoColumns && css.twoColumns);

  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  // Handle dropdown losing focus, for navigation with keyboard
  useEffect(() => {
    const handleFocusOut = e => {
      if (!e.relatedTarget) return;
      if (isOpen && containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
        setIsOpen(false);
      }
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('focusout', handleFocusOut);
    }

    return () => {
      if (node) {
        node.removeEventListener('focusout', handleFocusOut);
      }
    };
  }, [isOpen]);

  // Show labels in anchor, or amount if labels > 1
  const selectedValues = fields.value || [];
  const selectedLabels = options
    .filter(opt => selectedValues.includes(opt.key))
    .map(opt => opt.label);

  const displayText =
    selectedLabels.length === 0
      ? 'Välj en eller fler'
      : selectedLabels.length === 1
      ? selectedLabels[0]
      : `${selectedLabels.length} valda`;

  const Tag = label ? 'fieldset' : 'div';

  return (
    <Tag className={classes}>
      {label && (
        <legend>
          {label}
          {(id.includes('role') || id.includes('customer_types')) && (
            <span className={css.labelSubtitle}>Endast 5 visas på din profil</span>
          )}
        </legend>
      )}

      <div
        ref={containerRef}
        data-field-checkbox-dropdown
        className={classNames(css.dropdownCheckList, isOpen && css.visible)}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            setIsOpen(false);
            buttonRef.current?.focus();
          }

          if (e.key === 'Enter') {
            const active = document.activeElement;
            if (active && active.tagName === 'INPUT' && active.type === 'checkbox') {
              active.click();
              e.preventDefault();
            }
          }
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          className={css.anchor}
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {displayText}
        </button>

        <ul
          className={classNames(css.items, isOpen && css.itemsVisible)}
          role="listbox"
          aria-multiselectable="true"
        >
          <input
            ref={searchRef}
            id="option-search"
            type="text"
            placeholder="Sök"
            onChange={event => setOptionSearch(event.target.value)}
          />
          {filteredOptions.map(option => {
            const fieldId = `${id}.${option.key}`;
            const isSelected = selectedValues.includes(option.key);

            return (
              <li key={fieldId} className={css.item} role="option" aria-selected={isSelected}>
                <FieldCheckbox
                  id={fieldId}
                  name={fields.name}
                  label={option.label}
                  value={option.key}
                  textClassName={optionLabelClassName}
                  className={isSelected ? css.selectedItem : undefined}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <ValidationError fieldMeta={meta} />
    </Tag>
  );
};

export default FieldCheckboxGroupWithSearch;
