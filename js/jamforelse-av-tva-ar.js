// Vi jämför valresultat mellan 2018 och 2022 för att se om det har skett några förändringar i kommunerna.
dbQuery.use('riksdagsval-neo4j');

// Detta är en del av koden som används för att hämta och visualisera valresultat från riksdagsvalen 2018 och 2022.
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n');



// Detta gruppar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
let grupperadElectionResultsForWork = {};

// Vi grupperar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
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

  // Vi kontrollerar om vinnande parti har ändrats mellan 2018 och 2022
  const byttParti = vinnare2018.parti !== vinnare2022.parti;

  return {
    kommun,
    roster2018: vinnare2018.roster2018,
    vinnare2018: vinnare2018.parti,
    roster2022: vinnare2022.roster2022,
    vinnare2022: vinnare2022.parti,
    byte: byttParti ? "Ja" : "-",
    // Vi beräknar differensen i röster mellan 2018 och 2022
    differens: (vinnare2022.roster2022 || 0) - (vinnare2018.roster2018 || 0)
  };
});

// Kommuner där vinnande parti har ändrats (2018 → 2022)
let kommunerMedByte = sammanstallning
  .filter(r => r.byte === "Ja")
  .map(r => r.kommun);

// Kommuner där samma parti vann både 2018 och 2022
let stabilaKommuner = sammanstallning
  .filter(r => r.byte === "-")
  .map(r => r.kommun);




// nu vi skapar en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
addMdToPage("### Vinnande parti per kommun - med byte mellan 2018 och 2022");

addToPage(`
  <h3>Antal kommuner med partibyte (2018–2022):</h3>
  <p style="font-size: 1.2em; font-weight: bold; color: darkred;">
    ${kommunerMedByte.length} kommuner
  </p>
`);

// Sorterar så att kommuner med byte ("!!! Ja!!!") visas först
let sorteradSammanstallning = [...sammanstallning].sort((a, b) => {
  if (a.byte === "Ja" && b.byte !== "Ja") return -1;
  if (a.byte !== "Ja" && b.byte === "Ja") return 1;
  return 0;
});

// Detta är en del av koden som används för att skapa en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022.
tableFromData({
  data: sorteradSammanstallning.map(row => {
    // Vi markerar kommuner där vinnande parti har ändrats mellan 2018 och 2022
    const highlight = row.byte === "Ja";
    return {
      kommun: row.kommun,
      vinnare2018: row.vinnare2018,
      roster2018: row.roster2018,
      vinnare2022: row.vinnare2022,
      roster2022: row.roster2022,
      byte: row.byte,
      differens: row.differens,
    };
  })
});




// Här skapar vi en tabell med valresultaten för varje kommun, inklusive vinnande partier och röster för både 2018 och 2022
let years = [2018, 2022];
let partier = [...new Set(electionResultsForWork.map(x => x.parti))].sort();
