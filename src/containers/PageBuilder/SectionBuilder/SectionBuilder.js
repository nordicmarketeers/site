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

	// IDs of featured consultants to fetch
	const consultantsListingIds = [
		"6968ccec-7440-4fdb-8572-37fd73d086e6",
		"6968cd34-9a7b-4c7c-9dd9-36221671d66a",
	];

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const listings = await dispatch(
					fetchListingsByIds(consultantsListingIds)
				);
				setconsultantListings(listings);
			} catch (err) {
				console.error("Error fetching featured listings:", err);
			}
		};

		if (originalSections[0]?.sectionName === "Marketplace introduction") {
			fetchListings();
		}
	}, [dispatch, originalSections]);

	if (!originalSections?.length) return null;

	// Jobs Section
	const JobCard = ({ href, title, location, tags }) => (
		<a
			className="ListingCard_root__bS0kE SearchResultsPanel_listingCard__TbvC3"
			href={href}
		>
			<div className="ListingCard_cardWrapper__R65-L">
				<p className="ListingCard_jobTitle__iJfw+">{title}</p>
				<p className="ListingCard_jobLocation__lLE8o">{location}</p>
				<div className="ListingCard_tagRow__nBE3y">
					{tags.map(tag => (
						<span key={tag} className="ListingCard_tag__OKtuq">
							{tag}
						</span>
					))}
				</div>
			</div>
		</a>
	);

	const CustomJobsSection = () => (
		<section
			style={{
				width: "100%",
				overflowX: "hidden",
				backgroundColor: "white",
			}}
			id="section-custom-jobs"
		>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "40px 20px",
				}}
			>
				<header className={css.sectionDetails}>
					<h2 className={css.title}>Lediga uppdrag</h2>
					<p
						className={classNames(
							css.description,
							"Ingress_ingress__48pQD"
						)}
					>
						Bläddra efter, och hitta ett uppdrag som passar just
						dig.
					</p>
				</header>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
						gap: "32px",
						marginTop: "32px",
					}}
				>
					<div
						style={{
							flex: "1 1 400px",
							maxWidth: "550px",
							minWidth: "320px",
						}}
					>
						<JobCard
							href="/l/seo-specialist/6968d029-37fc-4078-b580-24c012041c00"
							title="SEO-Specialist"
							location="Malmö, Sverige"
							tags={["Seo specialist", "Onsite", "Part time"]}
						/>
					</div>
					<div
						style={{
							flex: "1 1 400px",
							maxWidth: "550px",
							minWidth: "320px",
						}}
					>
						<JobCard
							href="/l/growth-marketer-inom-it/6968cfa3-7ea4-441d-acde-65c93b44a39b"
							title="Growth Marketer inom IT"
							location="Malmö, Sverige"
							tags={["Market coordinator", "Hybrid", "Full time"]}
						/>
					</div>
				</div>

				<div style={{ marginTop: "24px", textAlign: "center" }}>
					<a
						href="/s?pub_listingType=consultant_job"
						className="Link_link__4wfKD SectionBuilder_ctaButton__+OGGi SectionBuilder_align__lJUUr"
						style={{ display: "inline-block" }}
					>
						Se alla lediga uppdrag
					</a>
				</div>
			</div>
		</section>
	);

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
		sections.splice(4, 0, <CustomJobsSection key="custom-jobs" />);
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
