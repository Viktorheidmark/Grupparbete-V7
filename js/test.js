dbQuery.use('valresultat');

let valdata = ['val_2018', 'val_2022'];
let currentage = addDropdown('Valår', valdata);

addMdToPage(`
  ## Röster per parti och kön (${currentage})  
`);

let dataForChart = await dbQuery(`
  SELECT parti, kon, SUM(${currentage}) AS roster
  FROM rostning
  GROUP BY parti, kon
`);

if (!Array.isArray(dataForChart)) {
  addMdToPage("Kunde inte hämta datan korrekt. Kontrollera att tabellen 'valresultat' finns och innehåller kolumnerna 'parti', 'kon' och '${currentage}'.");
  console.log("dataForChart är inte en array:", dataForChart);
} else {
  const partifarger = {
    'Socialdemokraterna': '#EE2020',
    'Moderaterna': '#1D74BB',
    'Sverigedemokraterna': '#DDDD00',
    'Centerpartiet': '#009933',
    'Vänsterpartiet': '#AF0000',
    'Kristdemokraterna': '#003F7D',
    'Liberalerna': '#6AB2E7',
    'Miljöpartiet': '#83CF39'
  };

  let chartData = [['Parti', 'Män', 'Kvinnor']];
  let partisamling = {};

  dataForChart.forEach(row => {
    if (!partisamling[row.parti]) {
      partisamling[row.parti] = { man: 0, kvinnor: 0 };
    }

    let röster = row.roster || 0;

    if (row.kon === 'man') {
      partisamling[row.parti].man = röster;
    } else if (row.kon === 'kvinnor') {
      partisamling[row.parti].kvinnor = röster;
    }
  });

  Object.keys(partisamling).forEach(parti => {
    chartData.push([
      parti,
      partisamling[parti].man,
      partisamling[parti].kvinnor
    ]);
  });

  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      height: 500,
      width: 1250,
      hAxis: { title: 'Parti' },
      vAxis: { title: 'Antal röster' },
      legend: { position: 'top' },
      bar: { groupWidth: '70%' },
      isStacked: false
    }
  });
}