import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from '../FieldTextInput/FieldTextInput';
import css from './FieldEducation.module.css';
import classNames from 'classnames';

const emptyBlock = {
  school: '',
  subject: '',
  exam: '',
  city: '',
};

const EducationComponent = ({ className, input, meta, label, initialValues = [] }) => {
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
            school: item.school || '',
            subject: item.subject || '',
            exam: item.exam || '',
            city: item.city || '',
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
            {/* School */}
            <FieldTextInput
              id={`school-${index}`}
              className={classNames(css.halfInput, css.sectionInput)}
              name={`${baseName}.school`}
              type="text"
              value={block.school}
              input={{
                name: `${baseName}.school`,
                value: block.school,
                type: 'text',
                onChange: e => updateBlock(index, 'school', e.target.value),
              }}
              label="Skola"
              placeholder={'Lunds Universitet'}
            />

            {/* Subject */}
            <FieldTextInput
              id={`subject-${index}`}
              className={classNames(css.halfInput, css.halfInputRight, css.sectionInput)}
              name={`${baseName}.subject`}
              type="text"
              value={block.subject}
              input={{
                name: `${baseName}.subject`,
                value: block.subject,
                type: 'text',
                onChange: e => updateBlock(index, 'subject', e.target.value),
              }}
              placeholder={'Dataanalys'}
              label="Ämnesområde"
            />

            {/* Exam */}
            <FieldTextInput
              id={`exam-${index}`}
              className={classNames(css.halfInput, css.sectionInput)}
              name={`${baseName}.exam`}
              type="text"
              value={block.exam}
              input={{
                name: `${baseName}.exam`,
                value: block.exam,
                type: 'text',
                onChange: e => updateBlock(index, 'exam', e.target.value),
              }}
              label="Examen"
              placeholder={'Kandidatexamen'}
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
              placeholder={'Lund'}
              label="Stad"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className={classNames(css.btn, css.removeBtn)}
            >
              × Ta bort utbildning
            </button>
          </div>
        );
      })}

      <button type="button" onClick={addBlock} className={classNames(css.btn, css.addBtn)}>
        + Lägg till utbildning
      </button>
    </div>
  );
};

export default props => <Field component={EducationComponent} {...props} />;
