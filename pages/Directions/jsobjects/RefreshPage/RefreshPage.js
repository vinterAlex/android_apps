export default {
  /////////////////////////////////////////////////////

  // This function fetches the latest data and updates the table
  refreshTableData: async () => {
    // Trigger the query to fetch new data (replace with your actual query name)
    await GetGoogleSheetLocations.run();
    
    // Optionally log or show feedback
    console.log('Table data refreshed!');
  },

  // This function sets up the automatic refresh interval
  startAutoRefresh: () => {
    // Refresh every 10 minutes (600,000 ms)
    setInterval(async () => {
      await this.refreshTableData();
    }, 600000); // 600,000 ms = 10 minutes
  },
}
