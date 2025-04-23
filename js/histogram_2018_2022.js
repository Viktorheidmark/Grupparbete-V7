// Välj båda databaserna
const partier = ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP','OVRT','BLANK', 'OG','OGEJ'];
let selectedParti = addDropdown('Parti', partier);

// Hämta data från 2018
dbQuery.use('undersokning_2018');
let data2018 = await dbQuery(`
  SELECT Omrade, ${selectedParti} AS roster
  FROM roster_2018
`);

// Hämta data från 2022
dbQuery.use('undersokning_2022');
let data2022 = await dbQuery(`
  SELECT Omrade, ${selectedParti} AS roster
  FROM roster_2022
`);

// Skapa en kommun-baserad sammanställning
let kommunMap = {};

(data2018.rows || data2018).forEach(row => {
  if (!kommunMap[row.Omrade]) kommunMap[row.Omrade] = {};
  kommunMap[row.Omrade].r2018 = parseInt(row.roster) || 0;
});

(data2022.rows || data2022).forEach(row => {
  if (!kommunMap[row.Omrade]) kommunMap[row.Omrade] = {};
  kommunMap[row.Omrade].r2022 = parseInt(row.roster) || 0;
});

// Förbered chartData
let chartData = [['Kommun', '2018', '2022']];
Object.keys(kommunMap).forEach(kommun => {
  chartData.push([
    kommun,
    kommunMap[kommun].r2018 || 0,
    kommunMap[kommun].r2022 || 0
  ]);
});

// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: `Röster för ${selectedParti} per kommun: 2018 vs 2022`,
    height: 600,
    width: 1200,
    chartArea: { left: '15%', top: '10%' },
    hAxis: { title: 'Kommuner', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Antal röster' },
    legend: { position: 'top' },
    bar: { groupWidth: '70%' },
    isStacked: false
  }
});