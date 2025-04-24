// Markdown-rubrik
addMdToPage(`
  ### Valresultat från riksdagsvalet 2018 uppdelat per kommun  
  *(Endast för Göteborg, Malmö, Stockholm, Umeå, Helsingborg, Ystad, Landskrona, Piteå, Karlskrona och Skellefteå)*
`);

// Kommunlista
const communes = [
  'Göteborg', 'Malmö', 'Stockholm', 'Umeå', 'Helsingborg',
  'Ystad', 'Landskrona', 'Piteå', 'Karlskrona', 'Skellefteå'
];

// Dropdown för att välja kommun
addMdToPage(`
  <label for="communeDropdown">Välj kommun:</label>
  <select id="communeDropdown">
    ${communes.map(c => `<option value="${c}">${c}</option>`).join('')}
  </select>
`);

// Hämta data från Neo4j
dbQuery.use('riksdagsval-neo4j');
let electionResultsRaw = await dbQuery(`
  MATCH (n:Partiresultat)
  WHERE n.kommun IN ${JSON.stringify(communes)}
  RETURN n
  ORDER BY n.kommun, n.parti
`);

// Extrahera noddata
let electionResults = electionResultsRaw.map(res => res.n);

// Renderingsfunktion
function updateVisualization() {
  const selectedCommune = document.getElementById('communeDropdown').value;

  // Filtrera valda kommunens resultat för 2018
  const filteredResults = electionResults.filter(item =>
    item.kommun === selectedCommune && item.roster2018 != null
  );

  // Visa rubrik
  addMdToPage(`
    ## Röster per parti i ${selectedCommune} (2018)
  `);

  // Visa tabell
  tableFromData({
    data: filteredResults.map(({ kommun, parti, roster2018 }) => ({
      kommun,
      parti,
      roster2018
    }))
  });

  // Förbered Google Chart-data
  const chartData = [['Parti', 'Röster']];
  filteredResults.forEach(item => {
    chartData.push([item.parti, Number(item.roster2018)]);
  });

  // Rita Google ColumnChart
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      title: `Valresultat i ${selectedCommune} (2018)`,
      height: 500,
      width: 1000,
      hAxis: { title: 'Parti' },
      vAxis: { title: 'Antal röster' },
      legend: { position: 'none' }
    }
  });
}

// Eventlyssnare
document.getElementById('communeDropdown').addEventListener('change', updateVisualization);

// Första visning
updateVisualization();
