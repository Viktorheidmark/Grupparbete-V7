// Välj databas
dbQuery.use('riksdagsval-neo4j');
<<<<<<< HEAD

// Hämta valresultat
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');

// Lista med kommuner baserat på arbetslöshetsnivå
const högarbetslöshetCommunes = ['Flen', 'Perstorp', 'Malmö', 'Eskilstuna', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'];
const lågarbetslöshetCommunes = ['Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];

=======

// Hämta valresultat
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');

// Lista med kommuner baserat på arbetslöshetsnivå
const högarbetslöshetCommunes = ['Flen', 'Perstorp', 'Malmö', 'Eskilstuna', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'];
const lågarbetslöshetCommunes = ['Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Filtrera valresultat för hög och låg arbetslöshet separat
let filteredHog = electionResultsForWork.filter(({ kommun }) =>
  högarbetslöshetCommunes.includes(kommun)
);
let filteredLag = electionResultsForWork.filter(({ kommun }) =>
  lågarbetslöshetCommunes.includes(kommun)
);
<<<<<<< HEAD

=======

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Funktion för att skapa sammanställning
function skapaSammanstallning(filteredData) {
  let grupperad = {};
  for (let item of filteredData) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperad[kommun]) grupperad[kommun] = [];
    grupperad[kommun].push({ parti, roster2018, roster2022 });
  }
<<<<<<< HEAD

=======

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
  return Object.entries(grupperad).map(([kommun, list]) => {
    let vinnare2018 = list.reduce((max, curr) => curr.roster2018 > max.roster2018 ? curr : max);
    let vinnare2022 = list.reduce((max, curr) => curr.roster2022 > max.roster2022 ? curr : max);
    const byttParti = vinnare2018.parti !== vinnare2022.parti;
<<<<<<< HEAD

=======

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
    return {
      kommun,
      vinnare2018: vinnare2018.parti,
      roster2018: vinnare2018.roster2018,
      vinnare2022: vinnare2022.parti,
      roster2022: vinnare2022.roster2022,
      byte: byttParti ? "Ja" : "-",
      differens: (vinnare2022.roster2022 || 0) - (vinnare2018.roster2018 || 0)
    };
  });
}
<<<<<<< HEAD

// Skapa sammanställningar
let sammanstallningHog = skapaSammanstallning(filteredHog);
let sammanstallningLag = skapaSammanstallning(filteredLag);

// Tabell för kommuner med hög arbetslöshet
addMdToPage("### Kommuner med hög arbetslöshet");

=======

// Skapa sammanställningar
let sammanstallningHog = skapaSammanstallning(filteredHog);
let sammanstallningLag = skapaSammanstallning(filteredLag);

// Tabell för kommuner med hög arbetslöshet
addMdToPage("### Kommuner med hög arbetslöshet");

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
sammanstallningHog = [...sammanstallningHog].sort((a, b) => {
  if (a.byte === "Ja" && b.byte !== "Ja") return -1;
  if (a.byte !== "Ja" && b.byte === "Ja") return 1;
  return 0;
});
<<<<<<< HEAD

=======

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
tableFromData({
  data: sammanstallningHog.map(row => ({
    kommun: row.kommun,
    vinnare2018: row.vinnare2018,
    roster2018: row.roster2018,
    vinnare2022: row.vinnare2022,
    roster2022: row.roster2022,
    byte: row.byte,
    differens: row.differens
  }))
});
<<<<<<< HEAD

// Tabell för kommuner med låg arbetslöshet
addMdToPage("### Kommuner med låg arbetslöshet");

=======

// Tabell för kommuner med låg arbetslöshet
addMdToPage("### Kommuner med låg arbetslöshet");

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
sammanstallningLag = [...sammanstallningLag].sort((a, b) => {
  if (a.byte === "Ja" && b.byte !== "Ja") return -1;
  if (a.byte !== "Ja" && b.byte === "Ja") return 1;
  return 0;
});
<<<<<<< HEAD

=======

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
tableFromData({
  data: sammanstallningLag.map(row => ({
    kommun: row.kommun,
    vinnare2018: row.vinnare2018,
    roster2018: row.roster2018,
    vinnare2022: row.vinnare2022,
    roster2022: row.roster2022,
    byte: row.byte,
    differens: row.differens
  }))
});
<<<<<<< HEAD


// Tabell för Sverigedemokraternas röster i de valda kommunerna
addMdToPage("### Sverigedemokraternas röster i valda kommuner");

// Kombinera filtrerade data (hög + låg arbetslöshet)
let combinedFiltered = [...filteredHog, ...filteredLag];

// Filtrera ut endast Sverigedemokraterna
let sdData = combinedFiltered.filter(({ parti }) => parti === 'Sverigedemokraterna');

=======


// Tabell för Sverigedemokraternas röster i de valda kommunerna
addMdToPage("### Sverigedemokraternas röster i valda kommuner");

// Kombinera filtrerade data (hög + låg arbetslöshet)
let combinedFiltered = [...filteredHog, ...filteredLag];

// Filtrera ut endast Sverigedemokraterna
let sdData = combinedFiltered.filter(({ parti }) => parti === 'Sverigedemokraterna');

>>>>>>> 9bbfc454238669ac6f6cd28ed0afd457eb8a1737
// Grupp per kommun
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
// Skapa tabell
tableFromData({
  data: Object.values(sdSammanstallning)
});






// Skapa fullständig sammanställning för alla kommuner i Sverige
function skapaFullSammanstallning(data) {
  let grupperad = {};
  for (let item of data) {
    const { kommun, parti, roster2018, roster2022 } = item;
    if (!grupperad[kommun]) grupperad[kommun] = [];
    grupperad[kommun].push({ parti, roster2018, roster2022 });
  }
  return Object.entries(grupperad).map(([kommun, list]) => {
    let vinnare2018 = list.reduce((max, curr) => curr.roster2018 > max.roster2018 ? curr : max);
    let vinnare2022 = list.reduce((max, curr) => curr.roster2022 > max.roster2022 ? curr : max);
    const byttParti = vinnare2018.parti !== vinnare2022.parti;
    return {
      kommun,
      vinnare2018: vinnare2018.parti,
      roster2018: vinnare2018.roster2018,
      vinnare2022: vinnare2022.parti,
      roster2022: vinnare2022.roster2022,
      byte: byttParti ? "Ja" : "-",
      differens: (vinnare2022.roster2022 || 0) - (vinnare2018.roster2018 || 0)
    };
  });
}
// Skapa och sortera sammanställningen för hela landet
let sammanstallningAllaKommuner = skapaFullSammanstallning(electionResultsForWork).sort((a, b) => {
  if (a.byte === "Ja" && b.byte !== "Ja") return -1;
  if (a.byte !== "Ja" && b.byte === "Ja") return 1;
  return 0;
});

// Tabell för alla kommuner i Sverige
addMdToPage("### Alla kommuner i Sverige – sorterade efter partibyte");

tableFromData({
  data: sammanstallningAllaKommuner.map(row => ({
    kommun: row.kommun,
    vinnare2018: row.vinnare2018,
    roster2018: row.roster2018,
    vinnare2022: row.vinnare2022,
    roster2022: row.roster2022,
    byte: row.byte,
    differens: row.differens
  }))
});
