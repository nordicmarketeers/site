import { ListingCard } from "../../../../components";
import classNames from "classnames";
import css from "../SectionBuilder.module.css";
import hCss from "../../Primitives/Heading/Heading.module.css";
import iCss from "../../Primitives/Ingress/Ingress.module.css";

const CustomJobsSection = props => {
	const { jobListings } = props;

	if (jobListings.length > 0) {
		return (
			<section
				style={{
					width: "100%",
					overflowX: "hidden",
					backgroundColor: "white",
				}}
				id="section-3"
			>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						padding: "40px 20px",
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
							Lediga uppdrag
						</h2>
						<p
							className={classNames(
								css.description,
								iCss.ingress
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
						{jobListings.filter(Boolean).map(listing => (
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
	} else {
		return (
			<div>
				<p>Ett fel uppstod när uppdrag skulle hämtas.</p>
			</div>
		);
	}
};
export default CustomJobsSection;
