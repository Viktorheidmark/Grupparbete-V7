dbQuery.use('kommun-info-mongodb');

// Hämta inkomstdata per kommun (topp 25)
let income = await dbQuery.collection('incomeByKommun').find({}).limit(25);
console.log('income from mongodb', income);

// Sortera efter högst medelinkomst 2022
income.sort((a, b) => (b.medelInkomst2022 || 0) - (a.medelInkomst2022 || 0));

// Skapa data för Google Chart
let chartData = [['Kommun', 'Medelinkomst 2022']];
income.forEach(row => {
  chartData.push([row.kommun, parseFloat(row.medelInkomst2022) || 0]);
});

// Rita histogrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: "Medelinkomst per kommun (2022, topp 25)",
    height: 600,
    width: 1000,
    chartArea: { left: "15%", top: "10%" },
    hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Medelinkomst (tusen kr)' },
    legend: { position: 'none' },
    bar: { groupWidth: '80%' }
  }
});