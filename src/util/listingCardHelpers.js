export const cityCountryFormat = rawlocation => {
	return rawlocation
		? rawlocation
				.split(", ")
				.filter((_, i) => i !== 1)
				.join(", ")
		: "";
};

export const capitalize = str => {
	return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
};

export const languagesFormat = languages => {
	return Array.isArray(languages) ? languages.map(capitalize).join(", ") : "";
};
