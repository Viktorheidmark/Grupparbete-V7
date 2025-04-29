// Använd rätt databas
dbQuery.use('undersokning_2018');

// Steg 1: Hämta data
let rows = await dbQuery('SELECT Omrade, M, C, L, KD, S, V, MP, SD FROM roster_2018');

// Lista över partier vi vill jämföra
let partier = ['M', 'C', 'L', 'KD', 'S', 'V', 'MP', 'SD'];

// Steg 2: Färgkarta för partier
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

// Steg 3: Förbered data för diagram
let chartData = [['Område', 'Röster', { role: 'style' }, { role: 'annotation' }]];

for (let row of rows) {
  let omrade = row.Omrade;

  // Hitta populäraste parti i området
  let maxParti = partier[0];
  let maxRöster = row[maxParti];

  for (let parti of partier) {
    if (row[parti] > maxRöster) {
      maxRöster = row[parti];
      maxParti = parti;
    }
  }

  let färg = partifarger[maxParti] || '#999';
  chartData.push([omrade, maxRöster, färg, maxParti]);
}

// Steg 4: Rita diagrammet
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