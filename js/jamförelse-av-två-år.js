let dataForChart = await dbQuery(`
  SELECT lan, ${col1} AS folkmangd1, ${col2} AS folkmangd2 FROM dinTabell
`);

let year1 = addDropdown('År 1', ['2020', '2024'], '2020');
let year2 = addDropdown('År 2', ['2020', '2024'], '2024');

addMdToPage(`
  ## Folkmängd per län – jämförelse mellan år ${year1} och år ${year2}
`);

// Konstruera kolumnnamn dynamiskt
let col1 = `folkmangd${year1}`;
let col2 = `folkmangd${year2}`;

// Rita diagram
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
