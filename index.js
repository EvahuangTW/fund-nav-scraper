import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import dayjs from 'dayjs';

const CODES = ['S124984', 'A003100057'];
const RESULT = [];

for (const code of CODES) {
  try {
    const res = await axios.get(`https://fund.cnyes.com/fund/${code}`);
    const $ = cheerio.load(res.data);
    const date = $('div.performance-info time').text().trim();
    const nav = $('div.performance-info span.value').first().text().trim();

    RESULT.push({
      fundCode: code,
      date: dayjs().format('YYYY-MM-DD'),
      nav: parseFloat(nav)
    });
  } catch (err) {
    RESULT.push({
      fundCode: code,
      date: dayjs().format('YYYY-MM-DD'),
      nav: null,
      error: '❌'
    });
  }
}

fs.writeFileSync('./data/nav.json', JSON.stringify(RESULT, null, 2));
console.log('✅ NAV updated.');
