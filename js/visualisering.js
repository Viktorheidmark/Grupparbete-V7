// Hämta data från Neo4j och skapa Google Charts
async function fetchAndVisualizeData() {
    dbQuery.use('riksdagsval-neo4j');
    let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n ORDER BY n.roster2018 DESC');
 
    if (!Array.isArray(electionResults) || electionResults.length === 0) {
        console.error('Inga valresultat hittades eller datan är inte en array:', electionResults);
        return;
    }
 
    let allCommmunNames = [...new Set(electionResults.map(({ kommun }) => kommun))];
 
    let votesPerCommun = allCommmunNames.map(kommun => ({
        kommun,
        votes2018_V: electionResults.find(x => x.parti === 'Vänsterpartiet' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_S: electionResults.find(x => x.parti === 'Arbetarepartiet-Socialdemokraterna' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_MP: electionResults.find(x => x.parti === 'Miljöpartiet de gröna' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_C: electionResults.find(x => x.parti === 'Centerpartiet' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_L: electionResults.find(x => x.parti === 'Liberalerna ' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_KD: electionResults.find(x => x.parti === 'Kristdemokraterna' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_M: electionResults.find(x => x.parti === 'Moderaterna' && x.kommun === kommun)?.roster2018 || 0,
        votes2018_SD: electionResults.find(x => x.parti === 'Sverigedemokraterna' && x.kommun === kommun)?.roster2018 || 0
    }));
 
    const selectedCommunes = [
        'Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
        'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'
    ];
 
    const högarbetslöshetCommunes = ['Flen', 'Perstorp', 'Malmö', 'Eskilstuna', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'];
    const lågarbetslöshetCommunes = ['Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];
 
    let filteredResults = votesPerCommun.filter(({ kommun }) => selectedCommunes.includes(kommun));
 
    let högArbetsloshetKommuner = filteredResults.filter(x => högarbetslöshetCommunes.includes(x.kommun));
    let lågArbetsloshetKommuner = filteredResults.filter(x => lågarbetslöshetCommunes.includes(x.kommun));
 
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(högArbetsloshetKommuner),
        options: {
            title: 'Kommuner med hög arbetslöshet (2018)',
            height: 600,
            width: 1200,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'none' }
        }
    });
 
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(lågArbetsloshetKommuner),
        options: {
            title: 'Kommuner med låg arbetslöshet (2018)',
            height: 600,
            width: 1200,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'none' }
        }
    });
 
    drawGoogleChart({
        type: 'PieChart',
        data: makeChartFriendly(högArbetsloshetKommuner),
        options: {
            title: 'Andel röster i kommuner med hög arbetslöshet',
            height: 500,
            width: 800,
            is3D: true,
            legend: { position: 'right' }
        }
    });
 
    drawGoogleChart({
        type: 'PieChart',
        data: makeChartFriendly(lågArbetsloshetKommuner),
        options: {
            title: 'Andel röster i kommuner med låg arbetslöshet',
            height: 500,
            width: 800,
            is3D: true,
            legend: { position: 'right' }
        }
    });
}
 
fetchAndVisualizeData();