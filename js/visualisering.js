// Hämta data från Neo4j och skapa en Google Chart
async function fetchAndVisualizeData() {
    dbQuery.use('riksdagsval-neo4j');
    let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n ORDER BY n.roster2018 DESC');

    // Kontrollera om data är korrekt hämtad
    if (!Array.isArray(electionResults) || electionResults.length === 0) {
        console.error('Inga valresultat hittades eller datan är inte en array:', electionResults);
        return;
    }

    console.log("Här ser vi komuner", electionResults)


    // Kommunlista att inkludera
    const selectedCommunes = [
        'Göteborg', 'Malmö', 'Stockholm', 'Umeå', 'Helsingborg',
        'Ystad', 'Landskrona', 'Piteå', 'Karlskrona', 'Skellefteå'
    ];

    // Filtrera data för endast de valda kommunerna
    let filteredResults = electionResults.filter(({ kommun }) =>
        selectedCommunes.includes(kommun)
    );

    console.log("Filtrerade kommuner", filteredResults);



    // Skapa en Google DataTable

    let chartData = filteredResults.map(({ kommun, roster2018 }) => ({ kommun, roster2018 }));

    // Rita diagrammet
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(chartData),
        options: {
            title: 'Röster i kommuner (2018)',
            height: 500,
            width: 1000,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'none' }
        }
    });
}

// Kör funktionen
fetchAndVisualizeData();