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


addMdToPage("### Detta visar ett histogram över de 10 kommuner i Sverige som hade högst arbetslöshet år 2022 med personer mellan 16-64")

dbQuery.use('arbetsloshet');

let county = await dbQuery("SELECT Region, Arbetsloshet_2022 FROM arbetsloshet");

// Sortera efter högst arbetslöshet
county.sort((a, b) => b.Arbetsloshet_2022 - a.Arbetsloshet_2022);

// Välj de 10 med högst arbetslöshet
county = county.slice(0, 10);

// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(county, "Region", "Arbetsloshet_2022"),
  options: {
    title: 'Topp 10 kommuner med högst arbetslöshet',
    height: 800,
    chartArea: { left: "10%" }
  }
});



addMdToPage("### Detta visar ett histogram över de 10 kommuner i Sverige som hade lägst arbetslöshet år 2022 med personer mellan 16-64")

dbQuery.use('arbetsloshet');

let bajen = await dbQuery("SELECT Region, Arbetsloshet_2022 FROM arbetsloshet");

// Sortera efter lägst arbetslöshet (minst till störst)
bajen.sort((a, b) => a.Arbetsloshet_2022 - b.Arbetsloshet_2022);

// Välj de 10 med lägst arbetslöshet
bajen = bajen.slice(0, 10);
 
// Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(bajen, "Region", "Arbetsloshet_2022"),
  options: {
    title: 'Topp 10 kommuner med lägst arbetslöshet',
    height: 800,
    chartArea: { left: "10%" }
  }
});