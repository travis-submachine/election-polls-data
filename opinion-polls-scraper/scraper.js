const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://en.wikipedia.org/wiki/Opinion_polling_for_the_next_United_Kingdom_general_election';

async function scrapePollingData() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const polls = [];
    const table = $('table.wikitable').first();

    table.find('tbody tr').each((index, element) => {
      if (index === 0) return; // Skip the header row

      const cells = $(element).find('td');
      const pollster = $(cells[0]).text().trim();
      const date = $(cells[1]).text().trim();
      const labour = parseFloat($(cells[2]).text().replace('%', '')) || 0;
      const conservative = parseFloat($(cells[3]).text().replace('%', '')) || 0;
      const reform = parseFloat($(cells[4]).text().replace('%', '')) || 0;
      const libDems = parseFloat($(cells[5]).text().replace('%', '')) || 0;
      const green = parseFloat($(cells[6]).text().replace('%', '')) || 0;

      // Calculate the missing percentage
      const other = 100 - (labour + conservative + reform + libDems + green);

      if (pollster && labour && conservative && reform) {
        polls.push({
          pollster,
          date,
          parties: [
            { name: "Labour", percentage: labour },
            { name: "Conservative", percentage: conservative },
            { name: "Reform", percentage: reform },
            { name: "Lib Dems", percentage: libDems },
            { name: "Green", percentage: green },
            { name: "Other", percentage: other }
          ]
        });
      }
    });

    // Save to the root of election-polls-data
    const outputPath = path.join(__dirname, '../polls.json');
    fs.writeFileSync(outputPath, JSON.stringify(polls, null, 2));
    console.log('Polling data saved to:', outputPath);
  } catch (error) {
    console.error('Error scraping polling data:', error);
  }
}

scrapePollingData();