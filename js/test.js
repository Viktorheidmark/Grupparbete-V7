dbQuery.use('kommun-info-mongodb');


let year = addDropdown('År', ['2018', '2019', '2020', '2021', '2022',],);
let gender = addDropdown('kön', ['totalt', 'män', 'kvinnor'])
let chartType = addDropdown('Diagramtyp', ['Histogram', 'Linjediagram']);



//inkomstdata per kommun (topp 25)
let income = await dbQuery.collection('incomeByKommun').find({});


// Filtrera på valet gender
income = income.filter(x => x.kon == gender);



//Sortera efter högst medelinkomst 2022
income.sort((a, b) => (b[['medelInkomst' + year]] || 0) - (a[['medelInkomst' + year]] || 0));

let chartData = [['Kommun', 'Medelinkomst ' + year]];
income.forEach(row => {
  chartData.push([row.kommun, parseFloat(row['medelInkomst' + year]) || 0]);
});


// only show first 25 of chartdata
chartData = chartData.slice(0, 26);




let googleChartType = chartType === 'Linjediagram' ? 'LineChart' : 'ColumnChart';

drawGoogleChart({
  type: googleChartType,
  data: chartData,
  options: {
    title: `Medelinkomst per kommun (${year}), topp 25)`,
    height: 600,
    width: 1000,
    chartArea: { left: "15%", top: "10%" },
    hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Medelinkomst (tusen kr)' },
    legend: { position: 'none' },
    bar: { groupWidth: '80%' }
  }
});




drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: `Medelinkomst per kommun (${year}), topp 25)`,
    height: 600,
    width: 1000,
    chartArea: { left: "15%", top: "10%" },
    hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Medelinkomst (tusen kr)' },
    legend: { position: 'none' },
    bar: { groupWidth: '80%' }
  }
});
