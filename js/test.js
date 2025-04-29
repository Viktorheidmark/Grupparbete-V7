dbQuery.use('kommun-info-mongodb');


let year = addDropdown('År', ['2018', '2022',],);
let gender = addDropdown('kön', ['totalt', 'män', 'kvinnor'])
let chartType = addDropdown('Diagramtyp', ['Histogram', 'Linjediagram', 'Tårtdiagram']);

addMdToPage(`
  ## Jämförelse av medelinkomst per kommun (${year})
Medelinkomstförändringar i Svenska Kommuner (2018-2022)
Under perioden 2018 till 2022 har medelinkomsterna i flera svenska kommuner visat på en stadig ökning, vilket kan indikera både ekonomisk tillväxt och förändringar i lokala arbetsmarknader. Denna ökning är inte enhetlig – vissa kommuner har sett en markant uppgång i medelinkomster, medan andra har haft långsammare eller mer blygsamma förändringar. Genom att titta på specifika kommuner, kön och årsdata, kan vi få en tydligare bild av hur ekonomiska faktorer spelar in i människors liv i dessa områden.

`);


//inkomstdata per kommun (topp 50)
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
chartData = chartData.slice(0, 51);


let googleChartType = chartType === 'Linjediagram' ? 'LineChart' : (chartType === 'Tårtdiagram' ? 'PieChart' : 'ColumnChart');

// Rita diagram baserat på dropdownval
if (googleChartType === 'LineChart' || googleChartType === 'ColumnChart') {
  // Rita Linjediagram eller Kolumndiagram
  drawGoogleChart({
    type: googleChartType,
    data: chartData,
    options: {
      title: `Medelinkomst per kommun (${year}), topp 50`,
      height: 600,
      width: 1000,
      chartArea: { left: "15%", top: "10%" },
      hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
      vAxis: { title: 'Medelinkomst (tusen kr)' },
      legend: { position: 'none' },
      bar: { groupWidth: '80%' },
      colors: ['#1E88E5'], // Dark blue color
    }
  });
} else if (googleChartType === 'PieChart') {
  // Rita 3D Tårtdiagram (PieChart)
  let pieChartData = [['Kommun', 'Medelinkomst ' + year]];
  income.slice(0, 10).forEach(row => {  // Endast topp 10 för tårtdiagram
    pieChartData.push([row.kommun, parseFloat(row['medelInkomst' + year]) || 0]);
  });

  drawGoogleChart({
    type: 'PieChart',
    data: pieChartData,
    options: {
      title: `Topp 10 kommuner efter medelinkomst (${year})`,
      height: 600,
      width: 1000,
      is3D: true,  // Aktiverar 3D-effekt för tårtdiagrammet
      legend: { position: 'labeled' },
    }
  });
}
