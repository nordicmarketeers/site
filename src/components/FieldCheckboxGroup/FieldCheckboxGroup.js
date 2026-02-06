/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { FieldArray } from "react-final-form-arrays";
import { FieldCheckbox, ValidationError } from "../../components";

import css from "./FieldCheckboxGroup.module.css";

const FieldCheckboxRenderer = props => {
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
	const [optionSearch, setOptionSearch] = useState("");

	const normalizedSearch = optionSearch.trim().toLowerCase();

	let filteredOptions = options ?? [];
	if (normalizedSearch) {
		filteredOptions = options.filter(option =>
			option.key.includes(normalizedSearch)
		);
	}

	const classes = classNames(rootClassName || css.root, className);
	const listClasses = classNames(css.list, twoColumns && css.twoColumns);

	useEffect(() => {
		const handleClickOutside = e => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
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
			if (
				isOpen &&
				containerRef.current &&
				!containerRef.current.contains(e.relatedTarget)
			) {
				setIsOpen(false);
			}
		};

		const node = containerRef.current;
		if (node) {
			node.addEventListener("focusout", handleFocusOut);
		}

		return () => {
			if (node) {
				node.removeEventListener("focusout", handleFocusOut);
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
			? "Välj en eller fler"
			: selectedLabels.length === 1
			? selectedLabels[0]
			: `${selectedLabels.length} valda`;

	const Tag = label ? "fieldset" : "div";

	// Enable search for certain checkbox group types
	if ((id && id.includes("role")) || id.includes("skills")) {
		return (
			<Tag className={classes}>
				{label && <legend>{label}</legend>}
				<div
					ref={containerRef}
					data-field-checkbox-dropdown
					className={classNames(
						css.dropdownCheckList,
						isOpen && css.visible
					)}
					onKeyDown={e => {
						if (e.key === "Escape") {
							setIsOpen(false);
							buttonRef.current?.focus();
						}

						if (e.key === "Enter") {
							const active = document.activeElement;
							if (
								active &&
								active.tagName === "INPUT" &&
								active.type === "checkbox"
							) {
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
						className={classNames(
							css.items,
							isOpen && css.itemsVisible
						)}
						role="listbox"
						aria-multiselectable="true"
					>
						<input
							ref={searchRef}
							id="option-search"
							type="text"
							placeholder="Sök"
							onChange={event =>
								setOptionSearch(event.target.value)
							}
						/>
						{filteredOptions.map(option => {
							const fieldId = `${id}.${option.key}`;
							const isSelected = selectedValues.includes(
								option.key
							);

							return (
								<li
									key={fieldId}
									className={css.item}
									role="option"
									aria-selected={isSelected}
								>
									<FieldCheckbox
										id={fieldId}
										name={fields.name}
										label={option.label}
										value={option.key}
										textClassName={optionLabelClassName}
										className={
											isSelected
												? css.selectedItem
												: undefined
										}
									/>
								</li>
							);
						})}
					</ul>
				</div>
				<ValidationError fieldMeta={meta} />
			</Tag>
		);
	} else
		return (
			<Tag className={classes}>
				{label ? <legend>{label}</legend> : null}
				<ul className={listClasses}>
					{options.map((option, index) => {
						const fieldId = `${id}.${option.key}`;
						const textClassName = optionLabelClassName;
						const textClassNameMaybe = textClassName
							? { textClassName }
							: {};
						return (
							<li key={fieldId} className={css.item}>
								<FieldCheckbox
									id={fieldId}
									name={fields.name}
									label={option.label}
									value={option.key}
									{...textClassNameMaybe}
								/>
							</li>
						);
					})}
				</ul>
				<ValidationError fieldMeta={{ ...meta }} />
			</Tag>
		);
};

// Note: name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in

/**
 * @typedef {Object} CheckboxGroupOption
 * @property {string} key
 * @property {string} label
 */

/**
 * Final Form Field containing checkbox group.
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 * @component
 * @param {Object} props
 * @param {string} props.name this is required for FieldArray (Final Form component)
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {string?} props.optionLabelClassName given to each option
 * @param {string} props.id givent to input
 * @param {ReactNode} props.label the label for the checkbox group
 * @param {Array<CheckboxGroupOption>} props.options E.g. [{ key, label }]
 * @param {boolean} props.twoColumns
 * @returns {JSX.Element} Final Form Field containing multiple checkbox inputs
 */
const FieldCheckboxGroup = props => (
	<FieldArray component={FieldCheckboxRenderer} {...props} />
);

export default FieldCheckboxGroup;
