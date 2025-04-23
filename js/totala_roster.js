// Hämta data för 2018
dbQuery.use('undersokning_2018');
let data2018 = await dbQuery('SELECT M,C,L,KD,S,V,MP,SD FROM roster_2018');

// Summera totalen för 2018
let total2018 = 0;
(data2018.rows || data2018).forEach(row => {
  for (let key of ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP']) {
    total2018 += parseInt(row[key]) || 0;
  }
});

// Hämta data för 2022
dbQuery.use('undersokning_2022');
let data2022 = await dbQuery('SELECT S,C,KD,L,MP,M,SD,V FROM roster_2022');

// Summera totalen för 2022
let total2022 = 0;
(data2022.rows || data2022).forEach(row => {
  for (let key of ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP']) {
    total2022 += parseInt(row[key]) || 0;
  }
});

// Bygg data till Gauge-diagrammet
let chartData = [
  ['År', 'Totala röster'],
  ['2018', total2018],
  ['2022', total2022]
];

// Rita Gauge-diagram
drawGoogleChart({
  type: 'Gauge',
  data: chartData,
  options: {
    title: 'Totalt antal röster per valår',
    width: 500,
    height: 250,
    redFrom: 0,
    redTo: Math.max(total2018, total2022) * 0.5,
    yellowFrom: Math.max(total2018, total2022) * 0.5,
    yellowTo: Math.max(total2018, total2022) * 0.85,
    greenFrom: Math.max(total2018, total2022) * 0.85,
    greenTo: Math.max(total2018, total2022),
    minorTicks: 5
  }
});