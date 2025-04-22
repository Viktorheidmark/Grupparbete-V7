dbQuery.use('riksdagsval-neo4j');

// Hämta data från Neo4j – skriv rätt query
let electionResults = await dbQuery(`
  MATCH (n:Partiresultat)
  RETURN n.kommun AS kommun, n.parti AS parti, n.roster2018 AS roster2018, n.roster2022 AS roster2022
  LIMIT 50
`);

console.log('electionResults:', electionResults);

// Skapa tabellhuvud för Google Charts
let chartData = [['Parti (Kommun)', 'Röster 2018', 'Röster 2022']];

// Bearbeta resultatet om det är en array
if (Array.isArray(electionResults)) {
  electionResults.forEach(row => {
    const namn = row.parti;
    const r2018 = parseInt(row.roster2018) || 0;
    const r2022 = parseInt(row.roster2022) || 0;
    chartData.push([namn, r2018, r2022]);
  });

  // Rita histogrammet
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      title: 'Röster per parti och kommun (2018 vs 2022)',
      height: 600,
      width: 1100,
      chartArea: { left: "15%", top: "10%", width: "80%" },
      hAxis: {
        title: 'Parti (Kommun)',
        slantedText: true,
        slantedTextAngle: 45
      },
      vAxis: { title: 'Antal röster' },
      legend: { position: 'top' },
      bar: { groupWidth: '70%' },
      isStacked: false
    }
  });
} else {
  console.error('❌ Resultatet är inte en array:', electionResults);
}