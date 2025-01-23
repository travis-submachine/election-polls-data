const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchBettingOdds() {
  try {
    const response = await axios.get('http://api.betdata.io/live?market=general-election-2029&format=decimal');
    const oddsData = response.data.data;

    // Format the data into an array of objects
    const formattedOdds = Object.keys(oddsData).map(key => ({
      party: oddsData[key][0],
      odds: oddsData[key][1]
    }));

    // Save the formatted data to odds.json
    const outputPath = path.join(__dirname, 'odds.json');
    fs.writeFileSync(outputPath, JSON.stringify(formattedOdds, null, 2));

    console.log('Betting odds saved to:', outputPath);
  } catch (error) {
    console.error('Error fetching betting odds:', error.message);
  }
}

// Execute the function
fetchBettingOdds();
