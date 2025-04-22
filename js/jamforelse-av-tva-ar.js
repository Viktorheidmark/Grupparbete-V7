// Använd rätt databas
dbQuery.use('riksdagsval-neo4j');

let electionResults = await dbQuery(`
    MATCH (n:Partiresultat)
    RETURN n.kommun AS kommun, n.parti AS parti, n.roster2018 AS roster2018, n.roster2022 AS roster2022
    LIMIT 500
`);
console.log('electionResults from neo4j', electionResults);

// Lägg till rubrik
addMdToPage(`
  ## Antal röster per kommun – jämförelse mellan år ${2018} och år ${2022}
`);

// Dropdowns för att välja år
let year1 = addDropdown('År 1', ['2018', '2022'], '2018');
let year2 = addDropdown('År 2', ['2018', '2022'], '2022');

// Visa data i tabell
console.log('Data for table:', electionResults);
tableFromData({
  data: electionResults,
  columnNames: ['Kommun', 'Parti', 'Röster 2018', 'Röster 2022']
});

// Förbered data för diagram
const chartData = electionResults.map(row => [
  row.parti,
  parseInt(row.roster2018) || 0,
  parseInt(row.roster2022) || 0
]);

// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: [['Parti', 'Röster 2018', 'Röster 2022'], ...chartData],
  options: {
    title: 'Jämförelse av röster per parti mellan 2018 och 2022',
    height: 600,
    chartArea: { left: '15%', top: '10%', width: '70%', height: '75%' },
    hAxis: { title: 'Parti' },
    vAxis: { title: 'Antal röster' },
    legend: { position: 'top' },
    isStacked: false
  }
});