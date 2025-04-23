dbQuery.use('undersokning_2018');

// Lista över partier i 2018-data
const partier2018 = ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP', 'FI', 'OVRT'];
let selectedParti = addDropdown('Parti', partier2018);

// Hämta röster för valt parti från 2018-tabellen
let data = await dbQuery(`
  SELECT Omrade, ${selectedParti} AS roster
  FROM roster_2018
`);

console.log("data från roster_2018 för", selectedParti, ":", data);

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
    title: `Röster för ${selectedParti} per kommun (2018)`,
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