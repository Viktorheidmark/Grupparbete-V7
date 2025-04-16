// With addMdToPage("intro") you can add a title and text to the page. The text is in markdown format, so you can use all the features of markdown. You 
addMdToPage("Intro")

// This is a simple example of how to use the dbQuery function to get data from the database and display it in a table and a chart.
let county = await dbQuery("SELECT lan, folkmangd2024 FROM countyinfo")
tableFromData({ data: county })


// Draw a Google Charts
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(county, "lan", "folkmangd2024"),
  options: {
    title: 'kolumn',
    height: 800,
    chartArea: { left: "10%" }
  }
});


