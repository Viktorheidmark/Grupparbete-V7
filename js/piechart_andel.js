// Dropdown för att välja år
let valAar = addDropdown('År', ['2018', '2022']);

// Använd rätt databas baserat på valt år
if (valAar === '2018') {
  dbQuery.use('undersokning_2018');
} else {
  dbQuery.use('undersokning_2022');
}

// Välj kolumner som finns i respektive år
const partier = (valAar === '2018')
  ? ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP', 'OVRT']
  : ['S', 'M', 'V', 'SD', 'C', 'KD', 'L', 'MP', 'OVRT'];

// Hämta röster från databasen
let data = await dbQuery(`
  SELECT Omrade, ${partier.join(', ')}
  FROM roster_${valAar}
`);

// Summera röster per kommun
let chartData = [['Kommun', 'Totala röster']];
(data.rows || data).forEach(row => {
  let total = 0;
  partier.forEach(parti => {
    total += parseInt(row[parti]) || 0;
  });
  chartData.push([row.Omrade, total]);
});

// Rita cirkeldiagram
drawGoogleChart({
  type: 'PieChart',
  data: chartData,
  options: {
    title: `Andel röster per kommun (${valAar})`,
    height: 600,
    width: 900,
    pieHole: 0.3, // donut-style
    chartArea: { width: '90%', height: '80%' },
    legend: { position: 'right' }
  }
});