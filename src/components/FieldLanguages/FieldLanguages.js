import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from '../FieldTextInput/FieldTextInput';
import css from './FieldLanguages.module.css';
import classNames from 'classnames';
import FieldSelect from '../FieldSelect/FieldSelect';

const emptyBlock = {
  language: '',
  level: '',
};

const FieldLanguagesComponent = ({ className, input, meta, label, initialValues = [] }) => {
  const [blocks, setBlocks] = useState([]);
  const prevInitialValues = useRef(null);

  // Initialize blocks once, or after submit
  useEffect(() => {
    const hasInitialValuesChanged =
      JSON.stringify(prevInitialValues.current) !== JSON.stringify(initialValues);

    const shouldReinitialize = hasInitialValuesChanged;

    if (!shouldReinitialize) return;

    const data =
      initialValues.length > 0
        ? initialValues.map(item => ({
            language: item.language || '',
            level: item.level || '',
          }))
        : [emptyBlock];

    setBlocks(data);

    prevInitialValues.current = initialValues;
  }, [initialValues]);

  useEffect(() => {
    if (!blocks || blocks.length === 0) return;

    // We need to stringify when a field is FieldSelect
    input.onChange(JSON.stringify(blocks));
  }, [blocks]);

  const updateBlock = (index, field, value) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      newBlocks[index] = { ...newBlocks[index], [field]: value };

      return newBlocks;
    });
  };

  const removeBlock = index => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    const finalBlocks = newBlocks.length ? newBlocks : [emptyBlock];
    setBlocks(finalBlocks);
  };

  const addBlock = () => {
    const newBlocks = [...blocks, emptyBlock];
    setBlocks(newBlocks);
  };

  const rootClasses = classNames(css.wrapper, className);

  return (
    <div className={rootClasses}>
      {label && (
        <>
          <label className={css.label}>{label}</label>
        </>
      )}
      {blocks.map((block, index) => {
        return (
          // Unsure if all props fed in are needed, tested during development of component and works at least
          <div key={index} className={css.experienceBlock}>
            {/* Language */}
            <FieldTextInput
              id={`language-${index}`}
              className={classNames(css.halfInput, css.sectionInput, css.langInput)}
              name={`${input.name}.language${index}`}
              type="text"
              value={block.language}
              input={{
                name: `${input.name}.language${index}`,
                value: block.language,
                type: 'text',
                onChange: e => updateBlock(index, 'language', e.target.value),
              }}
              placeholder={'Språk'}
            />

            {/* Skill level */}
            <FieldSelect
              className={classNames(css.halfInput, css.sectionInput, css.skillInput)}
              name={`${input.name}.level_${index}`}
              id={`level-${index}`}
              defaultValue={block.level}
              input={{
                name: `${input.name}.level_${index}`,
                value: block.level,
                onChange: e => updateBlock(index, 'level', e.target.value),
              }}
            >
              <option disabled value="">
                {'Färdighetsnivå'}
              </option>
              <option key={`language-${index}-basic`} value={'Basic'}>
                {'Basic'}
              </option>
              <option key={`language-${index}-intermediate`} value={'Intermediate'}>
                {'Intermediate'}
              </option>
              <option key={`language-${index}-advanced`} value={'Advanced'}>
                {'Advanced'}
              </option>
              <option key={`language-${index}-fluent`} value={'Fluent'}>
                {'Fluent'}
              </option>
            </FieldSelect>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className={classNames(css.btn, css.removeBtn)}
              aria-label="Remove language"
              title="Remove language"
            >
              ×
            </button>
            <hr />
          </div>
        );
      })}

      <button type="button" onClick={addBlock} className={classNames(css.btn, css.addBtn)}>
        + Lägg till språk
      </button>
    </div>
  );
};

export default props => <Field component={FieldLanguagesComponent} {...props} />;
