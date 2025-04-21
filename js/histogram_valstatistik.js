dbQuery.use('valdata');

// Hämta tillgängliga år
let valdata = (await dbQuery('SELECT DISTINCT Ar FROM valresultat')).map(x => x.Ar);

// Dropdown för år
let currentage = addDropdown('Ar', valdata);  // OBS: fixade Ar -> valdata

addMdToPage(`
  ## Röster per parti (${currentage})
`);

// Hämta data för valt år
let dataForChart = await dbQuery(
  `SELECT Parti, Roster FROM valresultat WHERE Ar = '${currentage}'`
);

// Rita stapeldiagram
drawGoogleChart({
  type: 'ColumnChart', // bättre än histogram för detta
  data: makeChartFriendly(dataForChart, 'Parti'),
  options: {
    height: 500,
    width: 1250,
    hAxis: { title: 'Parti' },
    vAxis: { title: 'Antal röster' },
    legend: 'none',
    bar: { groupWidth: '90%' }
  }
});