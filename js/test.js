addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 och 2022 uppdelade efter kommuner
  (Endast för Göteborg, Malmö, Stockholm, Umeå, Helsingborg, Ystad, Landskrona, Piteå, Karlskrona och Skellefteå.)
`);

dbQuery.use('riksdagsval-neo4j');
let electionResults = await dbQuery(`
  MATCH (n:Partiresultat)
  WHERE n.kommun IN ['Göteborg', 'Malmö', 'Stockholm', 'Umeå', 'Helsingborg', 'Ystad', 'Landskrona', 'Piteå', 'Karlskrona', 'Skellefteå']
  RETURN n LIMIT 500
`);
// Kontrollera om data är korrekt hämtad
if (!Array.isArray(electionResults) || electionResults.length === 0) {
    console.error('Inga valresultat hittades eller datan är inte en array:', electionResults);
    return;
}

// Skapa dropdown för valår (2018)
let yearDropdown = addDropdown('Välj år', '2018');

// Skapa dropdown för kommuner
let communeDropdown = addDropdown('Välj kommun',
    ['Göteborg', 'Malmö', 'Stockholm', 'Umeå', 'Helsingborg', 'Ystad', 'Landskrona', 'Piteå', 'Karlskrona', 'Skellefteå'],
    'Göteborg'
);

// Definiera stora och små kommuner
let largeCommunes = ['Göteborg', 'Malmö', 'Stockholm', 'Umeå', 'Helsingborg'];
let smallCommunes = ['Ystad', 'Landskrona', 'Piteå', 'Karlskrona', 'Skellefteå'];

// Lägger till en rubrik för att beskriva röster per parti
addMdToPage(`
  ## Röster per parti (${yearDropdown.value} - ${communeDropdown.value})
`);

// Filtrera electionResults baserat på det valda året och kommunen
let filteredResults = electionResults.filter(item =>
    item.kommun === communeDropdown.value && item.year === yearDropdown.value
);

// Dela upp och visa resultaten för stora kommuner
let largeCommunesResults = filteredResults.filter(item => largeCommunes.includes(item.kommun));
tableFromData({
    data: largeCommunesResults.map(({ ids, kommun, roster2018, roster2022, parti, labels }) => ({
        ids: ids.identity,
        kommun,
        roster2018,
        roster2022,
        parti,
        labels
    }))
});

// Dela upp och visa resultaten för små kommuner
let smallCommunesResults = filteredResults.filter(item => smallCommunes.includes(item.kommun));
tableFromData({
    data: smallCommunesResults.map(({ ids, kommun, roster2018, roster2022, parti, labels }) => ({
        ids: ids.identity,
        kommun,
        roster2018,
        roster2022,
        parti,
        labels
    }))
});

console.log('electionResults from neo4j', electionResults);

console.log('Filtered results:', filteredResults);
console.log('Large communes results:', largeCommunesResults);
console.log('Small communes results:', smallCommunesResults);

let chartData = electionResults.map(({ kommun, roster2018 }) => ({ kommun, roster2018 }));



drawGoogleChart({
    type: 'ColumnChart',
    data: chartDataStoraKommuner,
    options: {
        title: 'Röster i stora kommuner (2018)',
        height: 500,
        width: 1000,
        hAxis: { title: 'Kommun' },
        vAxis: { title: 'Antal röster' },
        legend: { position: 'none' }
    }
});
drawGoogleChart({
    type: 'ColumnChart',
    data: chartDataSmåKommuner,
    options: {
        title: 'Röster i små kommuner (2018)',
        height: 500,
        width: 1000,
        hAxis: { title: 'Kommun' },
        vAxis: { title: 'Antal röster' },
        legend: { position: 'none' }
    }
});