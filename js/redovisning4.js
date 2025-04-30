dbQuery.use('valdata');

addMdToPage(`### Förändringen i antal röster per parti jämfört mellan 2018 och 2022`);

// Steg 1: Hämta data för 2018 och 2022
let data2018 = await dbQuery(`SELECT Parti, Roster FROM valresultat WHERE Ar = 2018`);
let data2022 = await dbQuery(`SELECT Parti, Roster FROM valresultat WHERE Ar = 2022`);

// Steg 2: Slå ihop datan baserat på parti
let changes = [];

for (let row of data2022) {
  let p = row.Parti;
  let r2022 = parseInt(row.Roster.toString().replace(/\s/g, ''));
  let match2018 = data2018.find(x => x.Parti === p);
  if (match2018) {
    let r2018 = parseInt(match2018.Roster.toString().replace(/\s/g, ''));
    let diff = r2022 - r2018;
    changes.push({ Parti: p, Förändring: diff });
  }
}

// Färgkoder för partier
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

// Skapa data-array för Google Chart med style-kolumn
let chartData = [['Parti', 'Förändring', { role: 'style' }]];
changes.forEach(row => {
  let color = partifarger[row.Parti] || '#888888';
  chartData.push([row.Parti, row.Förändring, `color: ${color}`]);
});

// Steg 4: Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    height: 500,
    width: 1250,
    hAxis: { title: 'Parti' },
    vAxis: { title: 'Förändring i antal röster (2022 - 2018)' },
    legend: 'none',
    bar: { groupWidth: '90%' }
  }
});



addMdToPage("# Här är ett histogram över röster till dem olika partierna med en dropdown på år 2018 noch 2022 ")


dbQuery.use('valdata');

// Hämta tillgängliga år
let valdata = (await dbQuery('SELECT DISTINCT Ar FROM valresultat')).map(x => x.Ar);

// Dropdown för år
let currentage = addDropdown('År', valdata);

addMdToPage(`
  ## Röster per parti (${currentage})
`);

// Hämta data för valt år
let dataForChart = await dbQuery(
  `SELECT Parti, Roster FROM valresultat WHERE Ar = '${currentage}'`
);

// Färgkoder för partier
const particolours = {
  'Socialdemokraterna': '#EE2020',
  'Moderaterna': '#1D74BB',
  'Sverigedemokraterna': '#DDDD00',
  'Centerpartiet': '#009933',
  'Vänsterpartiet': '#AF0000',
  'Kristdemokraterna': '#003F7D',
  'Liberalerna': '#6AB2E7',
  'Miljöpartiet': '#83CF39'
};

// Skapa ny array i formatet: ['Parti', 'Röster', { role: 'style' }]
let bajen = [['Parti', 'Röster', { role: 'style' }]];
dataForChart.forEach(row => {
  let color = particolours[row.Parti] || '#888888';
  bajen.push([row.Parti, row.Roster, `color: ${color}`]);
});

drawGoogleChart({
  type: 'ColumnChart',
  data: bajen,
  options: {
    height: 500,
    width: 1250,
    hAxis: { title: 'Parti' },
    vAxis: { title: 'Antal röster' },
    legend: 'none',
    bar: { groupWidth: '90%' }
  }
});