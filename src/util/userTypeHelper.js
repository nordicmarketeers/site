export const isConsultant = currentUser => {
	return (
		currentUser.attributes?.profile?.publicData?.userType === "consultant"
	);
};

export const isConsultantWithPost = currentUser => {
	return (
		currentUser.attributes?.hasListings &&
		currentUser.attributes?.profile?.publicData?.userType === "consultant"
	);
};

export const isCustomer = currentUser => {
	return currentUser.attributes?.profile?.publicData?.userType === "customer";
};

export const isUnauthedCustomer = currentUser => {
	return (
		currentUser.effectivePermissionSet?.attributes?.initiateTransactions ===
			"permission/deny" &&
		currentUser.attributes?.profile?.publicData?.userType === "customer"
	);
};
