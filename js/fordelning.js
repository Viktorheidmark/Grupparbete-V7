// 🧾 Sammanfattning


// Hämtar data
// Filtrerar och organiserar per kommun
// Identifierar vinnare och partibyten
// Visualiserar data i diagram(cirkeldiagram, histogram, stapeldiagram)
// Analyserar koppling mellan valresultat och inkomst
// Undersöker om resultaten är normalfördelade
// Redovisar blockfördelning och geografiska trender

// Vi jämför valresultat mellan 2018 och 2022 för att se om det har skett några förändringar i kommunerna.
dbQuery.use('riksdagsval-neo4j');

addToPage(`// 🧾 Sammanfattning


###  ✅ Hämtar data
###  ✅ Filtrerar och organiserar per kommun
###  ✅ Identifierar vinnare och partibyten
###  ✅ Visualiserar data i diagram(cirkeldiagram, histogram, stapeldiagram)
###  ✅ Analyserar koppling mellan valresultat och inkomst
###  ✅ Undersöker om resultaten är normalfördelade
###  ✅ Redovisar blockfördelning och geografiska trender

### Vi jämför valresultat mellan 2018 och 2022 för att se om det har skett några förändringar i kommunerna.`);

// Detta är en del av koden som används för att hämta och visualisera valresultat från riksdagsvalen 2018 och 2022.
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');


// Kommunlista att inkludera
const selectedCommunes = ['Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
    'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga']

const selectedParties = ['Sverigedemokraterna', 'Arbetarepartiet-Socialdemokraterna', 'Liberalerna ', 'Moderaterna', 'Miljöpartiet de gröna',
];

electionResultsForWork = electionResultsForWork.filter(r =>
    selectedCommunes.includes(r.kommun) && selectedParties.includes(r.parti)
);

// Detta gruppar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
let grupperadElectionResultsForWork = {};
for (let item of electionResultsForWork) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperadElectionResultsForWork[kommun]) {
        grupperadElectionResultsForWork[kommun] = [];
    }
    grupperadElectionResultsForWork[kommun].push({ parti, roster2018, roster2022 });
}

// Nu skapar vi en sammanställning av valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018
let sammanstallning = Object.entries(grupperadElectionResultsForWork).map(([kommun, list]) => {
    let vinnare2018 = list.reduce((max, curr) => curr.roster2018 > max.roster2018 ? curr : max);
    let vinnare2022 = list.reduce((max, curr) => curr.roster2022 > max.roster2022 ? curr : max);
    const byttParti = vinnare2018.parti !== vinnare2022.parti;

    return {
        kommun,
        vinnare2018: vinnare2018.parti,
        roster2018: vinnare2018.roster2018,
        vinnare2022: vinnare2022.parti,
        roster2022: vinnare2022.roster2022,
        byte: byttParti ? "!!! Ja!!!" : "-"
    };
});

// Kommuner där vinnande parti har ändrats (2018 → 2022)
let kommunerMedByte = sammanstallning
    .filter(r => r.byte === "!!! Ja!!!")
    .map(r => r.kommun);

// Kommuner där samma parti vann både 2018 och 2022
let stabilaKommuner = sammanstallning
    .filter(r => r.byte === "-")
    .map(r => r.kommun);


// Här skapar vi en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let years = [2018, 2022];
let partier = [...new Set(electionResultsForWork.map(x => x.parti))].sort();
let year = addDropdown('Välj år', years, 2022);
let chosenParti = addDropdown('Välj parti', selectedParties);

// Nu skapar vi en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let antalKommunerMedVinst = sammanstallning.filter(row =>
    (year == 2018 && row.vinnare2018 === chosenParti) ||
    (year == 2022 && row.vinnare2022 === chosenParti)
).length;

let totalVotes = s.sum(
    electionResultsForWork.map(x => year === 2018 ? +x.roster2018 : +x.roster2022)
);

let partyVotes = s.sum(
    electionResultsForWork
        .filter(x => x.parti === chosenParti)
        .map(x => year === 2018 ? +x.roster2018 : +x.roster2022)
);

let percent = ((partyVotes / totalVotes) * 100).toFixed(1);

// Vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
/*
addMdToPage(`### Partiet *${chosenParti}* år ${year} von i ${antalKommunerMedVinst} kommun`);
addMdToPage(`Totalt antal röster: **${partyVotes.toLocaleString('sv-SE')}** i landet för valt år. 
Andel av alla röster: **${percent}%**`);
*/
addToPage(`
  <div style="display: flex; justify-content: space-between; gap: 30px; align-items: flex-start;">
    
    <div style="flex: 1;">
      <h3>${chosenParti}, år ${year}</h3>
      <p>Partiet <strong>${chosenParti}</strong> vann i <strong>${antalKommunerMedVinst}</strong> kommuner.</p>
      <p>Totalt antal röster: <strong>${partyVotes.toLocaleString('sv-SE')}</strong> i landet för valt år.</p>
      <p>Andel av alla röster: <strong>${percent}%</strong></p>
    </div>

    <div id="pieChartContainer" style="flex: 1;"></div>

  </div>
`);

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





// Vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let procentData = [];

for (let kommun in grupperadElectionResultsForWork) {
    let lista = grupperadElectionResultsForWork[kommun];
    let total = s.sum(lista.map(r => +r[`roster${year}`]));
    let partiRad = lista.find(r => r.parti === chosenParti);
    if (!partiRad) continue;

    let partiroster = +partiRad[`roster${year}`];
    let procent = (partiroster / total) * 100;

    procentData.push({
        kommun,
        procent: +procent.toFixed(2)
    });
}


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

let median = s.median(procentData.map(x => x.procent));
let max = s.max(procentData.map(x => x.procent));
let min = s.min(procentData.map(x => x.procent));

addMdToPage(`
### Statistik: ${chosenParti} (${year})
- Medianandel per kommun: **${median.toFixed(1)}%**
- Högsta andel: **${max.toFixed(1)}%**
- Lägsta andel: **${min.toFixed(1)}%**
`);


let values = procentData.map(x => x.procent);
let result = stdLib.stats.shapiroWilkTest(values);




//
dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({});
console.log('income from mongodb', income);
let incomeDataForTable = income.map(x => ({
    kommun: x.kommun,
    kön: x.kon,
    medelInkomst2018: x.medelInkomst2018,
    medianInkomst2022: x.medianInkomst2022
}));


let korrelationData = procentData.map(p => {
    let row = incomeDataForTable.find(i => i.kommun === p.kommun && i.kön === 'totalt');
    return row ? { kommun: p.kommun, procent: p.procent, inkomst: row.medelInkomst2022 } : null;
}).filter(x => x);


let r = s.sampleCorrelation(
    korrelationData.map(x => x.inkomst),
    korrelationData.map(x => x.procent)
);
addMdToPage(`
### Enkel korrelation mellan inkomst och röstandel för ${chosenParti}
- Pearson r: **${r.toFixed(3)}**
- ${Math.abs(r) > 0.4
        ? "Det verkar finnas ett samband"
        : "Svagt eller inget tydligt samband"}
`);







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

//
let percentVanster2018 = (totalVanster2018 / total2018 * 100).toFixed(1);
let percentVanster2022 = (totalVanster2022 / total2022 * 100).toFixed(1);
let percentHoger2018 = (totalHoger2018 / total2018 * 100).toFixed(1);
let percentHoger2022 = (totalHoger2022 / total2022 * 100).toFixed(1);
