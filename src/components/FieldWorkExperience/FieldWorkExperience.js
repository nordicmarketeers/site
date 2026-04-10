import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from '../FieldTextInput/FieldTextInput';
import css from './FieldWorkExperience.module.css';
import classNames from 'classnames';

const emptyBlock = {
  title: '',
  company: '',
  city: '',
  start_date: '',
  ending_date: '',
  description: '',
};

const WorkExperienceComponent = ({ className, input, meta, label, initialValues = [] }) => {
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
            title: item.title || '',
            company: item.company || '',
            city: item.city || '',
            start_date: item.start_date || '',
            ending_date: item.ending_date || '',
            description: item.description || '',
          }))
        : [emptyBlock];

    setBlocks(data);

    prevInitialValues.current = initialValues;
  }, [initialValues]);

  useEffect(() => {
    if (!blocks || blocks.length === 0) return;

    input.onChange(blocks);
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
        const baseName = `${input.name}[${index}]`;

        return (
          // Unsure if all props fed in are needed, tested during development of component and works at least
          <div key={index} className={css.experienceBlock}>
            {/* Title */}
            <FieldTextInput
              id={`title-${index}`}
              className={css.sectionInput}
              name={`${baseName}.title`}
              type="text"
              value={block.title}
              input={{
                name: `${baseName}.title`,
                value: block.title,
                type: 'text',
                onChange: e => updateBlock(index, 'title', e.target.value),
              }}
              label="Titel / Roll"
              placeholder={'Marknadskoordinator'}
            />

            {/* Company */}
            <FieldTextInput
              id={`company-${index}`}
              className={classNames(css.halfInput, css.sectionInput)}
              name={`${baseName}.company`}
              type="text"
              value={block.company}
              input={{
                name: `${baseName}.company`,
                value: block.company,
                type: 'text',
                onChange: e => updateBlock(index, 'company', e.target.value),
              }}
              label="Företagets namn"
              placeholder={'Google'}
            />

            {/* City */}
            <FieldTextInput
              id={`city-${index}`}
              className={classNames(css.halfInput, css.halfInputRight, css.sectionInput)}
              name={`${baseName}.city`}
              type="text"
              value={block.city}
              input={{
                name: `${baseName}.city`,
                value: block.city,
                type: 'text',
                onChange: e => updateBlock(index, 'city', e.target.value),
              }}
              placeholder={'Malmö'}
              label="Stad"
            />

            {/* Start Date */}
            <FieldTextInput
              id={`start-${index}`}
              className={classNames(css.halfInput, css.sectionInput)}
              name={`${baseName}.start_date`}
              type="text"
              value={block.start_date}
              input={{
                name: `${baseName}.start_date`,
                value: block.start_date,
                type: 'text',
                onChange: e => updateBlock(index, 'start_date', e.target.value),
              }}
              placeholder={'April 2021'}
              label="Startdatum"
            />

            {/* End Date */}
            <FieldTextInput
              id={`end-${index}`}
              className={classNames(css.halfInput, css.halfInputRight, css.sectionInput)}
              name={`${baseName}.ending_date`}
              type="text"
              value={block.ending_date}
              input={{
                name: `${baseName}.ending_date`,
                value: block.ending_date,
                type: 'text',
                onChange: e => updateBlock(index, 'ending_date', e.target.value),
              }}
              placeholder={'Dec 2025 / Nu'}
              label="Slutdatum"
            />

            {/* Description (textarea) */}
            <FieldTextInput
              id={`desc-${index}`}
              className={classNames(css.sectionInput, css.description)}
              name={`${baseName}.description`}
              type="textarea"
              value={block.description}
              input={{
                name: `${baseName}.description`,
                value: block.description,
                type: 'textarea',
                onChange: e => updateBlock(index, 'description', e.target.value),
              }}
              placeholder={'Beskrivning av dina arbetsuppgifter'}
              label="Beskrivning"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className={classNames(css.btn, css.removeBtn)}
            >
              × Ta bort sektion
            </button>
          </div>
        );
      })}

      <button type="button" onClick={addBlock} className={classNames(css.btn, css.addBtn)}>
        + Lägg till sektion
      </button>
    </div>
  );
};

export default props => <Field component={WorkExperienceComponent} {...props} />;
