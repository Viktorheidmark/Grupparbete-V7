<<<<<<< HEAD

// Vi jämför valresultat mellan 2018 och 2022 för att se om det har skett några förändringar i kommunerna.
dbQuery.use('riksdagsval-neo4j');

// Detta är en del av koden som används för att hämta och visualisera valresultat från riksdagsvalen 2018 och 2022.
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');
console.log('electionResultsForWork', electionResultsForWork);


// Kommunlista att inkludera
const selectedCommunes = ['Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
    'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga']

const selectedParties = ['Sverigedemokraterna', 'Arbetarepartiet-Socialdemokraterna', 'Liberalerna ', 'Moderaterna', 'Miljöpartiet de gröna',
];

=======
// Vi jämför valresultat mellan 2018 och 2022 för att se om det har skett några förändringar i kommunerna.
dbQuery.use('riksdagsval-neo4j');
 
// Detta är en del av koden som används för att hämta och visualisera valresultat från riksdagsvalen 2018 och 2022.
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');
console.log('electionResultsForWork', electionResultsForWork);
 
 
// Kommunlista att inkludera
const selectedCommunes = ['Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
    'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga']
 
const selectedParties = ['Sverigedemokraterna', 'Arbetarepartiet-Socialdemokraterna', 'Liberalerna ', 'Moderaterna', 'Miljöpartiet de gröna',
];
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
electionResultsForWork = electionResultsForWork.filter(r =>
    selectedCommunes.includes(r.kommun) && selectedParties.includes(r.parti)
);
console.log('electionResultsForWork', electionResultsForWork);
<<<<<<< HEAD

// Detta gruppar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
let grupperadElectionResultsForWork = {};

=======
 
// Detta gruppar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
let grupperadElectionResultsForWork = {};
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Vi grupperar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
for (let item of electionResultsForWork) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperadElectionResultsForWork[kommun]) {
        grupperadElectionResultsForWork[kommun] = [];
    }
    grupperadElectionResultsForWork[kommun].push({ parti, roster2018, roster2022 });
}
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Nu skapar vi en sammanställning av valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018
let sammanstallning = Object.entries(grupperadElectionResultsForWork).map(([kommun, list]) => {
    let vinnare2018 = list.reduce((max, curr) => curr.roster2018 > max.roster2018 ? curr : max);
    let vinnare2022 = list.reduce((max, curr) => curr.roster2022 > max.roster2022 ? curr : max);
<<<<<<< HEAD

    // Vi kontrollerar om vinnande parti har ändrats mellan 2018 och 2022
    const byttParti = vinnare2018.parti !== vinnare2022.parti;

=======
 
    // Vi kontrollerar om vinnande parti har ändrats mellan 2018 och 2022
    const byttParti = vinnare2018.parti !== vinnare2022.parti;
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
    return {
        kommun,
        vinnare2018: vinnare2018.parti,
        roster2018: vinnare2018.roster2018,
        vinnare2022: vinnare2022.parti,
        roster2022: vinnare2022.roster2022,
        byte: byttParti ? "!!! Ja!!!" : "-"
    };
});
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Kommuner där vinnande parti har ändrats (2018 → 2022)
let kommunerMedByte = sammanstallning
    .filter(r => r.byte === "!!! Ja!!!")
    .map(r => r.kommun);
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Kommuner där samma parti vann både 2018 och 2022
let stabilaKommuner = sammanstallning
    .filter(r => r.byte === "-")
    .map(r => r.kommun);
<<<<<<< HEAD


// Här skapar vi en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let years = [2018, 2022];
let partier = [...new Set(electionResultsForWork.map(x => x.parti))].sort();

// Och nu skapar vi en dropdown för att välja år och parti
let year = addDropdown('Välj år', years, 2022);
let chosenParti = addDropdown('Välj parti', selectedParties);

=======
 
 
// Här skapar vi en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let years = [2018, 2022];
let partier = [...new Set(electionResultsForWork.map(x => x.parti))].sort();
 
