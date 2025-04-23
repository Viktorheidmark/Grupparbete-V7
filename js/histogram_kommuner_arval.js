// Dropdown för att välja år
const valAar = addDropdown('År', ['2018', '2022']);

// Definiera partilistor per år
const partierPerÅr = {
  '2018': ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP', 'OVRT'],
  '2022': ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP', 'OVRT']
};

// Dropdown för att välja parti baserat på valt år
const selectedParti = addDropdown('Parti', partierPerÅr[valAar]);

// Använd rätt databas
dbQuery.use(`undersokning_${valAar}`);

// Hämta röster för valt parti från rätt tabell
let data = await dbQuery(`
  SELECT Omrade, ${selectedParti} AS roster
  FROM roster_${valAar}
`);

console.log(`data från roster_${valAar} för ${selectedParti}:`, data);

// Skapa chartData: ['Kommun', 'Röster']
let chartData = [['Omrade', 'Röster']];
(data.rows || data).forEach(row => {
  chartData.push([row.Omrade, parseInt(row.roster) || 0]);
});

// Rita stapeldiagram
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: `Röster för ${selectedParti} per kommun (${valAar})`,
    height: 600,
    width: 1200,
    isStacked: false,
    chartArea: { left: '15%', top: '10%' },
    hAxis: { title: 'Kommuner', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Antal röster' },
    legend: { position: 'none' },
    bar: { groupWidth: '80%' }
  }
});