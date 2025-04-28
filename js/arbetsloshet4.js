// Hämta arbetslöshet för bara de kommunerna
dbQuery.use("arbetsloshet");

let data = await dbQuery('SELECT Region, Arbetsloshet_2022 FROM arbetsloshet');

// Kommuner i Blekinge län
const blekingeKommuner = [
  "Karlskrona", "Karlshamn", "Ronneby", "Sölvesborg", "Olofström", "Rödeby", "Växjö"
];

// Kommuner i Norrbottens län
const norrbottensKommuner = [
  "Luleå", "Piteå", "Kiruna", "Haparanda", "Kalix", "Boden", "Arjeplog", "Arvidsjaur", "Överkalix", "Jokkmokk", "Gällivare"
];

// Steg 2: Beräkna medelarbetslösheten för varje län
let arbetsloshetPerLan = {
  "Blekinge": { total: 0, count: 0 },
  "Norrbotten": { total: 0, count: 0 }
};

// Filtrera data och summera arbetslösheten för varje län
data.forEach(row => {
  let region = row.Region;
  let arbetsloshet = row.Arbetsloshet_2022;

  // Kontrollera om kommunen är i Blekinge län
  if (blekingeKommuner.includes(region)) {
    arbetsloshetPerLan["Blekinge"].total += arbetsloshet;
    arbetsloshetPerLan["Blekinge"].count += 1;
  }

  // Kontrollera om kommunen är i Norrbottens län
  if (norrbottensKommuner.includes(region)) {
    arbetsloshetPerLan["Norrbotten"].total += arbetsloshet;
    arbetsloshetPerLan["Norrbotten"].count += 1;
  }
});

// Beräkna medelarbetslösheten per län
let medelArbetsloshetPerLan = {
  "Blekinge": arbetsloshetPerLan["Blekinge"].total / arbetsloshetPerLan["Blekinge"].count,
  "Norrbotten": arbetsloshetPerLan["Norrbotten"].total / arbetsloshetPerLan["Norrbotten"].count
};

// Skapa en container för diagrammet dynamiskt i JavaScript
let chartContainer = document.createElement('div');
chartContainer.id = 'chart_div'; // ge den ett ID
document.body.appendChild(chartContainer); // lägg till den i body eller annan förälder

// Rita diagrammet
google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(function () {
  // Omvandla data till ett format som Google Charts kan använda
  let chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Region');
  chartData.addColumn('number', 'Arbetslöshet 2022');

  chartData.addRows([
    ['Blekinge', medelArbetsloshetPerLan['Blekinge']],
    ['Norrbotten', medelArbetsloshetPerLan['Norrbotten']]
  ]);

  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

  chart.draw(chartData, {
    title: 'Medel Arbetslöshet per Län (2022)',
    height: 800,
    chartArea: { left: "10%" },
    hAxis: {
      title: 'Medel Arbetslöshet (%)',
      minValue: 0
    },
    vAxis: {
      title: 'Län'
    }
  });
});