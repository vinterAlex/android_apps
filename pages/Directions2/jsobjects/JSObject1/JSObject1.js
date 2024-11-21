export default {
	/////////////////////////////////////////////////////

	checkLocationPermissions: () => {
		return appsmith.geolocation.canBeRequested
	},

	getUserLocation: async () => {
		if(appsmith.geolocation.canBeRequested){
			appsmith.geolocation.getCurrentPosition()
		}
	},

	tryGetLocation: async () => {
		try{
			appsmith.geolocation.getCurrentPosition()
		}catch(error){
			return error
		}
	},


	getSelectOptions: (data, labelKey, valueKey) => {  
		// creates a deduplicated array of SelectOptions from data 
		let dupValues = data.map(row => {return {'label':row[labelKey], 'value':row[valueKey]}});
		let output = {};
		dupValues.forEach(option => {output[option.label] = option});
		let outputProps = Object.getOwnPropertyNames(output);
		// duplicate labels get overwritten with the last value
		let options = outputProps.map(prop => output[prop]);
		return _.sortBy(options, 'value')
	},

	navigateToMap: async () => {
		const currentPosition = await appsmith.geolocation.getCurrentPosition();
		const url = 'www.google.com/maps/dir/' + currentPosition.coords.latitude + ',' + currentPosition.coords.longitude + '/' + Table1.selectedRow.latitude + ',' + Table1.selectedRow.longitude;
		await navigateTo(url, {}, 'NEW_WINDOW');
	},

}