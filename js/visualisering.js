// Hämta data från Neo4j och skapa Google Charts
async function fetchAndVisualizeData() {
    dbQuery.use('riksdagsval-neo4j');
    let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n ORDER BY n.roster2018 DESC');

    addMdToPage(`
        ## Hypotes
  ## När jag kollade på siffrorna såg att både Socialdemokraterna och Sverigedemokraterna har stigt i röster.
  ## Påverkar arbetslöshet hur man röstar?
  * Jag har valt 10 kommuner med högsta arbetslöshet och 10 med lägst arbetslöshet.
  * Undersöker valresultatet 2018 för alla riksdagspartier.
  
`);

    if (!Array.isArray(electionResults) || electionResults.length === 0) {
        console.error('Inga valresultat hittades eller datan är inte en array:', electionResults);
        return;
    }

    // === Partifärger ===
    const partyColorMap = {
        S: '#ed1b34',
        M: '#52bdec',
        SD: '#ffed00',
        V: '#af1e2d',
        MP: '#83cf39',
        C: '#009933',
        L: '#006ab6',
        KD: '#1b365d',

    };

    const colorOrder = ['S', 'M', 'SD', 'V', 'S', 'MP', 'C', 'L', 'KD'];
    const partifärger = colorOrder.map(kod => partyColorMap[kod]);

    const selectedCommunes = [
        'Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken',
        'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
        'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö',
        'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'
    ];

    const högarbetslöshetCommunes = [
        'Flen', 'Perstorp', 'Malmö', 'Eskilstuna', 'Fagersta',
        'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'
    ];

    const lågarbetslöshetCommunes = [
        'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö',
        'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'
    ];

    let allCommmunNames = [...new Set(electionResults.map(({ kommun }) => kommun))];

    let votesPerCommun = allCommmunNames.map(kommun => ({
        kommun,
        S: electionResults.find(x => x.parti === 'Arbetarepartiet-Socialdemokraterna' && x.kommun === kommun)?.roster2018 || 0,
        M: electionResults.find(x => x.parti === 'Moderaterna' && x.kommun === kommun)?.roster2018 || 0,
        SD: electionResults.find(x => x.parti === 'Sverigedemokraterna' && x.kommun === kommun)?.roster2018 || 0,
        V: electionResults.find(x => x.parti === 'Vänsterpartiet' && x.kommun === kommun)?.roster2018 || 0,

        MP: electionResults.find(x => x.parti === 'Miljöpartiet de gröna' && x.kommun === kommun)?.roster2018 || 0,
        C: electionResults.find(x => x.parti === 'Centerpartiet' && x.kommun === kommun)?.roster2018 || 0,
        L: electionResults.find(x => x.parti === 'Liberalerna ' && x.kommun === kommun)?.roster2018 || 0,
        KD: electionResults.find(x => x.parti === 'Kristdemokraterna' && x.kommun === kommun)?.roster2018 || 0,

    }));

    let filteredResults = votesPerCommun.filter(({ kommun }) => selectedCommunes.includes(kommun));

    let högArbetsloshetKommuner = filteredResults.filter(x => högarbetslöshetCommunes.includes(x.kommun));
    let lågArbetsloshetKommuner = filteredResults.filter(x => lågarbetslöshetCommunes.includes(x.kommun));

    // === Diagram: Kolumner hög arbetslöshet ===
    addMdToPage(`## Kommuner med hög arbetslöshet (2018)`);
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(högArbetsloshetKommuner),
        options: {
            title: 'Partiröster i kommuner med hög arbetslöshet',
            height: 600,
            width: 1200,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'top' },
            colors: partifärger
        }
    });

    // === Diagram: Kolumner låg arbetslöshet ===
    addMdToPage(`## Kommuner med låg arbetslöshet (2018)`);
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(lågArbetsloshetKommuner),
        options: {
            title: 'Partiröster i kommuner med låg arbetslöshet',
            height: 600,
            width: 1200,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'top' },
            colors: partifärger
        }
    });

    // === Sammanlagd fördelning som PieChart ===
    const sumVotes = (data, key) => data.reduce((sum, row) => sum + (row[key] || 0), 0);

    const pieDataHög = [['Parti', 'Röster'], ...colorOrder.map(p => [p, sumVotes(högArbetsloshetKommuner, p)])];
    const pieDataLåg = [['Parti', 'Röster'], ...colorOrder.map(p => [p, sumVotes(lågArbetsloshetKommuner, p)])];

    addMdToPage(`## Andel röster i kommuner med hög arbetslöshet (2018)`);
    drawGoogleChart({
        type: 'PieChart',
        data: pieDataHög,
        options: {
            title: 'Röstfördelning i högarbetslösa kommuner',
            height: 500,
            width: 1200,
            is3D: true,
            colors: partifärger
        }
    });

    addMdToPage(`## Andel röster i kommuner med låg arbetslöshet (2018)`);
    drawGoogleChart({
        type: 'PieChart',
        data: pieDataLåg,
        options: {
            title: 'Röstfördelning i lågarbetslösa kommuner',
            height: 500,
            width: 1200,
            is3D: true,
            colors: partifärger
        }
    });
}



addMdToPage(`## Slutsatser:

## Efter hela min undersökning så märkte jag att:
* Socialdemokraternas röstandel är jämnt fördelad över kommunerna. Det innebär att deras röster är normalfördelat,
 utan extremt höga eller låga resultat i någon särskild grupp. Partiet har en bred och jämn väljare över landet.
* Sverigedemokraterna röstandel är ojämnt fördelad. Stödet varierar mycket mellan kommunerna, och vissa kommuner 
har väldigt höga siffror medan andra har lågt stöd. Sverigedemokraternas stöd verkar vara starkt knutet till lokala 
förutsättningar än geografiskt som arbetslöshet.
 Stödet varierar kraftigt beroende på kommuntyp - partiet är starkt i vissa mindre kommuner men har svagare stöd i storstäder.

`);



