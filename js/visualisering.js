// Hämta data från Neo4j och skapa en Google Chart
async function fetchAndVisualizeData() {
    dbQuery.use('riksdagsval-neo4j');
    let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n ORDER BY n.roster2018 DESC');

    // Kontrollera om data är korrekt hämtad
    if (!Array.isArray(electionResults) || electionResults.length === 0) {
        console.error('Inga valresultat hittades eller datan är inte en array:', electionResults);
        return;
    }

    // Skapa en Google DataTable
    let chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Kommun');
    chartData.addColumn('number', 'Röster 2018');

    // Lägg till data från Neo4j
    electionResults.forEach(result => {
        const { kommun, roster2018 } = result;
        if (kommun && roster2018) {
            chartData.addRow([kommun, roster2018]);
        } else {
            console.warn('Ogiltig data hittades i electionResults:', result);
        }
    });

    // Rita diagrammet
    drawGoogleChart({
        type: 'ColumnChart',
        data: chartData,
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