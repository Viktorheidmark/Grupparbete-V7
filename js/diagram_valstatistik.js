dbQuery.use('valdata');

addMdToPage(`## Förändring i antal röster per parti (2022 jämfört med 2018)`);

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


// Steg 4: Rita diagrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(changes, 'Parti'),
  options: {
    height: 500,
    width: 1250,
    hAxis: { title: 'Parti' },
    vAxis: { title: 'Förändring i antal röster (2022 - 2018)' },
    legend: 'none',
    bar: { groupWidth: '90%' }
  }
});