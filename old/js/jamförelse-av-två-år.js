
let year1 = addDropdown('År 1', ['2020', '2024'], '2020');
let year2 = addDropdown('År 2', ['2020', '2024'], '2024');


let col1 = `folkmangd${year1}`;
let col2 = `folkmangd${year2}`;

addMdToPage(`
  ## Folkmängdsutveckling mellan ${year1} och ${year2}

  Diagrammet nedan visar hur folkmängden i Sveriges län har förändrats mellan ${year1} och ${year2}.
  Ökningen är särskilt tydlig i större städer som Stockholm och Skåne, vilket kan kopplas till urbanisering
  och inflyttning. Glesbygdsområden har en mer stabil eller minskande befolkningsutveckling.
`);


let dataForChart = await dbQuery(`
  SELECT lan, ${col1} AS folkmangd1, ${col2} AS folkmangd2 FROM dinTabell
`);


drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(dataForChart, 'lan', `Folkmängd ${year1}`, `Folkmängd ${year2}`),
  options: {
    height: 500,
    chartArea: { left: 100, right: 0 },
    bar: { groupWidth: '60%' },
    hAxis: { title: 'Län' },
    vAxis: { title: 'Folkmängd', format: '#,###' },
    legend: { position: 'top' },
    title: `Folkmängd per län, jämförelse mellan ${year1} och ${year2}`
  }
});
