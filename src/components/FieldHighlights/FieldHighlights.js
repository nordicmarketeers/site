import React, { useState, useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import FieldTextInput from '../FieldTextInput/FieldTextInput';
import css from './FieldHighlights.module.css';
import classNames from 'classnames';

const emptyBlock = {
  text_first: '',
  text_second: '',
  text_third: '',
  text_fourth: '',
};

const HighlightsComponent = ({ className, input, meta, label, initialValues = [] }) => {
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
            text_first: item.text_first || '',
            text_second: item.text_second || '',
            text_third: item.text_third || '',
            text_fourth: item.text_fourth || '',
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
          <label className={css.label}>
            {label} <br />
            <span className={css.labelSubtitle}>De två första visas innuti ditt profilkort</span>
          </label>
        </>
      )}
      {blocks.map((block, index) => {
        const baseName = `${input.name}[${index}]`;

        return (
          // Unsure if all props fed in are needed, tested during development of component and works at least
          <div key={index} className={css.experienceBlock}>
            {/* Text 1 */}
            <FieldTextInput
              id={`text_first-${index}`}
              className={css.sectionInput}
              name={`${baseName}.text_first`}
              type="text"
              value={block.text_first}
              input={{
                name: `${baseName}.text_first`,
                value: block.text_first,
                type: 'text',
                onChange: e => updateBlock(index, 'text_first', e.target.value),
              }}
              placeholder={'Vinnare av Svenska Designpriset 2020'}
              maxTextLength={50}
            />

            {/* Text 2 */}
            <FieldTextInput
              id={`text_second-${index}`}
              className={css.sectionInput}
              name={`${baseName}.text_second`}
              type="text"
              value={block.text_second}
              input={{
                name: `${baseName}.text_second`,
                value: block.text_second,
                type: 'text',
                onChange: e => updateBlock(index, 'text_second', e.target.value),
              }}
              placeholder={'Global kampanj för FMCG-varumärke'}
              maxTextLength={50}
            />

            {/* Text 3 */}
            <FieldTextInput
              id={`text_third-${index}`}
              className={css.sectionInput}
              name={`${baseName}.text_third`}
              type="text"
              value={block.text_third}
              input={{
                name: `${baseName}.text_third`,
                value: block.text_third,
                type: 'text',
                onChange: e => updateBlock(index, 'text_third', e.target.value),
              }}
              placeholder={'+180% leads inom B2B SaaS'}
              maxTextLength={50}
            />

            {/* Text 4 */}
            <FieldTextInput
              id={`text_fourth-${index}`}
              className={css.sectionInput}
              name={`${baseName}.text_fourth`}
              type="text"
              value={block.text_fourth}
              input={{
                name: `${baseName}.text_fourth`,
                value: block.text_fourth,
                type: 'text',
                onChange: e => updateBlock(index, 'text_fourth', e.target.value),
              }}
              placeholder={'+85% engagemang i sociala medier'}
              maxTextLength={50}
            />
          </div>
        );
      })}
    </div>
  );
};

export default props => <Field component={HighlightsComponent} {...props} />;
