const syncRequest = require('sync-request');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');

const dcResultUrl = year =>
  `https://www.elections.gov.hk/dc${year}/chi/results_hk.html`;

const ElectionResultJSONpath = year => `./dc${year}.json`;
const ElectionResult = {
  year: '2015',
  Constituency: [],
  Candidate: []
};

const Year = '2019';

const getData = year => {
  const res = syncRequest('GET', dcResultUrl(year));
  const xml = res.getBody('utf8');
  const doc = new dom().parseFromString(xml);
  const td = xpath.select('//table[@id="table-district-member"]/tr/td', doc);
  let code = '', district = '', i = 0;
  while (i < td.length) {
    if (td[i].attributes.length === 1) {
      code = td[i].childNodes[0].data;
      district = td[i+1].childNodes[0].data;
      i += 2;
    }
    const nbr = td[i].childNodes[0].data;
    const name = td[i+1].childNodes[0].data;
    const vote = td[i+2].childNodes[1].data;
    console.log(code,' ',district,' ',nbr,' ',name,' ',vote);
    i += 3;
  }
};

getData(Year);

//fs.writeFileSync(ElectionResultJSONpath(Year), JSON.stringify(ElectionResult));
