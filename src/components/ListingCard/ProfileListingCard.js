import React from "react";
import css from "./ListingCard.module.css";
import NamedLink from "../NamedLink/NamedLink";
import { AvatarLarge } from "../Avatar/Avatar";
import { IoLanguage, IoLocationSharp } from "react-icons/io5";
import { createSlug } from "../../util/urlHelpers";
import {
	cityCountryFormat,
	languagesFormat,
} from "../../util/listingCardHelpers";

const ProfileListingCard = props => {
	const { author, classes, currentListing } = props;

	const { title = "", publicData } = currentListing.attributes;
	const slug = createSlug(title);
	const id = currentListing.id.uuid;

	const cityCountry = cityCountryFormat(publicData?.location?.address);

	const languages = languagesFormat(publicData.languages);

	const authorName = author.attributes.profile.displayName;

	return (
		<NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
			<div
				className={`${css.consultantCardWrapper} ${css.profileWrapper}`}
			>
				<div className={css.topRow}>
					<AvatarLarge
						user={author}
						disableProfileLink
						className={css.cardAvatar}
					/>

					<div className={css.authorText}>
						<p className={css.authorName}>{authorName}</p>
						<p className={css.metaText}>
							<IoLocationSharp />
							{cityCountry}
						</p>
						{languages && (
							<p className={css.metaText}>
								<IoLanguage />
								{languages}
							</p>
						)}
					</div>
				</div>

				<div className={css.content}>
					<p className={css.title}>{title}</p>
					<p className={css.description}>
						{currentListing.attributes.description}
					</p>
				</div>
			</div>
		</NamedLink>
	);
};

export default ProfileListingCard;