// Och nu skapar vi en dropdown för att välja år och parti
let year = addDropdown('Välj år', years, 2022);
let chosenParti = addDropdown('Välj parti', selectedParties);
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Nu skapar vi en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let antalKommunerMedVinst = sammanstallning.filter(row =>
    (year == 2018 && row.vinnare2018 === chosenParti) ||
    (year == 2022 && row.vinnare2022 === chosenParti)
).length;
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Vi låter användaren välja ett parti och år för att se hur många kommuner som har vunnit med det partiet
let totalVotes = s.sum(
    electionResultsForWork.map(x => year === 2018 ? +x.roster2018 : +x.roster2022)
);
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
//  Vi beräknar rösterna för det valda partiet och året
let partyVotes = s.sum(
    electionResultsForWork
        .filter(x => x.parti === chosenParti)
        .map(x => year === 2018 ? +x.roster2018 : +x.roster2022)
);
<<<<<<< HEAD

// Vi beräknar andelen röster för det valda partiet och året
let percent = ((partyVotes / totalVotes) * 100).toFixed(1);

// Vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
/*
addMdToPage(`### Partiet *${chosenParti}* år ${year} von i ${antalKommunerMedVinst} kommun`);
addMdToPage(`Totalt antal röster: **${partyVotes.toLocaleString('sv-SE')}** i landet för valt år. 
=======
 
// Vi beräknar andelen röster för det valda partiet och året
let percent = ((partyVotes / totalVotes) * 100).toFixed(1);
 
// Vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
/*
addMdToPage(`### Partiet *${chosenParti}* år ${year} von i ${antalKommunerMedVinst} kommun`);
addMdToPage(`Totalt antal röster: **${partyVotes.toLocaleString('sv-SE')}** i landet för valt år.
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
Andel av alla röster: **${percent}%**`);
*/
addToPage(`
  <div style="display: flex; justify-content: space-between; gap: 30px; align-items: flex-start;">
<<<<<<< HEAD
    
=======
   
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
    <div style="flex: 1;">
      <h3>${chosenParti}, år ${year}</h3>
      <p>Partiet <strong>${chosenParti}</strong> vann i <strong>${antalKommunerMedVinst}</strong> kommuner.</p>
      <p>Totalt antal röster: <strong>${partyVotes.toLocaleString('sv-SE')}</strong> i landet för valt år.</p>
      <p>Andel av alla röster: <strong>${percent}%</strong></p>
    </div>
<<<<<<< HEAD

    <div id="pieChartContainer" style="flex: 1;"></div>

  </div>
`);

=======
 
    <div id="pieChartContainer" style="flex: 1;"></div>
 
  </div>
`);
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Vi skapar en cirkeldiagram för att visa andelen röster för det valda partiet och året
drawGoogleChart({
    type: 'PieChart',
    elementId: 'pieChartContainer',
    data: [
        ['Parti', 'Röster'],
        [chosenParti, partyVotes],
        ['Övriga', totalVotes - partyVotes]
    ],
    options: {
        title: `Andel av röster, år ${year}`,
        height: 300,
        pieHole: 0.4,
        colors: ['#42f5e0', '#f59942']
    }
});
<<<<<<< HEAD





// Vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let procentData = [];

for (let kommun in grupperadElectionResultsForWork) {
    let lista = grupperadElectionResultsForWork[kommun];

    let total = s.sum(lista.map(r => +r[`roster${year}`]));
    let partiRad = lista.find(r => r.parti === chosenParti);
    if (!partiRad) continue;

    let partiroster = +partiRad[`roster${year}`];
    let procent = (partiroster / total) * 100;

=======
 
 
 
 
 
// Vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let procentData = [];
 
for (let kommun in grupperadElectionResultsForWork) {
    let lista = grupperadElectionResultsForWork[kommun];
 
    let total = s.sum(lista.map(r => +r[`roster${year}`]));
    let partiRad = lista.find(r => r.parti === chosenParti);
    if (!partiRad) continue;
 
    let partiroster = +partiRad[`roster${year}`];
    let procent = (partiroster / total) * 100;
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
    procentData.push({
        kommun,
        procent: +procent.toFixed(2)
    });
}
addMdToPage(`Totalt antal kommuner i analysen: **${procentData.length}**`);
<<<<<<< HEAD



=======
 
 
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
drawGoogleChart({
    type: 'Histogram',
    data: [
        ['Procent röster'],
        ...procentData.map(x => [x.procent])
    ],
    options: {
        title: `Andel röster för ${chosenParti} i varje kommun (${year})`,
        height: 400,
        colors: ['#42f5e0', '#f59942'],
        histogram: { bucketSize: 2 },
        hAxis: { title: 'Procent röster' },
        vAxis: { title: 'Antal kommuner' }
    }
});
<<<<<<< HEAD

let median = s.median(procentData.map(x => x.procent));
let max = s.max(procentData.map(x => x.procent));
let min = s.min(procentData.map(x => x.procent));

=======
 
let median = s.median(procentData.map(x => x.procent));
let max = s.max(procentData.map(x => x.procent));
let min = s.min(procentData.map(x => x.procent));
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
addMdToPage(`
### Statistik: ${chosenParti} (${year})
- Medianandel per kommun: **${median.toFixed(1)}%**
- Högsta andel: **${max.toFixed(1)}%**
- Lägsta andel: **${min.toFixed(1)}%**
`);
<<<<<<< HEAD


let values = procentData.map(x => x.procent);
let result = stdLib.stats.shapiroWilkTest(values);

=======
 
 
let values = procentData.map(x => x.procent);
let result = stdLib.stats.shapiroWilkTest(values);
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
addMdToPage(`
###Shapiro-Wilk normalitetstest
- p-värde: **${result.p.toFixed(4)}**
- ${result.p < 0.05
        ? "Fördelningen verkar inte vara normalfördelad"
        : "Fördelningen verkar vara normalfördelad"}
