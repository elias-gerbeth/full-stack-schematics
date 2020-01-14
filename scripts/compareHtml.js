const fs = require('fs');
const Cheerio = require('cheerio');

const html1 = fs.readFileSync('./scripts/page_1.html').toString();
const html2 = fs.readFileSync('./scripts/page_2.html').toString();

function process(html) {
  const $ = Cheerio.load(html);
  $('script').remove();
  html = $('body').html();
  return html
    .replace(/\?(v=)?\d+/gi, '');
}

const rep1 = process(html1);
const rep2 = process(html2);

console.log('is equal: ', rep1 === rep2);

fs.writeFileSync('./scripts/rep_1.html', rep1);
fs.writeFileSync('./scripts/rep_2.html', rep2);
