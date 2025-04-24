addMdToPage("# Histogram över röster till olika partier (välj år)");

// Definiera tillgängliga år direkt
let valdata = ['2018', '2022'];

// Skapa dropdown för att välja år
let valtAr = addDropdown('År', valdata);

addMdToPage(`## Röster per parti (${valtAr})`);

// Hämta och summera data från rätt tabell beroende på valt år
async function fetchAndUpdateChart(year) {
  let data;

  if (year === '2018') {
    dbQuery.use('undersokning_2018');
    data = await dbQuery('SELECT M, C, L, KD, S, V, MP, SD FROM roster_2018');
  } else if (year === '2022') {
    dbQuery.use('undersokning_2022');
    data = await dbQuery('SELECT M, C, L, KD, S, V, MP, SD FROM roster_2022');
  }

  // Färger för partier
  const partifarger = {
    'M': '#1D74BB',        // Moderaterna
    'C': '#009933',        // Centerpartiet
    'L': '#6AB2E7',        // Liberalerna
    'KD': '#003F7D',       // Kristdemokraterna
    'S': '#EE2020',        // Socialdemokraterna
    'V': '#AF0000',        // Vänsterpartiet
    'MP': '#83CF39',       // Miljöpartiet
    'SD': '#DDDD00'        // Sverigedemokraterna
  };

  // Summera röster per parti
  let totals = {
    M: 0, C: 0, L: 0, KD: 0, S: 0, V: 0, MP: 0, SD: 0
  };

  data.forEach(row => {
    for (let parti in totals) {
      totals[parti] += parseInt(row[parti]) || 0;
    }
  });

  // Skapa chartdata
  let chartData = [['Parti', 'Röster', { role: 'style' }]];
  for (let parti in totals) {
    let farg = partifarger[parti] || '#888888';
    chartData.push([parti, totals[parti], `color: ${farg}`]);
  }

  // Rita diagram
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      height: 500,
      width: 1250,
      hAxis: { title: 'Parti' },
      vAxis: { title: 'Antal röster' },
      legend: 'none',
      bar: { groupWidth: '90%' }
    }
  });
}

// Initiala rendering av diagram för det valda året
fetchAndUpdateChart(valtAr);

// Eventlistener för att uppdatera diagrammet vid årval
document.getElementById('yearSelect').addEventListener('change', e => {
  let selectedYear = e.target.value;
  fetchAndUpdateChart(selectedYear);
});