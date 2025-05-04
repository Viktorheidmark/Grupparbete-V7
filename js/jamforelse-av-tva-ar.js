// === Konfiguration ===
dbQuery.use('riksdagsval-neo4j');


addMdToPage(`
## Hypotes:
Jag misstänker att det finns ett samband mellan arbetslöshet och partisympatier i olika kommuner.
 Specifikt tror jag att partier som Sverigedemokraterna (SD) och Moderaterna (M) kommer att ha högre 
 stödnivåer i kommuner med hög arbetslöshet, medan Socialdemokraterna (S) och Vänsterpartiet (V) kan ha
  högre stöd i kommuner med lägre arbetslöshet. Detta skulle kunna indikera att socioekonomiska faktorer,
   som arbetslöshet, påverkar valresultaten på kommunnivå.
`);

addMdToPage(`
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

// === Kommuner att inkludera ===
const högarbetslöshetCommunes = ['Flen', 'Perstorp', 'Malmö', 'Eskilstuna', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'];
const lågarbetslöshetCommunes = ['Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];

let filteredHog = electionResultsForWork.filter(({ kommun }) => högarbetslöshetCommunes.includes(kommun));
let filteredLag = electionResultsForWork.filter(({ kommun }) => lågarbetslöshetCommunes.includes(kommun));

function skapaSammanstallning(filteredData) {
  let grupperad = {};
  for (let item of filteredData) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperad[kommun]) grupperad[kommun] = [];
    grupperad[kommun].push({ parti, roster2018, roster2022 });
  }
  return Object.entries(grupperad).map(([kommun, list]) => {
    let total2018 = s.sum(list.map(r => +r.roster2018));
    let total2022 = s.sum(list.map(r => +r.roster2022));
    let vinnare2018 = list.reduce((max, curr) => curr.roster2018 > max.roster2018 ? curr : max);
    let vinnare2022 = list.reduce((max, curr) => curr.roster2022 > max.roster2022 ? curr : max);
    const byttParti = vinnare2018.parti !== vinnare2022.parti;
    let procent2018 = (vinnare2018.roster2018 / total2018) * 100;
    let procent2022 = (vinnare2022.roster2022 / total2022) * 100;
    return {
      kommun,
      vinnare2018: vinnare2018.parti,
      roster2018: vinnare2018.roster2018,
      procent2018: procent2018.toFixed(1),
      vinnare2022: vinnare2022.parti,
      roster2022: vinnare2022.roster2022,
      procent2022: procent2022.toFixed(1),
      byte: byttParti ? "Ja" : "-",
      differens: (vinnare2022.roster2022 || 0) - (vinnare2018.roster2018 || 0)
    };
  });
}

let sammanstallningHog = skapaSammanstallning(filteredHog);
let sammanstallningLag = skapaSammanstallning(filteredLag);

addMdToPage("### Kommuner med hög arbetslöshet för att ta reda på hur mycket diferens det finns i valet av 2022 jämfört med 2018.");
sammanstallningHog = [...sammanstallningHog].sort((a, b) => a.byte === "Ja" ? -1 : 1);
tableFromData({
  data: sammanstallningHog.map(row => ({
    kommun: row.kommun,
    vinnare2018: row.vinnare2018,
    roster2018: row.roster2018,
    procent2018: `${row.procent2018}%`,
    vinnare2022: row.vinnare2022,
    roster2022: row.roster2022,
    procent2022: `${row.procent2022}%`,
    byte: row.byte,
    differens: row.differens
  }))
});

addMdToPage("### Kommuner med låg arbetslöshet för att ta reda på hur mycket diferens det finns i valet av 2022 jämfört med 2018.");
sammanstallningLag = [...sammanstallningLag].sort((a, b) => a.byte === "Ja" ? -1 : 1);
tableFromData({
  data: sammanstallningLag.map(row => ({
    kommun: row.kommun,
    vinnare2018: row.vinnare2018,
    roster2018: row.roster2018,
    procent2018: `${row.procent2018}%`,
    vinnare2022: row.vinnare2022,
    roster2022: row.roster2022,
    procent2022: `${row.procent2022}%`,
    byte: row.byte,
    differens: row.differens
  }))
});


// Tabell för Sverigedemokraternas röster i de valda kommunerna
addMdToPage("### Sverigedemokraternas röster i valda kommuner för att ta reda på hur mycket diferens det finns i valet av 2022 jamfört med 2018.");

let combinedFiltered = [...filteredHog, ...filteredLag];
let sdData = combinedFiltered.filter(({ parti }) => parti === 'Sverigedemokraterna');

let sdSammanstallning = {};
for (let item of sdData) {
  const { kommun, roster2018, roster2022 } = item;
  sdSammanstallning[kommun] = {
    kommun,
    roster2018,
    roster2022,
    differens: (roster2022 || 0) - (roster2018 || 0)
  };
}
tableFromData({
  data: Object.values(sdSammanstallning)
});

// === Procenttabell: Alla kommuner i Sverige ===
function skapaFullSammanstallning(data) {
  let grupperad = {};
  for (let item of data) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperad[kommun]) grupperad[kommun] = [];
    grupperad[kommun].push({ parti, roster2018, roster2022 });
  }
  return Object.entries(grupperad).map(([kommun, list]) => {
    let total2018 = list.reduce((sum, r) => sum + (+r.roster2018), 0);
    let total2022 = list.reduce((sum, r) => sum + (+r.roster2022), 0);

    let vinnare2018 = list.reduce((max, curr) => curr.roster2018 > max.roster2018 ? curr : max);
    let vinnare2022 = list.reduce((max, curr) => curr.roster2022 > max.roster2022 ? curr : max);

    const byttParti = vinnare2018.parti !== vinnare2022.parti;
    return {
      kommun,
      vinnare2018: vinnare2018.parti,
      roster2018: vinnare2018.roster2018,
      andel2018: total2018 ? ((vinnare2018.roster2018 / total2018) * 100).toFixed(1) + '%' : '-',
      vinnare2022: vinnare2022.parti,
      roster2022: vinnare2022.roster2022,
      andel2022: total2022 ? ((vinnare2022.roster2022 / total2022) * 100).toFixed(1) + '%' : '-',
      byte: byttParti ? "Ja" : "-",
      differens: (vinnare2022.roster2022 || 0) - (vinnare2018.roster2018 || 0)
    };
  });
}

let sammanstallningAllaKommuner = skapaFullSammanstallning(electionResultsForWork).sort((a, b) => {
  if (a.byte === "Ja" && b.byte !== "Ja") return -1;
  if (a.byte !== "Ja" && b.byte === "Ja") return 1;
  return 0;
});

addMdToPage("### Alla kommuner i Sverige sorterade efter partibyte i valet 2022, med andel röster (%). S och SD är de två partier som har vunnit 2022 over de andra partier."
);

tableFromData({
  data: sammanstallningAllaKommuner.map(row => ({
    kommun: row.kommun,
    vinnare2018: row.vinnare2018,
    roster2018: row.roster2018,
    andel2018: row.andel2018,
    vinnare2022: row.vinnare2022,
    roster2022: row.roster2022,
    andel2022: row.andel2022,
    byte: row.byte,
    differens: row.differens
  }))
});

addMdToPage(`## Slutsatser:

## Efter hela min undersökning så märkte jag att:
* Socialdemokraternas röstandel är jämnt fördelad över kommunerna. Det innebär att deras röster är normalfördelat,
 utan extremt höga eller låga resultat i någon särskild grupp. Partiet har en bred och jämn väljare över landet.
* Sverigedemokraterna röstandel är ojämnt fördelad. Stödet varierar mycket mellan kommunerna, och vissa kommuner 
har väldigt höga siffror medan andra har lågt stöd. Sverigedemokraternas stöd verkar vara starkt knutet till lokala 
förutsättningar än geografiskt som arbetslöshet.
 Stödet varierar kraftigt beroende på kommuntyp - partiet är starkt i vissa mindre kommuner men har svagare stöd i storstäder.

`);

