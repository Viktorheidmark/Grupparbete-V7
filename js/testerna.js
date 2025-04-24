

// === DEL 2: Fördjupad analys per valt parti och år ===

// Vi jämför valresultat mellan 2018 och 2022 för att se om det har skett några förändringar i kommunerna.
dbQuery.use('riksdagsval-neo4j');

// Detta är en del av koden som används för att hämta och visualisera valresultat från riksdagsvalen 2018 och 2022.
let electionResultsForWork = await dbQuery('MATCH (n:Partiresultat) RETURN n Limit 100');



// Detta gruppar valresultaten efter kommuner och skapar en lista med vinnande partier för varje kommun.
let grupperadElectionResultsForWork = {};

let years = [2018, 2022];
let partier = [...new Set(electionResultsForWork.map(x => x.parti))].sort();

let year = addDropdown('Välj år', years, 2022);
let chosenParti = addDropdown('Välj parti', partier);

let antalKommunerMedVinst = sammanstallning.filter(row =>
  (year == 2018 && row.vinnare2018 === chosenParti) ||
  (year == 2022 && row.vinnare2022 === chosenParti)
).length;

let totalVotes = s.sum(electionResultsForWork.map(x => year === 2018 ? +x.roster2018 : +x.roster2022));
let partyVotes = s.sum(electionResultsForWork.filter(x => x.parti === chosenParti).map(x => year === 2018 ? +x.roster2018 : +x.roster2022));
let percent = ((partyVotes / totalVotes) * 100).toFixed(1);

addToPage(`
  <div style="display: flex; justify-content: space-between; gap: 30px; align-items: flex-start;">
    <div style="flex: 1;">
      <h3>${chosenParti}, år ${year}</h3>
      <p>Partiet <strong>${chosenParti}</strong> vann i <strong>${antalKommunerMedVinst}</strong> kommuner.</p>
      <p>Totalt antal röster: <strong>${partyVotes.toLocaleString('sv-SE')}</strong></p>
      <p>Andel av alla röster: <strong>${percent}%</strong></p>
    </div>
    <div id="pieChartContainer" style="flex: 1;"></div>
  </div>
`);
