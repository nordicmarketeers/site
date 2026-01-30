import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { fetchListingsByIds } from "./LandingPage.duck";

import SectionArticle from "./SectionArticle";
import SectionCarousel from "./SectionCarousel";
import SectionColumns from "./SectionColumns";
import SectionFeatures from "./SectionFeatures";
import SectionHero from "./SectionHero";
import SectionFooter from "./SectionFooter";
import CustomConsultantsSection from "./CustomSectionConsultants";

import css from "./SectionBuilder.module.css";
import CustomJobsSection from "./CustomSectionJobs";

const DEFAULT_CLASSES = {
	sectionDetails: css.sectionDetails,
	title: css.title,
	description: css.description,
	ctaButton: css.ctaButton,
	blockContainer: css.blockContainer,
};

const defaultSectionComponents = {
	article: { component: SectionArticle },
	carousel: { component: SectionCarousel },
	columns: { component: SectionColumns },
	features: { component: SectionFeatures },
	footer: { component: SectionFooter },
	hero: { component: SectionHero },
};

const SectionBuilder = ({ sections: originalSections = [], options = {} }) => {
	const dispatch = useDispatch();
	const { sectionComponents = {}, isInsideContainer } = options;

	const [consultantListings, setconsultantListings] = useState([]);

	const [jobListings, setjobListings] = useState([]);

	// IDs of featured consultants to fetch
	const consultantsListingIds = [
		"6968ccec-7440-4fdb-8572-37fd73d086e6",
		"6968cd34-9a7b-4c7c-9dd9-36221671d66a",
	];

	// IDs of featured jons to fetch
	const jobsListingIds = [
		"6968cfa3-7ea4-441d-acde-65c93b44a39b",
		"6968d029-37fc-4078-b580-24c012041c00",
	];

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const cListings = await dispatch(
					fetchListingsByIds(consultantsListingIds)
				);
				setconsultantListings(cListings);

				const jListings = await dispatch(
					fetchListingsByIds(jobsListingIds)
				);
				setjobListings(jListings);
			} catch (err) {
				console.error("Error fetching featured listings:", err);
			}
		};

		if (originalSections[0]?.sectionName === "Marketplace introduction") {
			fetchListings();
		}
	}, [dispatch, originalSections]);

	if (!originalSections?.length) return null;

	// Inject Custom Sections
	const sections = [...originalSections];

	// Custom sections used on the landingpage
	if (sections[0]?.sectionName === "Marketplace introduction") {
		sections.splice(
			2,
			0,
			<CustomConsultantsSection
				key="custom-consultants"
				consultantListings={consultantListings}
			/>
		);
		sections.splice(
			4,
			0,
			<CustomJobsSection key="custom-jobs" jobListings={jobListings} />
		);
	}

	if (sections[0]?.sectionId === "footer") {
		sections.splice(1, 10);
	}

	const components = { ...defaultSectionComponents, ...sectionComponents };
	const getComponent = sectionType => components[sectionType]?.component;

	const sectionIds = [];
	const getUniqueSectionId = (sectionId, index) => {
		const candidate = sectionId || `section-${index + 1}`;
		if (sectionIds.includes(candidate)) {
			let i = 1;
			let newCandidate = `${candidate}${i}`;
			while (sectionIds.includes(newCandidate))
				i++, (newCandidate = `${candidate}${i}`);
			sectionIds.push(newCandidate);
			return newCandidate;
		}
		sectionIds.push(candidate);
		return candidate;
	};

	return (
		<>
			{sections.map((section, index) => {
				if (React.isValidElement(section)) return section;

				const Section = getComponent(section.sectionType);
				const isDarkTheme =
					section?.appearance?.fieldType === "customAppearance" &&
					section?.appearance?.textColor === "white";
				const classes = classNames({ [css.darkTheme]: isDarkTheme });
				const sectionId = getUniqueSectionId(section.sectionId, index);

				if (Section) {
					return (
						<Section
							key={`${sectionId}_i${index}`}
							className={classes}
							defaultClasses={DEFAULT_CLASSES}
							isInsideContainer={isInsideContainer}
							options={options}
							{...section}
							sectionId={sectionId}
						/>
					);
				}

				console.warn(
					`Unknown section type (${section.sectionType}) detected using sectionName (${section.sectionName}).`
				);
				return null;
			})}
		</>
	);
};

export default SectionBuilder;