`);
<<<<<<< HEAD



=======
 
 
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
//
dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({});
console.log('income from mongodb', income);
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
let incomeDataForTable = income.map(x => ({
    kommun: x.kommun,
    kön: x.kon,
    medelInkomst2018: x.medelInkomst2018,
    medianInkomst2022: x.medianInkomst2022
}));
<<<<<<< HEAD


=======
 
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
let korrelationData = procentData.map(p => {
    let row = incomeDataForTable.find(i => i.kommun === p.kommun && i.kön === 'totalt');
    return row ? { kommun: p.kommun, procent: p.procent, inkomst: row.medelInkomst2022 } : null;
}).filter(x => x);
<<<<<<< HEAD


=======
 
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
let r = s.sampleCorrelation(
    korrelationData.map(x => x.inkomst),
    korrelationData.map(x => x.procent)
);
<<<<<<< HEAD

=======
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
addMdToPage(`
### Enkel korrelation mellan inkomst och röstandel för ${chosenParti}
- Pearson r: **${r.toFixed(3)}**
- ${Math.abs(r) > 0.4
        ? "Det verkar finnas ett samband"
        : "Svagt eller inget tydligt samband"}
`);
<<<<<<< HEAD







let vansterPartier = ['Socialdemokraterna', 'Vänsterpartiet', 'Miljöpartiet', 'Centerpartiet'];
let hogerPartier = ['Moderaterna', 'Kristdemokraterna', 'Liberalerna', 'Sverigedemokraterna'];

// 
let totalVanster2018 = electionResultsForWork
    .filter(x => vansterPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2018), 0);

let totalVanster2022 = electionResultsForWork
    .filter(x => vansterPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2022), 0);

let totalHoger2018 = electionResultsForWork
    .filter(x => hogerPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2018), 0);

let totalHoger2022 = electionResultsForWork
    .filter(x => hogerPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2022), 0);

// 
let total2018 = totalVanster2018 + totalHoger2018;
let total2022 = totalVanster2022 + totalHoger2022;

=======
 
 
 
 
 
 
 
let vansterPartier = ['Socialdemokraterna', 'Vänsterpartiet', 'Miljöpartiet', 'Centerpartiet'];
let hogerPartier = ['Moderaterna', 'Kristdemokraterna', 'Liberalerna', 'Sverigedemokraterna'];
 
//
let totalVanster2018 = electionResultsForWork
    .filter(x => vansterPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2018), 0);
 
let totalVanster2022 = electionResultsForWork
    .filter(x => vansterPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2022), 0);
 
let totalHoger2018 = electionResultsForWork
    .filter(x => hogerPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2018), 0);
 
let totalHoger2022 = electionResultsForWork
    .filter(x => hogerPartier.includes(x.parti))
    .reduce((sum, x) => sum + (+x.roster2022), 0);
 
//
let total2018 = totalVanster2018 + totalHoger2018;
let total2022 = totalVanster2022 + totalHoger2022;
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
//
let percentVanster2018 = (totalVanster2018 / total2018 * 100).toFixed(1);
let percentVanster2022 = (totalVanster2022 / total2022 * 100).toFixed(1);
let percentHoger2018 = (totalHoger2018 / total2018 * 100).toFixed(1);
let percentHoger2022 = (totalHoger2022 / total2022 * 100).toFixed(1);
<<<<<<< HEAD

addMdToPage(`
### Röster per block – hela landet

