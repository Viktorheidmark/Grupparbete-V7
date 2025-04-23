// Ladda Google Charts (en gång)
google.charts.load('current', { packages: ['corechart'], language: 'sv' });
google.charts.setOnLoadCallback(init);

// Funktion för att rita Google Chart
function drawChart(dataRows, kommun) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Parti');
    chartData.addColumn('number', 'Antal röster');

    dataRows.forEach(row => {
        chartData.addRow([row.parti, parseInt(row.roster)]);
    });

    const options = {
        title: `Röster per parti – ${kommun} (2018)`,
        height: 600,
        chartArea: { left: '20%', top: '10%', width: '70%', height: '80%' },
        legend: { position: 'none' },
        hAxis: { title: 'Antal röster' },
        vAxis: { title: 'Parti' },
        bars: 'horizontal'
    };

    const chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);
}
