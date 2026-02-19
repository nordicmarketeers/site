import React from "react";
import css from "./ListingCard.module.css";
import NamedLink from "../NamedLink/NamedLink";
import { IoLocationSharp } from "react-icons/io5";
import { createSlug } from "../../util/urlHelpers";
import noPfp from "../../assets/no_pfp.jpg";
import { capitalize, cityCountryFormat } from "../../util/listingCardHelpers";

const JobListingCard = props => {
	const { author, classes, currentListing } = props;

	const { title = "", price, publicData } = currentListing.attributes;
	const slug = createSlug(title);
	const id = currentListing.id.uuid;

	const authorImgURL =
		author.profileImage?.attributes.variants["square-small"]?.url || noPfp;

	const cityCountry = cityCountryFormat(publicData?.location?.address);

	return (
		<NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
			<div className={css.jobCardWrapper}>
				<div className={css.imageWrapper}>
					<img src={authorImgURL} className={css.squareImg} />
				</div>
				<div className={css.info}>
					<p className={css.jobTitle} title={title}>
						{title}
					</p>
					<p className={css.jobLocation}>
						<IoLocationSharp />
						{cityCountry ? cityCountry : "Ingen plats satt"}
					</p>

					<div className={css.tagRow}>
						{publicData?.role?.[0] && (
							<span className={css.tag}>
								{capitalize(
									publicData.role[0].replace("_", " ")
								)}
							</span>
						)}
						{publicData?.work_model && (
							<span className={css.tag}>
								{capitalize(publicData.work_model)}
							</span>
						)}
						{publicData?.extent.map(item => (
							<span key={item} className={css.tag}>
								{capitalize(item.replace("_", " "))}
							</span>
						))}
					</div>
				</div>
			</div>
		</NamedLink>
	);
};

export default JobListingCard;
