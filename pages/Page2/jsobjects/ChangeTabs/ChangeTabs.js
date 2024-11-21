export default {
	handleTabChange: () => {
		const selectedTab = Tabs1.selectedTab; // Access the selectedTab property from the Tabs widget
		if (selectedTab === "Cats") {
			navigateTo("/Page1");  // Navigate to Page1
		} else if (selectedTab === "Maps") {
			navigateTo("/Directions");  // Navigate to Page2
		}
	}
}
