import React from "react";

// Utils
import {
	SCHEMA_TYPE_MULTI_ENUM,
	SCHEMA_TYPE_TEXT,
	SCHEMA_TYPE_YOUTUBE,
} from "../../util/types";
import {
	isFieldForCategory,
	pickCategoryFields,
	pickCustomFieldProps,
} from "../../util/fieldHelpers.js";

import SectionDetailsMaybe from "./SectionDetailsMaybe";
import SectionMultiEnumMaybe from "./SectionMultiEnumMaybe";
import SectionTextMaybe from "./SectionTextMaybe";
import SectionYoutubeVideoMaybe from "./SectionYoutubeVideoMaybe";

/**
 * Renders custom listing fields.
 * - SectionDetailsMaybe is used if schemaType is 'enum', 'long', or 'boolean'
 * - SectionMultiEnumMaybe is used if schemaType is 'multi-enum'
 * - SectionTextMaybe is used if schemaType is 'text'
 *
 * @param {*} props include publicData, metadata, listingFieldConfigs, categoryConfiguration
 * @returns React.Fragment containing aforementioned components
 */
const CustomListingFields = props => {
	const {
		publicData,
		metadata,
		listingFieldConfigs,
		categoryConfiguration,
	} = props;

	// Treat certain fields like enums to make them appear in the details table
	listingFieldConfigs.forEach(obj => {
		if (["apply_last_date", "starting_date"].includes(obj.key)) {
			obj.schemaType = "enum";

			const valueFromPublicData = publicData[obj.key];

			obj.enumOptions = [
				{ label: valueFromPublicData, option: valueFromPublicData },
			];
		}
	});

	const {
		key: categoryPrefix,
		categories: listingCategoriesConfig,
	} = categoryConfiguration;
	const categoriesObj = pickCategoryFields(
		publicData,
		categoryPrefix,
		1,
		listingCategoriesConfig
	);
	const currentCategories = Object.values(categoriesObj);

	const isFieldForSelectedCategories = fieldConfig => {
		const isTargetCategory = isFieldForCategory(
			currentCategories,
			fieldConfig
		);
		return isTargetCategory;
	};
	const propsForCustomFields =
		pickCustomFieldProps(
			publicData,
			metadata,
			listingFieldConfigs,
			"listingType",
			isFieldForSelectedCategories
		) || [];

	return (
		<>
			<SectionDetailsMaybe
				{...props}
				isFieldForCategory={isFieldForSelectedCategories}
			/>
			{propsForCustomFields.map(customFieldProps => {
				const { schemaType, key, ...fieldProps } = customFieldProps;
				return schemaType === SCHEMA_TYPE_MULTI_ENUM ? (
					<SectionMultiEnumMaybe key={key} {...fieldProps} />
				) : schemaType === SCHEMA_TYPE_TEXT ? (
					<SectionTextMaybe key={key} {...fieldProps} />
				) : schemaType === SCHEMA_TYPE_YOUTUBE ? (
					<SectionYoutubeVideoMaybe key={key} {...fieldProps} />
				) : null;
			})}
		</>
	);
};

export default CustomListingFields;
