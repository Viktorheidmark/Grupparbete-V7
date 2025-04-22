dbQuery.use('kommun-info-mongodb');

//inkomstdata per kommun 
let income = await dbQuery.collection('incomeByKommun').find({}).limit(70);
console.log('income from mongodb', income);


let year1 = addDropdown('År 1', ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],);
let col1 = `Kommun'${year1}`;



//sorterar efter medelinkomst för det valda året
function sortByIncomeYear(income, year) {

  let incomeColumn = `medelInkomst${year}`;


  income.sort((a, b) => (b[incomeColumn] || 0) - (a[incomeColumn] || 0));
}


let year = '2020'; // Exempel på valt år
sortByIncomeYear(income, year);

let years = ['2018', '2019', '2020', '2021', '2022'];

years.forEach(year => {
  console.log(`Sortering för år ${year}:`);
  sortByIncomeYear(income, year);
  console.log(income);
});



//Google Chart
let chartData = [['Kommun', 'Medelinkomst 2020,',]];
income.forEach(row => {
  chartData.push([row.kommun, parseFloat(row.medelInkomst2022) || 0]);
});

//histogrammet
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: "Medelinkomst per kommun (2020, topp 70)",
    height: 600,
    width: 1000,
    chartArea: { left: "15%", top: "10%" },
    hAxis: { title: 'Kommun', slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: 'Medelinkomst (tusen kr)' },
    legend: { position: 'none' },
    bar: { groupWidth: '80%' }
  }
});
