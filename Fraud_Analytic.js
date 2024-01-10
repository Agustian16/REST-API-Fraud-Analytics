const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/analyze-ip', async (req, res) => {
  const results = [];
  fs.createReadStream('path/to/your/file.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const scamalyticsResult = await axios.get(`https://scamalytics.com/ip/${row.ip}`);
      const ipInfoResult = await axios.get(`https://ipinfo.io/${row.ip}/json`);
      
      const analysis = {
        ip: row.ip,
        scamalytics: scamalyticsResult.data,
        ipInfo: ipInfoResult.data
      };
      
      results.push(analysis);
    })
    .on('end', () => {
      res.json(results);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
