export const isConsultant = user => {
	return user.attributes?.profile?.publicData?.userType === "consultant";
};

export const isConsultantWithPost = user => {
	return (
		user.attributes?.hasListings &&
		user.attributes?.profile?.publicData?.userType === "consultant"
	);
};

export const isCustomer = user => {
	return user.attributes?.profile?.publicData?.userType === "customer";
};

export const isUnauthedCustomer = user => {
	return (
		user.effectivePermissionSet?.attributes?.initiateTransactions ===
			"permission/deny" &&
		user.attributes?.profile?.publicData?.userType === "customer"
	);
};
