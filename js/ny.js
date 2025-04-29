// Lista på alla partier
const partier = ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP', 'OVRT', 'BLANK', 'OG', 'OGEJ'];

// Hämta data från 2018
dbQuery.use('undersokning_2018');
let data2018 = await dbQuery(`
  SELECT Omrade, ${partier.join(', ')}
  FROM roster_2018
`);

// Hämta data från 2022
dbQuery.use('undersokning_2022');
let data2022 = await dbQuery(`
  SELECT Omrade, ${partier.join(', ')}
  FROM roster_2022
`);

// Struktur för att hålla röster per kommun och år
let kommunMap = {};

// Bearbeta 2018-data
(data2018.rows || data2018).forEach(row => {
  if (!kommunMap[row.Omrade]) kommunMap[row.Omrade] = {};
  partier.forEach(p => {
    kommunMap[row.Omrade][`${p}_2018`] = parseInt(row[p]) || 0;
  });
});

// Bearbeta 2022-data
(data2022.rows || data2022).forEach(row => {
  if (!kommunMap[row.Omrade]) kommunMap[row.Omrade] = {};
  partier.forEach(p => {
    kommunMap[row.Omrade][`${p}_2022`] = parseInt(row[p]) || 0;
  });
});

// Förbered chartData: ['Kommun', 'S 2018', 'S 2022', 'M 2018', 'M 2022', ...]
let header = ['Kommun'];
partier.forEach(p => {
  header.push(`${p} 2018`, `${p} 2022`);
});

let chartData = [header];

Object.keys(kommunMap).forEach(kommun => {
  let row = [kommun];
  partier.forEach(p => {
    row.push(kommunMap[kommun][`${p}_2018`] || 0);
    row.push(kommunMap[kommun][`${p}_2022`] || 0);
  });
  chartData.push(row);
});

// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: `Riksdagsröster per parti och kommun (2018 vs 2022)`,
    height: 600,
    width: 1400,
    chartArea: { left: '15%', top: '10%' },
    hAxis: { title: 'Kommuner', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Antal röster' },
    legend: { position: 'top' },
    bar: { groupWidth: '80%' },
    isStacked: false
  }
});