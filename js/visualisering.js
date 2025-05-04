
// Hämta data från Neo4j och skapa Google Charts
async function fetchAndVisualizeData(year) {
    dbQuery.use('riksdagsval-neo4j');

    let electionResults = await dbQuery(`MATCH (n:Partiresultat) RETURN n ORDER BY n.roster${year} DESC`);

    // Lägger en text till min sida
    addMdToPage(`
        ## Hypotes:
        När jag kollade på siffrorna såg att de största partier Socialdemokraterna, Sverigedemokraterna 
        och Moderaterna har stigit i röster.
        ## Vill veta påverkar arbetslöshet och inkomst hur man röstar?
        * Jag har valt 10 kommuner med högsta arbetslöshet och 10 med lägst arbetslöshet.
        * Undersöker valresultatet ${year} för alla riksdagspartier.
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

    const colorOrder = ['S', 'M', 'SD', 'V', 'MP', 'C', 'L', 'KD'];
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
        S: electionResults.find(x => x.parti === 'Arbetarepartiet-Socialdemokraterna' && x.kommun === kommun)?.[`roster${year}`] || 0,
        M: electionResults.find(x => x.parti === 'Moderaterna' && x.kommun === kommun)?.[`roster${year}`] || 0,
        SD: electionResults.find(x => x.parti === 'Sverigedemokraterna' && x.kommun === kommun)?.[`roster${year}`] || 0,
        V: electionResults.find(x => x.parti === 'Vänsterpartiet' && x.kommun === kommun)?.[`roster${year}`] || 0,
        MP: electionResults.find(x => x.parti === 'Miljöpartiet de gröna' && x.kommun === kommun)?.[`roster${year}`] || 0,
        C: electionResults.find(x => x.parti === 'Centerpartiet' && x.kommun === kommun)?.[`roster${year}`] || 0,
        L: electionResults.find(x => x.parti === 'Liberalerna ' && x.kommun === kommun)?.[`roster${year}`] || 0,
        KD: electionResults.find(x => x.parti === 'Kristdemokraterna' && x.kommun === kommun)?.[`roster${year}`] || 0,
    }));

    let filteredResults = votesPerCommun.filter(({ kommun }) => selectedCommunes.includes(kommun));

    let högArbetsloshetKommuner = filteredResults.filter(x => högarbetslöshetCommunes.includes(x.kommun));
    let lågArbetsloshetKommuner = filteredResults.filter(x => lågarbetslöshetCommunes.includes(x.kommun));

    // === Diagram: Kolumner hög arbetslöshet ===
    addMdToPage(`## Kommuner med hög arbetslöshet (${year})`);
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(högArbetsloshetKommuner),
        options: {
            title: `Partiröster i kommuner med hög arbetslöshet (${year})`,
            height: 600,
            width: 1200,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'top' },
            colors: partifärger
        }
    });

    addMdToPage(`
        ## Vi ser att kommuner med hög arbetslöshet har tendens att rösta på 'S', 'M', 'SD' 
        med en stor diferens med de andra partier.
    `);


    // === Diagram: Kolumner låg arbetslöshet ===
    addMdToPage(`## Kommuner med låg arbetslöshet (${year})`);
    drawGoogleChart({
        type: 'ColumnChart',
        data: makeChartFriendly(lågArbetsloshetKommuner),
        options: {
            title: `Partiröster i kommuner med låg arbetslöshet (${year})`,
            height: 600,
            width: 1200,
            hAxis: { title: 'Kommun' },
            vAxis: { title: 'Antal röster' },
            legend: { position: 'top' },
            colors: partifärger
        }
    });

    addMdToPage(`
        ## Vi ser att kommuner med låg arbetslöshet också har tendens att rösta på 'S', 'M', 'SD'
         med en stor diferens med de andra partier.
    `);


    // === Sammanlagd fördelning som PieChart ===
    const sumVotes = (data, key) => data.reduce((sum, row) => sum + (row[key] || 0), 0);

    const pieDataHög = [['Parti', 'Röster'], ...colorOrder.map(p => [p, sumVotes(högArbetsloshetKommuner, p)])];
    const pieDataLåg = [['Parti', 'Röster'], ...colorOrder.map(p => [p, sumVotes(lågArbetsloshetKommuner, p)])];

    addMdToPage(`## Andel röster i kommuner med hög arbetslöshet (${year})`);
    drawGoogleChart({
        type: 'PieChart',
        data: pieDataHög,
        options: {
            title: `Röstfördelning i högarbetslösa kommuner (${year})`,
            height: 500,
            width: 1200,
            is3D: true,
            colors: partifärger
        }
    });


    addMdToPage(`
        ## Även när vi kollar med % ser att kommuner med hög arbetslöshet har tendens att 
        rösta på 'S' =31.9% 'M'=18.2% 'SD'=21.2% med en stor diferens med de andra partier.
    `);


    addMdToPage(`## Andel röster i kommuner med låg arbetslöshet (${year})`);
    drawGoogleChart({
        type: 'PieChart',
        data: pieDataLåg,
        options: {
            title: `Röstfördelning i lågarbetslösa kommuner (${year})`,
            height: 500,
            width: 1200,
            is3D: true,
            colors: partifärger
        }
    });

    addMdToPage(`
        ## Även när vi kollar med % ser att kommuner med låg arbetslöshet har tendens att 
        rösta på 'S' =27.8% 'M'=22% 'SD'=23.3% med en stor diferens med de andra partier.
    `);


    // === Slutsatser ===
    addMdToPage(`
        ## Slutsatser:
Efter att ha analyserat valresultaten för riksdagspartierna i kommuner med både hög och låg arbetslöshet under valet ${year},
 framträder några tydliga mönster:

Socialdemokraterna (S) har ett jämnt och stabilt väljarstöd över olika kommuntyper, oavsett arbetslöshetsnivå. 
Detta tyder på att partiet har en bred förankring i hela landet, med relativt liten variation mellan olika regioner. 
Deras väljarbas verkar inte vara starkt beroende av lokala socioekonomiska faktorer.

Sverigedemokraterna (SD) uppvisar däremot en mer ojämn fördelning. Deras väljarstöd varierar kraftigt mellan olika kommuner. 
I vissa kommuner med hög arbetslöshet har partiet mycket starkt stöd, medan det i andra är betydligt svagare. 
Detta kan tyda på att SD:s stöd är mer känsligt för lokala förutsättningar, särskilt kopplat till faktorer
 som arbetslöshet och kanske även utbildningsnivå eller befolkningstäthet.

Moderaterna (M) har också ett stabilt stöd men tenderar att få något starkare resultat i kommuner med lägre arbetslöshet.
 Det kan antyda att deras väljare i högre grad återfinns i ekonomiskt starkare kommuner.

 `);
}

// Initial rendering och dropdown-lyssnare
fetchAndVisualizeData(2022);