#### År 2018
- Vänsterblocket: ${totalVanster2018.toLocaleString('sv-SE')} röster (${percentVanster2018}%)
- Högerblocket: ${totalHoger2018.toLocaleString('sv-SE')} röster (${percentHoger2018}%)

=======
 
addMdToPage(`
### Röster per block – hela landet
 
#### År 2018
- Vänsterblocket: ${totalVanster2018.toLocaleString('sv-SE')} röster (${percentVanster2018}%)
- Högerblocket: ${totalHoger2018.toLocaleString('sv-SE')} röster (${percentHoger2018}%)
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
#### År 2022
- Vänsterblocket: ${totalVanster2022.toLocaleString('sv-SE')} röster (${percentVanster2022}%)
- Högerblocket: ${totalHoger2022.toLocaleString('sv-SE')} röster (${percentHoger2022}%)
`);
<<<<<<< HEAD

// 
=======
 
//
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
let blockData = [
    { år: '2018', Vänster: totalVanster2018, Höger: totalHoger2018 },
    { år: '2022', Vänster: totalVanster2022, Höger: totalHoger2022 }
];
<<<<<<< HEAD

//
addMdToPage(`### Röstfördelning per block (hela landet)`);

// 
=======
 
//
addMdToPage(`### Röstfördelning per block (hela landet)`);
 
//
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(blockData, 'år', 'Vänster', 'Höger'),
    options: {
        title: 'Vänster- och högerblockets röster i hela landet (2018 vs 2022)',
        height: 500,
        colors: ['#42f5e0', '#f59942'],
        legend: { position: 'top' },
        hAxis: {
            title: 'År',
            slantedText: true
        },
        vAxis: {
            title: 'Antal röster',
            format: '#'
        },
        chartArea: { left: 80, width: '80%' }
    }
});
<<<<<<< HEAD



//

dbQuery.use('geo-mysql');
let geoData = await dbQuery('SELECT * FROM geoData');

// 
=======
 
 
 
//
 
dbQuery.use('geo-mysql');
let geoData = await dbQuery('SELECT * FROM geoData');
 
//
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
let kommunTillLan = {};
for (let row of geoData) {
    kommunTillLan[row.municipality] = row.county;
}
<<<<<<< HEAD

// kommuner med län från geoData
let lanByteRaknare = {};

for (let kommun of kommunerMedByte) {
    let geoRad = geoData.find(x => x.municipality === kommun);
    if (!geoRad) continue;

=======
 
// kommuner med län från geoData
let lanByteRaknare = {};
 
for (let kommun of kommunerMedByte) {
    let geoRad = geoData.find(x => x.municipality === kommun);
    if (!geoRad) continue;
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
    let lan = geoRad.county;
    if (!lanByteRaknare[lan]) {
        lanByteRaknare[lan] = 0;
    }
    lanByteRaknare[lan]++;
}
<<<<<<< HEAD

// 
let lanByteLista = Object.entries(lanByteRaknare)
    .map(([lan, antal]) => ({ Län: lan, 'Antal byten': antal }))
    .sort((a, b) => b['Antal byten'] - a['Antal byten']);


addMdToPage(`### Län där vinnande parti byttes i kommuner (2018–2022)`);

tableFromData({
    data: lanByteLista
});


=======
 
//
let lanByteLista = Object.entries(lanByteRaknare)
    .map(([lan, antal]) => ({ Län: lan, 'Antal byten': antal }))
    .sort((a, b) => b['Antal byten'] - a['Antal byten']);
 
 
addMdToPage(`### Län där vinnande parti byttes i kommuner (2018–2022)`);
 
tableFromData({
    data: lanByteLista
});
 
 
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
drawGoogleChart({
    type: 'ColumnChart',
    data: [['Län', 'Antal byten'], ...lanByteLista.map(x => [x.Län, x['Antal byten']])],
    options: {
        title: 'Kommuner med partibyte per län (2018–2022)',
        height: 600,
        colors: ['#42f5e0', '#f59942'],
        chartArea: { left: 100 },
        legend: { position: 'none' },
        hAxis: { slantedText: true, slantedTextAngle: 45 }
    }
<<<<<<< HEAD
});
=======
});
>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
