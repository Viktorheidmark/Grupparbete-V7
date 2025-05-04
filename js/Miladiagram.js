// Huvudfunktion
async function fetchAndVisualizeData() {
  dbQuery.use('riksdagsval-neo4j');
  let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n');
 
 
  addMdToPage(`### Partiernas röstförändringar mellan valen - förändring i röststöd 2018 - 2022
Jämförelse mellan 10 kommuner med högst arbetslöshet och 10 kommuner med lägst arbetslöshet`);
 
 
  addMdToPage(`### I kommunerna med lägst arbetslöshet som Kungsbacka, Tjörn, Öckerö och Habo har Sverigedemokraterna också ökat,
Kungsbacka och Tjörn var ökningen omkring 20 procentenheter,
medan ökningen i Öckerö var närmare 30 procentenheter.
 
Vi kan se att Sverigedemokraterna har tagit röster från traditionellt borgerliga partier som Liberalerna, Moderaterna och Kristdemokraterna.
Detta tyder på att Sverigedemokraterna inte längre främst uppfattas som ett parti för "missnöjda väljare" eller bara för dem i socioekonomiskt utsatta områden.
Istället har partiet börjat vinna stöd även bland grupper med högre utbildning och inkomstgrupper som tidigare röstat borgerligt.
 
Socialdemokraterna ökade med omkring +4 till +6 procentenheter i flera kommuner med hög arbetslöshet,
som Filipstad, Flen och Ronneby. I kommuner med låg arbetslöshet, som Tjörn, Kungsbacka och Öckerö, var förändringen
nästan ±0 procentenheter, vilket antyder att Socialdeokraterna främst stärkts i utsatta områden
 
Centerpartiet, Liberalerna och Miljöpartiet har tappat röster tydligt i nästan alla kommuner.
Centerpartiet backade exempelvis med -5 till -7 procentenheter i Kiruna, Ronneby och Söderhamn.
Liberalerna tappade -3 till -6 procentenheter, både i låg och högarbetslöshets kommuner.
Miljöpartiet minskade i till exempel Malmö och Södertälje med -4 till -6 procentenheter.
Moderaterna (M) och Kristdemokraterna (KD) minskade också i många kommuner, särskilt där Sverigedemokraterna vuxit mycket:
I kommuner som Fagersta och Filipstad tappade Moderaterna omkring -4 till -6 procentenheter, vilket tyder på att SD tagit väljare direkt från högern.
 
 
 
Att både Sverigedemokraterna och Socialdemokraterna stärktes berodde
sannolikt på att de tog klara och konsekventa politiska positioner.
Det visar att väljarna i allt större utsträckning sökte partier som vågade stå för något
inte kompromissa. Valresultatet blev därför en tydlig markering av polarisering: de två partier som ideologiskt står längst ifrån varandra var också de som vann flest nya väljare. I en tid av osäkerhet
efterfrågade många inte mittenlösningar, utan raka besked.
 
Bekräftelse av hyotesen baserat på 20 utvalda kommuner
väljare i utsatta områden tenderar att rösta på partier som uppfattas som tydliga
och handlingskraftiga. Både Socialdemokraterna och
Sverigedemokraterna gick framåt i valet 2022,
samtidigt som mittenpartierna tappade stöd i alla 20 kommuner. Överraskande var att Sverigedemokraterna framstår alltmer
som ett högeralternativ, snarare än enbart ett missnöjesparti.
 
 
Att både Sverigedemokraterna och Socialdemokraterna stärktes berodde
sannolikt på att de tog klara och konsekventa politiska positioner.
Det visar att väljarna i allt större utsträckning sökte partier som vågade stå för något
inte kompromissa. Valresultatet blev därför en tydlig markering av polarisering:
de två partier som ideologiskt står längst ifrån varandra var också de som vann
flest nya väljare. I en tid av osäkerhet
efterfrågade många inte mittenlösningar, utan raka besked.
`);
 
  addMdToPage(`### Förändringen i antal röster per parti jämfört mellan 2018 och 2022`);
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
 
 
  // Jämförelsediagram för kommuner med hög och låg arbetslöshet (2018 vs 2022)
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartCompareYears(högArbetsloshetKommuner),
    options: {
      title: 'Kommuner med högst arbetslöshet - jämförelse 2018 och 2022',
      height: 600,
      width: 2000,
      hAxis: { title: 'Kommun', textStyle: { fontSize: 12 } },
      vAxis: { title: 'Antal röster' },
      legend: { position: 'right' },
      isStacked: false,
      colors: [
        '#DA291C', '#F4A7A7', // Vänsterpartiet 2018, 2022
        '#E8112D', '#F6B4B4', // Socialdemokraterna
        '#83C441', '#AEDF8C', // Miljöpartiet
        '#83CF39', '#B7F28A', // Centerpartiet
        '#009FE3', '#66CCFF', // Liberalerna
        '#000077', '#4D4D99', // Kristdemokraterna
        '#0066CC', '#7BAAF7', // Moderaterna
        '#FFE600', '#FFF599'  // Sverigedemokraterna
      ]
    }
  });
 
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartCompareYears(lågArbetsloshetKommuner),
    options: {
      title: 'Kommuner med lägst arbetslöshet - jämförelse 2018 och 2022',
      height: 600,
      width: 2000,
      hAxis: { title: 'Kommun', textStyle: { fontSize: 12 } },
      vAxis: { title: 'Antal röster' },
      legend: { position: 'right' },
      isStacked: false,
      colors: [
        '#DA291C', '#F4A7A7',
        '#E8112D', '#F6B4B4',
        '#83C441', '#AEDF8C',
        '#83CF39', '#B7F28A',
        '#009FE3', '#66CCFF',
        '#000077', '#4D4D99',
        '#0066CC', '#7BAAF7',
        '#FFE600', '#FFF599'
      ]
    }
  });
 
  // Funktion som bygger upp jämförelsedata 2018 vs 2022
  function makeChartCompareYears(data) {
    const parties = ['V', 'S', 'MP', 'C', 'L', 'KD', 'M', 'SD'];
    const header = ['Kommun'];
 
    // Lägg till två kolumner per parti: 2018 och 2022
    parties.forEach(party => {
      header.push(`${party} 2018`);
      header.push(`${party} 2022`);
    });
 
    // Bygg data-raderna
    const rows = data.map(item => {
      const row = [item.kommun];
      parties.forEach(party => {
        const votes2018 = item[`votes2018_${party}`] || 0;
        const votes2022 = item[`votes2022_${party}`] || 0;
        row.push(votes2018, votes2022);
      });
      return row;
    });
 
    return [header, ...rows];
  }
 
 
 
  ['2018', '2022'].forEach(year => {
    drawGoogleChart({
      type: 'ColumnChart',
      data: makeChartFriendly(högArbetsloshetKommuner, year),
      options: {
        title: `Kommuner med högst arbetslöshet (${year})`,
        height: 600,
        width: 1800,
        hAxis: { title: 'Kommun' },
        vAxis: { title: 'Antal röster' },
        legend: { position: 'right' },
        colors: ['#DA291C', '#E8112d', '#83c441', '#83CF39', '#009fe3', '#000077', '#0066CC', '#ffe600']
        // Vänsterpartiet, Socialdemokraterna, socialdemokratisk, Miljöpartiet, Centerpartiet, Liberalerna, Kristdemokraterna, Moderaterna, Sverigedemokraterna
      }
    });
 
 
 
    drawGoogleChart({
      type: 'ColumnChart',
      data: makeChartFriendly(lågArbetsloshetKommuner, year),
      options: {
        title: `Kommuner med lägst arbetslöshet (${year})`,
        height: 600,
        width: 1800,
        hAxis: { title: 'Kommun' },
        vAxis: { title: 'Antal röster' },
        legend: { position: 'right' },
        colors: ['#DA291C', '#E8112d', '#83c441', '#83CF39', '#009fe3', '#000077', '#0066CC', '#ffe600']
        // Vänsterpartiet, Socialdemokraterna, socialdemokratisk, Miljöpartiet, Centerpartiet, Liberalerna, Kristdemokraterna, Moderaterna, Sverigedemokraterna
      }
    });
 
    drawGoogleChart({
      type: 'PieChart',
      data: makeChartFriendlyPie(högArbetsloshetKommuner, year),
      options: {
        title: `Andel röster i kommuner med högst arbetslöshet (${year})`,
        height: 500,
        width: 800,
        is3D: true,
        legend: { position: 'right' },
        colors: ['#DA291C', '#E8112d', '#83c441', '#83CF39', '#009fe3', '#000077', '#0066CC', '#ffe600']
        // Vänsterpartiet, Socialdemokraterna, socialdemokratisk, Miljöpartiet, Centerpartiet, Liberalerna, Kristdemokraterna, Moderaterna, Sverigedemokraterna
      }
    });
 
    drawGoogleChart({
      type: 'PieChart',
      data: makeChartFriendlyPie(lågArbetsloshetKommuner, year),
      options: {
        title: `Andel röster i kommuner med lägst arbetslöshet (${year})`,
        height: 500,
        width: 800,
        is3D: true,
        legend: { position: 'right' },
        colors: ['#DA291C', '#E8112d', '#83c441', '#83CF39', '#009fe3', '#000077', '#0066CC', '#ffe600']
        // Vänsterpartiet, Socialdemokraterna, socialdemokratisk, Miljöpartiet, Centerpartiet, Liberalerna, Kristdemokraterna, Moderaterna, Sverigedemokraterna
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
      width: 1800,
      hAxis: { title: 'Kommun' },
      vAxis: { title: 'Förändring (%)' },
      curveType: 'function',
      legend: { position: 'bottom' },
      colors: ['#DA291C', '#E8112D', '#83C441', '#83CF39', '#009FE3', '#000077', '#0066CC', '#FFE600']
 
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
 