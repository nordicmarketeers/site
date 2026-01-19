import React from "react";
import classNames from "classnames";

// Section components
import SectionArticle from "./SectionArticle";
import SectionCarousel from "./SectionCarousel";
import SectionColumns from "./SectionColumns";
import SectionFeatures from "./SectionFeatures";
import SectionHero from "./SectionHero";
import SectionFooter from "./SectionFooter";

// Styles
import css from "./SectionBuilder.module.css";

// Shared classes
const DEFAULT_CLASSES = {
	sectionDetails: css.sectionDetails,
	title: css.title,
	description: css.description,
	ctaButton: css.ctaButton,
	blockContainer: css.blockContainer,
};

// Default section mapping
const defaultSectionComponents = {
	article: { component: SectionArticle },
	carousel: { component: SectionCarousel },
	columns: { component: SectionColumns },
	features: { component: SectionFeatures },
	footer: { component: SectionFooter },
	hero: { component: SectionHero },
};

const SectionBuilder = props => {
	const { sections: originalSections = [], options } = props;
	const { sectionComponents = {}, isInsideContainer, ...otherOption } =
		options || {};

	if (!originalSections || originalSections.length === 0) return null;

	// ListingCard component for consultants
	const ListingCard = ({
		avatar,
		name,
		location,
		languages,
		title,
		description,
	}) => (
		<div className="ListingCard_cardWrapper__R65-L ListingCard_profileWrapper__HK17Q">
			<div className="ListingCard_topRow__SK+Yc">
				<div
					className="Avatar_largeAvatar__lvCX- Avatar_avatarBase__M8n7P ListingCard_cardAvatar__HD0eQ"
					title={name}
				>
					<span className="Avatar_initialsLarge__lWsA3 h3">
						{name
							.split(" ")
							.map(n => n[0])
							.join("")}
					</span>
				</div>
				<div className="ListingCard_authorText__rCdLx">
					<p className="ListingCard_authorName__Nc5-B">{name}</p>
					<p className="ListingCard_metaText__r41z3">{location}</p>
					<p className="ListingCard_metaText__r41z3">{languages}</p>
				</div>
			</div>
			<div className="ListingCard_content__q5OAF">
				<p className="ListingCard_title__bH2ez textSmall">{title}</p>
				<p className="ListingCard_description__qlJFz">{description}</p>
			</div>
		</div>
	);

	// ListingCard component for jobs
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

	// Custom sections
	const CustomConsultantsSection = () => (
		<section
			style={{
				width: "100%",
				overflowX: "hidden",
				backgroundColor: "white",
			}}
			id="section-custom-consultants"
		>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "40px 20px",
				}}
			>
				<header className={css.sectionDetails}>
					<h2 className={css.title}>Möt våra konsulter</h2>
					<p
						className={classNames(
							css.description,
							"Ingress_ingress__48pQD"
						)}
					>
						Hitta en konsult som möter just dina krav. Utan att
						behöva anställa!
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
						<ListingCard
							name="Dexter C"
							location="Malmö, Sverige"
							languages="Swedish, English"
							title="SEO-Specialist"
							description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						/>
					</div>
					<div
						style={{
							flex: "1 1 400px",
							maxWidth: "550px",
							minWidth: "320px",
						}}
					>
						<ListingCard
							name="Dexter C"
							location="Malmö, Sverige"
							languages="Swedish, English"
							title="Marknadskoordinator"
							description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						/>
					</div>
				</div>
				<div style={{ marginTop: "24px", textAlign: "center" }}>
					<a
						href="/s?pub_categoryLevel1=consultants_cat"
						className="Link_link__4wfKD SectionBuilder_ctaButton__+OGGi SectionBuilder_align__lJUUr"
						style={{ display: "inline-block" }}
					>
						Se alla konsulter
					</a>
				</div>
			</div>
		</section>
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
						href="/s?pub_categoryLevel1=consultant_job_cat"
						className="Link_link__4wfKD SectionBuilder_ctaButton__+OGGi SectionBuilder_align__lJUUr"
						style={{ display: "inline-block" }}
					>
						Se alla lediga uppdrag
					</a>
				</div>
			</div>
		</section>
	);

	const sections = [...originalSections];

	// SectionBuilder is used for several pages, need to specify to make sure components only end up on correct page
	if (sections[0].sectionName === "Marketplace introduction") {
		sections.splice(
			2,
			0,
			<CustomConsultantsSection key="custom-consultants" />
		);

		sections.splice(4, 0, <CustomJobsSection key="custom-jobs" />);
	}

	// Footer is not part of original sections, comes later, prevent custom sections from appearing below footer
	if (sections[0].sectionId === "footer") {
		sections.splice(1, 10);
	}

	// Merge components
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
		} else {
			sectionIds.push(candidate);
			return candidate;
		}
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
							options={otherOption}
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
