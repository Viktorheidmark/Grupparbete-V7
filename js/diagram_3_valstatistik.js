// Steg 0: Lägg till dropdown för att välja år
let valAren = ['2018', '2022'];
let valtAr = addDropdown('Valår', valAren);

addMdToPage(`### Populäraste partiet per område – Valåret ${valtAr}`);

// Steg 1: Välj rätt databas baserat på år
if (valtAr === '2018') {
  dbQuery.use('undersokning_2018');
} else if (valtAr === '2022') {
  dbQuery.use('undersokning_2022');
}

// Steg 2: Hämta data
let rows = await dbQuery('SELECT Omrade, M, C, L, KD, S, V, MP, SD FROM roster_' + valtAr);

// Lista över partier vi vill jämföra
let partier = ['M', 'C', 'L', 'KD', 'S', 'V', 'MP', 'SD'];

// Steg 3: Färgkarta för partier
const partifarger = {
  'M': '#1f78b4',
  'C': '#33a02c',
  'L': '#6baed6',
  'KD': '#191970',
  'S': '#e31a1c',
  'V': '#b2182b',
  'MP': '#66c2a5',
  'SD': '#ffcc00'
};

// Steg 4: Samla data
let data = [];

for (let row of rows) {
  let omrade = row.Omrade;
  let maxParti = partier[0];
  let maxRöster = row[maxParti];

  for (let parti of partier) {
    if (row[parti] > maxRöster) {
      maxRöster = row[parti];
      maxParti = parti;
    }
  }

  data.push({
    omrade: omrade,
    roster: maxRöster,
    parti: maxParti,
    farg: partifarger[maxParti] || '#999'
  });
}

// Steg 5: Sortera i fallande ordning efter röster
data.sort((a, b) => b.roster - a.roster);

// Steg 6: Förbered chartData
let chartData = [['Område', 'Röster', { role: 'style' }, { role: 'annotation' }]];
for (let d of data) {
  chartData.push([d.omrade, d.roster, d.farg, d.parti]);
}

// Steg 7: Rita diagram
drawGoogleChart({
  type: 'BarChart',
  data: chartData,
  options: {
    height: 900,
    width: 1100,
    legend: 'none',
    chartArea: { width: '80%', height: '85%' },
    hAxis: {
      title: 'Antal röster på populäraste parti',
      minValue: 0
    },
    vAxis: {
      title: 'Område',
      textStyle: { fontSize: 10 }
    },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 12,
        auraColor: 'none',
        color: '#555'
      }
    }
  }
});