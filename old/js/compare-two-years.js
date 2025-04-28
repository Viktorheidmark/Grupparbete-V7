// filepath: c:\Users\Book\Grupparbete-V7\Grupparbete-V7\js\compare-two-years.js
let year1 = 2018;
let year2 = 2024;

// Example data for comparison
let dataYear1 = 500; // Replace with actual data
let dataYear2 = 700; // Replace with actual data

// Load the Google Charts library
google.charts.load('current', { packages: ['corechart'] });

// Draw the chart after the library is loaded
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // Prepare the data for the chart
  let data = google.visualization.arrayToDataTable([
    ['Year', 'Value'],
    [year1.toString(), dataYear1],
    [year2.toString(), dataYear2]
  ]);

  // Set chart options
  let options = {
    title: 'Comparison of Two Years',
    hAxis: { title: 'Year' },
    vAxis: { title: 'Value' },
    legend: 'none'
  };

  // Create and draw the chart
  let chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}