import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from '../FieldTextInput/FieldTextInput';
import css from './FieldSkills.module.css';
import classNames from 'classnames';
import FieldSelect from '../FieldSelect/FieldSelect';

const emptyBlock = {
  skill: '',
  level: '',
};

const FieldSkillsComponent = ({ className, input, fieldConfig, label, initialValues = [] }) => {
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
            skill: item.skill || '',
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
            {/* Skill */}
            <FieldSelect
              className={classNames(css.halfInput, css.sectionInput, css.skillInput)}
              name={`skills[${index}].skill`}
              id={`skill-${index}`}
              defaultValue={block.skill}
              input={{
                name: `${input.name}.skill_${index}`,
                value: block.skill,
                onChange: e => updateBlock(index, 'skill', e.target.value),
              }}
              searchable={true}
            >
              <option disabled value="">
                {'Kompetens'}
              </option>

              {(fieldConfig?.enumOptions || []).map(skill => (
                <option key={`skill_value-${index}-${skill.option}`} value={skill.option}>
                  {skill.label}
                </option>
              ))}
            </FieldSelect>

            {/* Skill level */}
            <FieldSelect
              className={classNames(css.halfInput, css.sectionInput, css.skillInput)}
              name={`skills[${index}].level`}
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
              <option key={`skill_level-${index}-low`} value={'1'}>
                {'Low'}
              </option>
              <option key={`skill_level-${index}-mid`} value={'2'}>
                {'Mid'}
              </option>
              <option key={`skill_level-${index}-high`} value={'3'}>
                {'High'}
              </option>
              <option key={`skill_level-${index}-expert`} value={'4'}>
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
        + Lägg till kompetens
      </button>
    </div>
  );
};

export default props => <Field component={FieldSkillsComponent} {...props} />;
