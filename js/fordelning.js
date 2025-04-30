// === Konfiguration ===
dbQuery.use('riksdagsval-neo4j');

addToPage(`
## Sammanfattning av analys

- Jämför valresultat mellan 2018 och 2022
- Analyserar på kommunnivå
- Identifierar partibyten
- Visualiserar resultat med diagram
- Kopplar resultat till inkomst
- Testar om röstandelar är normalfördelade

`);

// === Hämtar valresultat ===
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');

// === Kommuner och partier att inkludera ===
const selectedCommunes = ['Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
    'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];

const selectedParties = ['Arbetarepartiet-Socialdemokraterna', 'Moderaterna', 'Sverigedemokraterna',];

electionResultsForWork = electionResultsForWork.filter(r =>
    selectedCommunes.includes(r.kommun) && selectedParties.includes(r.parti)
);

// === Grupperar valresultat per kommun ===
let grupperadElectionResultsForWork = {};
for (let item of electionResultsForWork) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperadElectionResultsForWork[kommun]) {
        grupperadElectionResultsForWork[kommun] = [];
    }
    grupperadElectionResultsForWork[kommun].push({ parti, roster2018, roster2022 });
}

// === Sammanställer per kommun ===
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
        byte: byttParti ? "Ja" : "-"
    };
});



// Dropdowns för val av år och parti 
let years = [2018, 2022];
let partier = [...new Set(electionResultsForWork.map(x => x.parti))].sort();
let year = addDropdown('Välj år', years, 2022);
let chosenParti = addDropdown('Välj parti', selectedParties);

// Statistisk sammanställning
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


// Färginställningar 
// Färginställningar 
let partyColorMap = {
    'Arbetarepartiet-Socialdemokraterna': '#ed1b34',
    'Moderaterna': '#52bdec',
    'Sverigedemokraterna': '#ffed00'
};

let chosenColor = partyColorMap[chosenParti] || '#888888'; // fallbackfärg om partiet saknas
let otherColor = '#cccccc'; // färg för "övriga"

//  Diagram: Barchart 
drawGoogleChart({
    type: 'BarChart',
    elementId: 'pieChartContainer',
    data: [
        ['Parti', chosenParti, 'Övriga'],
        ['Röster', partyVotes, totalVotes - partyVotes]
    ],
    options: {
        title: `Andel av röster för ${chosenParti} (${year})`,
        height: 300,
        colors: [chosenColor, otherColor],
        legend: { position: 'top' },
        hAxis: { title: 'Röster' },
        vAxis: { title: 'Parti' },
        isStacked: false
    }
});






// === Generera unika färger ===
function generateColor(index) {
    const hue = (index * 37) % 360;
    return `hsl(${hue}, 65%, 60%)`;
}

// === Bygg Bubble Chart-data med unik färg per kommun ===
let bubbleData = [['Kommun', 'Röstandel (%)', 'Röster', 'Färg']];

let i = 0;
for (let kommun in grupperadElectionResultsForWork) {
    let lista = grupperadElectionResultsForWork[kommun];
    let total = s.sum(lista.map(r => +r[`roster${year}`]));
    let partiRad = lista.find(r => r.parti === chosenParti);
    if (!partiRad || total === 0) continue;

    let partiroster = +partiRad[`roster${year}`];
    let procent = (partiroster / total) * 100;
    let färg = generateColor(i++);

    bubbleData.push([kommun, +procent.toFixed(2), partiroster, färg]);
}

// === Visa titel ===
addMdToPage(`
### Bubble Chart med färg per kommun  ${chosenParti} (${year})
Varje bubbla har en egen färg, storleken baseras på antalet röster.
`);

// === Rita Bubble Chart ===
drawGoogleChart({
    type: 'BubbleChart',
    data: bubbleData,
    options: {
        title: `Stöd för ${chosenParti} per kommun (${year})`,
        height: 600,
        bubble: { textStyle: { fontSize: 11 } },
        hAxis: { title: 'Kommun (etikett)' },
        vAxis: { title: 'Röstandel (%)' },
        chartArea: { left: 100, width: '80%' },
        legend: 'none'
    }
});




// === Skapa procentData om det inte redan finns ===
let procentData = [];

for (let kommun in grupperadElectionResultsForWork) {
    let lista = grupperadElectionResultsForWork[kommun];
    let total = s.sum(lista.map(r => +r[`roster${year}`]));
    let partiRad = lista.find(r => r.parti === chosenParti);
    if (!partiRad) continue;

    let partiroster = +partiRad[`roster${year}`];
    let procent = (partiroster / total) * 100;
    procentData.push({ kommun, procent: +procent.toFixed(2) });
}

// === Statistik + enkel normalitetsbedömning ===
let values = procentData.map(x => x.procent);

let min = Math.min(...values);
let max = Math.max(...values);
let sum = values.reduce((a, b) => a + b, 0);
let mean = sum / values.length;
let sorted = [...values].sort((a, b) => a - b);
let median = sorted[Math.floor(values.length / 2)];

// Enkel normalitetsbedömning: jämför medel och median
let normalbedömning = Math.abs(mean - median) < 2
    ? "Data ser ut att vara ungefär normalfördelad (medel ≈ median)."
    : "Data verkar inte vara normalfördelad (medel och median skiljer sig mycket).";

addMdToPage(`
### Statistik för ${chosenParti} (${year})
- Medelvärde: **${mean.toFixed(1)}%**
- Median: **${median.toFixed(1)}%**
- Lägsta andel: **${min.toFixed(1)}%**
- Högsta andel: **${max.toFixed(1)}%**

**Normalitetsbedömning:** ${normalbedömning}
`);







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
