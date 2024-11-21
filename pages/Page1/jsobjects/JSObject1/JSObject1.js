export default {
	/////////////////////////////////////////////////////

	// Function to check if location permissions can be requested
	checkLocationPermissions: () => {
		return appsmith.geolocation.canBeRequested;
	},

	// Function to get the user's current location
	getUserLocation: async () => {
		if (appsmith.geolocation.canBeRequested) {
			try {
				const position = await appsmith.geolocation.getCurrentPosition();
				return position.coords;  // Return the coordinates
			} catch (error) {
				console.error('Error fetching location:', error);
				return null;  // In case of an error, return null
			}
		} else {
			console.warn('Location permissions cannot be requested at this time.');
			return null;
		}
	},

	// Function to attempt getting the user's location with error handling
	tryGetLocation: async () => {
		try {
			const position = await appsmith.geolocation.getCurrentPosition();
			return position.coords;  // Return the coordinates if successful
		} catch (error) {
			console.error('Error fetching location:', error);
			return null;  // Return null if an error occurs
		}
	},

	// Function to get options from a data array and deduplicate based on label
	getSelectOptions: (data, labelKey, valueKey) => {  
		let dupValues = data.map(row => { return { 'label': row[labelKey], 'value': row[valueKey] } });
		let output = {};
		dupValues.forEach(option => { output[option.label] = option });
		let outputProps = Object.getOwnPropertyNames(output);
		let options = outputProps.map(prop => output[prop]);
		return _.sortBy(options, 'value');
	},

	navigateToMap: async () => {
		const currentPosition = await appsmith.geolocation.getCurrentPosition();

		// Check if coordinates are available
		if (!currentPosition || !currentPosition.coords) {
			console.error("Couldn't fetch user location.");
			return;
		}

		const userLat = currentPosition.coords.latitude;
		const userLon = currentPosition.coords.longitude;

		// Log for debugging
		console.log('User Latitude:', userLat);
		console.log('User Longitude:', userLon);

		// Check if a row is selected in Table1
		let selectedRow = Table1.selectedRow || null;

		if (selectedRow) {
			// Update the existing row with new location
			try {
				const updateResponse = await GoogleSheetsInsert.run({
					rowIndex: Table1.selectedRowIndex, // Row index to update
					latitude: userLat,
					longitude: userLon
				});
				console.log("Row updated:", updateResponse);
			} catch (error) {
				console.error("Error updating Google Sheets:", error);
			}
		} else {
			// Insert a new row with current location
			try {
				const insertResponse = await GoogleSheetsInsert.run({
					id: appsmith.user.name,
					gender: "unknown",
					latitude: userLat,
					longitude: userLon,
					country: Select1.selectedOptionLabel,
					email: appsmith.user.email,
					name: appsmith.user.name,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				});
				console.log("New row inserted:", insertResponse);
			} catch (error) {
				console.error("Error inserting into Google Sheets:", error);
			}
		}

		// Construct URL for Google Maps navigation
		const url = `https://www.google.com/maps/dir/${userLat},${userLon}/${selectedRow ? selectedRow.latitude : userLat},${selectedRow ? selectedRow.longitude : userLon}`;

		// Open the map in a new window
		await navigateTo(url, {}, 'NEW_WINDOW');
	},

	// Function to insert data into Google Sheets
	insertIntoGoogleSheet: async (data) => {
		// Assuming `GoogleSheetsInsert` query is set up to insert data into your Google Sheet
		const insertResponse = await GoogleSheetsInsert.run(data);
		console.log('Google Sheets Insert Response:', insertResponse);
	}
}
