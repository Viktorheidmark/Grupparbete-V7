dbQuery.use('valdata');

// Steg 1: Hämta tillgängliga år
let valdata = (await dbQuery('SELECT DISTINCT Ar FROM valresultat')).map(x => x.Ar);

// Steg 2: Dropdown för år
let currentage = addDropdown('Ar', valdata);

addMdToPage(`
  ## Mandatfördelning i riksdagen (${currentage})
`);

// Steg 3: Hämta mandatfördelning för valt år
let dataForChart = await dbQuery(
  `SELECT Parti, Mandat FROM valresultat WHERE Ar = '${currentage}' ORDER BY Parti`
);

// Steg 4: Färgkarta för riksdagspartier
const partifarger = {
  'Socialdemokraterna': '#e31a1c',
  'Moderaterna': '#1f78b4',
  'Sverigedemokraterna': '#ffcc00',
  'Centerpartiet': '#33a02c',
  'Vänsterpartiet': '#b2182b',
  'Kristdemokraterna': '#191970',
  'Liberalerna': '#6baed6',
  'Miljöpartiet': '#66c2a5'
};

// Skapa färgarray i rätt ordning
let partier = dataForChart.map(row => row.Parti);
let colors = partier.map(p => partifarger[p] || '#999');

// Steg 5: Rita cirkeldiagrammet
drawGoogleChart({
  type: 'PieChart',
  data: makeChartFriendly(dataForChart, 'Parti'),
  options: {
    height: 500,
    width: 800,
    pieHole: 0.4, // gör det till ett donut-diagram (kan tas bort)
    colors: colors,
    legend: { position: 'right', textStyle: { fontSize: 14 } },
    chartArea: { width: '70%', height: '80%' }
  }
});