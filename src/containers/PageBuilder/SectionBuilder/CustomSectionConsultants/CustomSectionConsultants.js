import { ListingCard } from "../../../../components";
import classNames from "classnames";
import css from "../SectionBuilder.module.css";
import hCss from "../../Primitives/Heading/Heading.module.css";
import iCss from "../../Primitives/Ingress/Ingress.module.css";
import secCss from "../SectionContainer/SectionContainer.module.css";

const CustomConsultantsSection = props => {
	const { consultantListings } = props;

	if (consultantListings.length > 0) {
		return (
			<section
				style={{
					width: "100%",
					overflowX: "hidden",
					backgroundColor: "white",
				}}
				id="section-3"
				className={secCss.sectionContent}
			>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
					}}
				>
					<header className={css.sectionDetails}>
						<h2
							className={classNames(
								css.title,
								hCss.h2,
								css.heading
							)}
						>
							Möt våra konsulter
						</h2>
						<p
							className={classNames(
								css.description,
								iCss.ingress
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
						{consultantListings.filter(Boolean).map(listing => (
							<div
								key={listing.id?.uuid || listing.id}
								style={{
									flex: "1 1 400px",
									maxWidth: "550px",
									minWidth: "320px",
								}}
							>
								<ListingCard listing={listing} />
							</div>
						))}
					</div>

					<div style={{ marginTop: "24px", textAlign: "center" }}>
						<a
							href="/s?pub_listingType=consultant_profile"
							className={classNames(
								css.link,
								css.ctaButton,
								css.alignCenter
							)}
							style={{ display: "inline-block" }}
						>
							Se alla konsulter
						</a>
					</div>
				</div>
			</section>
		);
	} else {
		return (
			<div>
				<p>Ett fel uppstod när konsulter skulle hämtas.</p>
			</div>
		);
	}
};
export default CustomConsultantsSection;
