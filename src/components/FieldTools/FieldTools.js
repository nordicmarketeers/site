import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from '../FieldTextInput/FieldTextInput';
import css from './FieldTools.module.css';
import classNames from 'classnames';
import FieldSelect from '../FieldSelect/FieldSelect';

const emptyBlock = {
  tool_platform: '',
  level: '',
};

const FieldToolsComponent = ({ className, input, meta, label, initialValues = [] }) => {
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
            tool_platform: item.tool_platform || '',
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
            {/* Tools/platform */}
            <FieldTextInput
              id={`tool_platform-${index}`}
              className={classNames(css.halfInput, css.sectionInput, css.toolPlatInpit)}
              name={`${input.name}.tool_platform_${index}`}
              type="text"
              value={block.tool_platform}
              input={{
                name: `${input.name}.tool_platform_${index}`,
                value: block.tool_platform,
                type: 'text',
                onChange: e => updateBlock(index, 'tool_platform', e.target.value),
              }}
              placeholder={'Verktyg / plattform'}
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
              <option key={`tool_platform-${index}-low`} value={'Low'}>
                {'Low'}
              </option>
              <option key={`tool_platform-${index}-mid`} value={'Mid'}>
                {'Mid'}
              </option>
              <option key={`tool_platform-${index}-high`} value={'High'}>
                {'High'}
              </option>
              <option key={`tool_platform-${index}-expert`} value={'Expert'}>
                {'Expert'}
              </option>
            </FieldSelect>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className={classNames(css.btn, css.removeBtn)}
              aria-label="Remove tool / platform"
              title="Remove tool / platform"
            >
              ×
            </button>
            <hr />
          </div>
        );
      })}

      <button type="button" onClick={addBlock} className={classNames(css.btn, css.addBtn)}>
        + Lägg till verktyg / plattform
      </button>
    </div>
  );
};

export default props => <Field component={FieldToolsComponent} {...props} />;
