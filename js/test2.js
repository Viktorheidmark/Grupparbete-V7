// Huvudfunktion
async function fetchAndVisualizeData() {
  dbQuery.use('riksdagsval-neo4j');
  let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n');

  if (!Array.isArray(electionResults) || electionResults.length === 0) {
    console.error('Inga valresultat hittades eller datan är inte en array:', electionResults);
    return;
  }

  let allCommmunNames = [...new Set(electionResults.map(({ kommun }) => kommun))];

  let votesPerCommun = allCommmunNames.map(kommun => ({
    kommun,
    votes2022_V: electionResults.find(x => x.parti === 'Vänsterpartiet' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_V: electionResults.find(x => x.parti === 'Vänsterpartiet' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_S: electionResults.find(x => x.parti === 'Arbetarepartiet-Socialdemokraterna' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_S: electionResults.find(x => x.parti === 'Arbetarepartiet-Socialdemokraterna' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_MP: electionResults.find(x => x.parti === 'Miljöpartiet de gröna' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_MP: electionResults.find(x => x.parti === 'Miljöpartiet de gröna' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_C: electionResults.find(x => x.parti === 'Centerpartiet' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_C: electionResults.find(x => x.parti === 'Centerpartiet' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_L: electionResults.find(x => x.parti === 'Liberalerna ' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_L: electionResults.find(x => x.parti === 'Liberalerna ' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_KD: electionResults.find(x => x.parti === 'Kristdemokraterna' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_KD: electionResults.find(x => x.parti === 'Kristdemokraterna' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_M: electionResults.find(x => x.parti === 'Moderaterna' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_M: electionResults.find(x => x.parti === 'Moderaterna' && x.kommun === kommun)?.roster2018 || 0,

    votes2022_SD: electionResults.find(x => x.parti === 'Sverigedemokraterna' && x.kommun === kommun)?.roster2022 || 0,
    votes2018_SD: electionResults.find(x => x.parti === 'Sverigedemokraterna' && x.kommun === kommun)?.roster2018 || 0
  }));

  const selectedCommunes = [
    'Flen', 'Perstorp', 'Eskilstuna', 'Malmö', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn',
    'Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'
  ];

  const högarbetslöshetCommunes = ['Flen', 'Perstorp', 'Malmö', 'Eskilstuna', 'Fagersta', 'Sandviken', 'Ronneby', 'Filipstad', 'Södertälje', 'Söderhamn'];
  const lågarbetslöshetCommunes = ['Pajala', 'Kiruna', 'Kungsbacka', 'Tjörn', 'Öckerö', 'Krokom', 'Sotenäs', 'Gällivare', 'Habo', 'Mörbylånga'];

  let filteredResults = votesPerCommun.filter(({ kommun }) => selectedCommunes.includes(kommun));

  let högArbetsloshetKommuner = filteredResults.filter(x => högarbetslöshetCommunes.includes(x.kommun));
  let lågArbetsloshetKommuner = filteredResults.filter(x => lågarbetslöshetCommunes.includes(x.kommun));

  ['2018', '2022'].forEach(year => {
    drawGoogleChart({
      type: 'ColumnChart',
      data: makeChartFriendly(högArbetsloshetKommuner, year),
      options: {
        title: `Kommuner med hög arbetslöshet (${year})`,
        height: 600,
        width: 1200,
        hAxis: { title: 'Kommun' },
        vAxis: { title: 'Antal röster' },
        legend: { position: 'none' }
      }
    });

    drawGoogleChart({
      type: 'ColumnChart',
      data: makeChartFriendly(lågArbetsloshetKommuner, year),
      options: {
        title: `Kommuner med låg arbetslöshet (${year})`,
        height: 600,
        width: 1200,
        hAxis: { title: 'Kommun' },
        vAxis: { title: 'Antal röster' },
        legend: { position: 'none' }
      }
    });

    drawGoogleChart({
      type: 'PieChart',
      data: makeChartFriendlyPie(högArbetsloshetKommuner, year),
      options: {
        title: `Andel röster i kommuner med hög arbetslöshet (${year})`,
        height: 500,
        width: 800,
        is3D: true,
        legend: { position: 'right' }
      }
    });

    drawGoogleChart({
      type: 'PieChart',
      data: makeChartFriendlyPie(lågArbetsloshetKommuner, year),
      options: {
        title: `Andel röster i kommuner med låg arbetslöshet (${year})`,
        height: 500,
        width: 800,
        is3D: true,
        legend: { position: 'right' }
      }
    });
  });

  // Förändringar i procentdiagram (linjediagram)
  drawGoogleChart({
    type: 'LineChart',
    data: makePercentageChangeChart(filteredResults),
    options: {
      title: 'Förändring i röststöd mellan 2018 och 2022 (%)',
      height: 600,
      width: 1200,
      hAxis: { title: 'Kommun' },
      vAxis: { title: 'Förändring (%)' },
      curveType: 'function',
      legend: { position: 'bottom' }
    }
  });
}

function makeChartFriendly(data, year = '2022') {
  const suffix = `votes${year}_`;
  const parties = ['V', 'S', 'MP', 'C', 'L', 'KD', 'M', 'SD'];
  const header = ['Kommun', ...parties];

  const rows = data.map(item => [
    item.kommun,
    ...parties.map(party => item[`${suffix}${party}`] || 0)
  ]);

  return [header, ...rows];
}

function makeChartFriendlyPie(data, year = '2022') {
  const suffix = `votes${year}_`;
  const parties = ['V', 'S', 'MP', 'C', 'L', 'KD', 'M', 'SD'];

  let totals = {};

  for (const item of data) {
    for (const party of parties) {
      const key = suffix + party;
      totals[party] = (totals[party] || 0) + (item[key] || 0);
    }
  }

  const result = [['Parti', 'Röster']];
  for (const party of parties) {
    result.push([party, totals[party]]);
  }

  return result;
}

function makePercentageChangeChart(data) {
  const parties = ['V', 'S', 'MP', 'C', 'L', 'KD', 'M', 'SD'];
  const header = ['Kommun', ...parties];
  const rows = data.map(item => {
    const row = [item.kommun];
    for (const party of parties) {
      const votes2018 = item[`votes2018_${party}`] || 0;
      const votes2022 = item[`votes2022_${party}`] || 0;
      const change = votes2018 === 0 ? 0 : ((votes2022 - votes2018) / votes2018) * 100;
      row.push(Math.round(change * 10) / 10); // avrunda till 1 decimal
    }
    return row;
  });
  return [header, ...rows];
}

fetchAndVisualizeData();
